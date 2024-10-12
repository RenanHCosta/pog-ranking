import cors from "cors";
import express from "express";

const PORT = process.env.PORT || 3000;
const server = express();

server.use(cors());
server.use(express.static("public"));

const API_KEY = "RGAPI-8ca45cc8-62f1-47b4-bd7f-79f163577d9f";
const RIOT_AMERICAS_BASE_API_URL = "https://americas.api.riotgames.com";
const RIOT_BR1_BASE_API_URL = "https://br1.api.riotgames.com";
const PUUID_API = "riot/account/v1/accounts/by-riot-id";
const SUMMONER_API = "lol/summoner/v4/summoners/by-puuid";
const LEAGUE_API = "lol/league/v4/entries/by-summoner";

const leaguesCache = [];

async function fetchSummonerByNameAndTag(summonerName, tag) {
  const response = await fetch(
    `${RIOT_AMERICAS_BASE_API_URL}/${PUUID_API}/${summonerName}/${tag}`,
    {
      headers: {
        "X-Riot-Token": API_KEY,
      },
    }
  );

  const data = await response.json();
  return data;
}

// Will most likely be deprecated in the future
async function fetchSummonerByPuuid(Puuid) {
  const response = await fetch(
    `${RIOT_BR1_BASE_API_URL}/${SUMMONER_API}/${Puuid}`,
    {
      headers: {
        "X-Riot-Token": API_KEY,
      },
    }
  );

  const data = await response.json();
  return data;
}

async function fetchSummonerLeagues(summonerId) {
  const response = await fetch(
    `${RIOT_BR1_BASE_API_URL}/${LEAGUE_API}/${summonerId}`,
    {
      headers: {
        "X-Riot-Token": API_KEY,
      },
    }
  );
  const data = await response.json();
  return data;
}

server.get("/clear-cache", async (_req, resp) => {
  leaguesCache.length = 0;
  resp.sendStatus(200);
});

server.get("/summoner/:name/:tag", async (req, resp) => {
  const summonerName = req.params.name;
  const tag = req.params.tag;

  try {
    const { puuid } = await fetchSummonerByNameAndTag(summonerName, tag);

    const summoner = await fetchSummonerByPuuid(puuid);
    resp.json(summoner);
  } catch (error) {
    console.error(`error: ${error}`);
    resp.status(500).send("Erro interno do servidor");
  }
});

server.get("/summoner/league/:name/:tag", async (req, resp) => {
  const summonerName = req.params.name;
  const tag = req.params.tag;

  try {
    const perCache = leaguesCache.find(
      (league) => league[0]?.summonerName === summonerName
    );

    if (perCache) {
      return resp.json(perCache);
    }

    const { puuid } = await fetchSummonerByNameAndTag(summonerName, tag);

    const { id } = await fetchSummonerByPuuid(puuid);
    const leagues = await fetchSummonerLeagues(id);

    if (!leagues.status) {
      leaguesCache.push(leagues);
    }

    resp.json(leagues);
  } catch (error) {
    console.error(`error: ${error}`);
    resp.status(500).send("Erro interno do servidor");
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on localhost:${PORT}`);
});
