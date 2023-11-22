import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const server = express();

server.use(cors());
server.use(express.static("public"));

const API_KEY = "RGAPI-8ca45cc8-62f1-47b4-bd7f-79f163577d9f";
const RIOT_BASE_API_URL = "https://br1.api.riotgames.com";
const SUMMONER_API = "lol/summoner/v4/summoners/by-name";
const LEAGUE_API = "lol/league/v4/entries/by-summoner";

const leaguesCache = [];

// Will most likely be deprecated in the future
async function fetchSummonerByName(summonerName) {
  const response = await fetch(
    `${RIOT_BASE_API_URL}/${SUMMONER_API}/${summonerName}`,
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
    `${RIOT_BASE_API_URL}/${LEAGUE_API}/${summonerId}`,
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

server.get("/summoner/:name", async (req, resp) => {
  const summonerName = req.params.name;

  try {
    const summoner = await fetchSummonerByName(summonerName);
    resp.json(summoner);
  } catch (error) {
    console.error(`error: ${error}`);
    resp.status(500).send("Erro interno do servidor");
  }
});

server.get("/summoner/league/:name", async (req, resp) => {
  const summonerName = req.params.name;

  try {
    const perCache = leaguesCache.find(
      (league) => league[0].summonerName === summonerName
    );

    if (perCache) {
      return resp.json(perCache);
    }

    const { id } = await fetchSummonerByName(summonerName);
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
