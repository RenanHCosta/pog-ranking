
const BASE_API_URL = 'http://localhost:3000';
const SUMMONER_API = 'summoner';
const LEAGUE_API = 'summoner/league'

const TIER_ORDER = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"]

const RANK_ORDER = ["IV", "III", "II", "I"];

const players = [
    "Smurf do Nenem",
    "Kaikan",
    "Neyans",
    "SrSSS",
    "Dreosh",
    "Ieyasu Sawada",
    "lele01",
    "Nekozumi",
    "Arzok",
    "eigamen",
    "laimb meu zovo"
];

async function fetchSummonerByName(summonerName) {
    const response = await fetch(`${BASE_API_URL}/${SUMMONER_API}/${summonerName}`)
    const data = await response.json();
    return data;
}

async function fetchSummonerLeagues(summonerName) {
    const response = await fetch(`${BASE_API_URL}/${LEAGUE_API}/${summonerName}`)
    const data = await response.json();
    return data;
}

async function getSummonersLeagues(summoners) {
    const fetchPromises = summoners.map(async (summoner) => {
        const leagueData = await fetchSummonerLeagues(summoner);
        return { summoner, leagueData };
    });

    const summonersWithLeagues = await Promise.all(fetchPromises);

    return summonersWithLeagues;
}

function comparePlayers(playerA, playerB) {
    const tierComparison = TIER_ORDER.indexOf(playerB.tier) - TIER_ORDER.indexOf(playerA.tier);

    if (tierComparison === 0) {
        return RANK_ORDER.indexOf(playerB.rank) - RANK_ORDER.indexOf(playerA.rank);
    }

    return tierComparison;
}

function renderRanking(ranking) {
    const rankingWrapper = document.querySelector("#ranking");

    let html = '';

    const orderedPlayers = ranking.map(summoner => {
        if (summoner.leagueData.status) return false;
        const soloQueueData = summoner.leagueData.find(data => data.queueType === 'RANKED_SOLO_5x5');
        if (soloQueueData) return soloQueueData;
    }).filter(Boolean).sort(comparePlayers);

    orderedPlayers.forEach((summoner) => {
        html += `
            <div class="summoner">
                <span>${summoner.summonerName}</span>
                <div class="content">
                    <span class="tier ${summoner.tier}">${summoner.tier}</span>
                    <span class="rank">${summoner.rank}</span>
                    <span class="points">${summoner.leaguePoints} LP</span>
                    <span class="wins">${summoner.wins} V</span>
                    <span class="losses">${summoner.losses} D</span>
                </div>
            </div>
        `;
    })

    rankingWrapper.insertAdjacentHTML("afterbegin", html);
}

getSummonersLeagues(players)
    .then((result) => {
        renderRanking(result);
    })
    .catch((error) => {
        console.error('Erro geral:', error);
    });