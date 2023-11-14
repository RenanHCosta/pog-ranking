import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const server = express();

server.use(cors());
server.use(express.static('public'));

const API_KEY = 'RGAPI-ec9d4872-149c-46cb-b4b2-98f8cac236fc';
const RIOT_BASE_API_URL = 'https://br1.api.riotgames.com';
const SUMMONER_API = 'lol/summoner/v4/summoners/by-name';
const LEAGUE_API = 'lol/league/v4/entries/by-summoner';

// Will most likely be deprecated in the future
async function fetchSummonerByName(summonerName) {
    const response = await fetch(`${RIOT_BASE_API_URL}/${SUMMONER_API}/${summonerName}`, {
        headers: {
            "X-Riot-Token": API_KEY,
        }
    })
    const data = await response.json();
    return data;
}

async function fetchSummonerLeagues(summonerId) {
    const response = await fetch(`${RIOT_BASE_API_URL}/${LEAGUE_API}/${summonerId}`, {
        headers: {
            "X-Riot-Token": API_KEY,
        }
    })
    const data = await response.json();
    return data;
}

server.get("/summoner/:name", async (req, resp) => {
    const summonerName = req.params.name;

    try {
        const summoner = await fetchSummonerByName(summonerName);
        resp.json(summoner);
    } catch (error) {
        console.error(`error: ${error}`);
        resp.status(500).send('Erro interno do servidor');
    }
});

server.get("/summoner/league/:name", async (req, resp) => {
    const summonerName = req.params.name;

    try {
        const { id } = await fetchSummonerByName(summonerName);
        const leagues = await fetchSummonerLeagues(id);

        resp.json(leagues);
    } catch (error) {
        console.error(`error: ${error}`);
        resp.status(500).send('Erro interno do servidor');
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on localhost:${PORT}`);
});