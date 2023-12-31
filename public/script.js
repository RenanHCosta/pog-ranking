const SUMMONER_API = "summoner";
const LEAGUE_API = "summoner/league";

const TIER_ORDER = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "EMERALD",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
];

const RANK_ORDER = ["IV", "III", "II", "I"];

const players = [
  {
    name: "Smurf do Nenem",
    img: "./nenemz.png",
  },
  {
    name: "Kaikan",
    img: "./kaikan.png",
  },
  {
    name: "Neyans",
    img: "./neyans.png",
  },
  {
    name: "SrSSS",
    img: "./savio.jpg",
  },
  {
    name: "Dreosh",
    img: "./dreosh.png",
  },
  {
    name: "Ieyasu Sawada",
    img: "./gomes.png",
  },
  {
    name: "lele01",
    img: "./lele01.jpg",
  },
  {
    name: "Nekozumi",
    img: "./nunu.png",
  },
  {
    name: "Arzok",
    img: "./arzok.png",
  },
  {
    name: "eigamen",
    img: "",
  },
  {
    name: "laimb meu zovo",
    img: "patric.jpg",
  },
  {
    name: "Srpbl",
    img: "",
  },
  {
    name: "always apleasure",
    img: "./kaikan.png",
  },
  {
    name: "Nenemz",
    img: "./nenemz.png",
  },
  {
    name: "rasks",
    img: "",
  },
];

async function fetchSummonerByName(summonerName) {
  const response = await fetch(`/${SUMMONER_API}/${summonerName}`);
  const data = await response.json();
  return data;
}

async function fetchSummonerLeagues(summonerName) {
  const response = await fetch(`/${LEAGUE_API}/${summonerName}`);
  const data = await response.json();
  return data;
}

async function getSummonersLeagues(summoners) {
  const fetchPromises = summoners.map(async (summoner) => {
    const leagueData = await fetchSummonerLeagues(summoner.name);
    return { summoner, leagueData };
  });

  const summonersWithLeagues = await Promise.all(fetchPromises);

  return summonersWithLeagues;
}

async function fetchClearCache() {
  const response = await fetch(`/clear-cache`);
  const data = await response.json();
  return data;
}

function comparePlayers(playerA, playerB) {
  const tierComparison =
    TIER_ORDER.indexOf(playerB.tier) - TIER_ORDER.indexOf(playerA.tier);

  if (tierComparison === 0) {
    return RANK_ORDER.indexOf(playerB.rank) - RANK_ORDER.indexOf(playerA.rank);
  }

  return tierComparison;
}

function renderRanking(ranking) {
  const rankingWrapper = document.querySelector("#ranking");

  let html = "";

  const orderedPlayers = ranking
    .map((summoner) => {
      if (summoner.leagueData.status) return false;
      const soloQueueData = summoner.leagueData.find(
        (data) => data.queueType === "RANKED_SOLO_5x5"
      );
      if (soloQueueData) return soloQueueData;
    })
    .filter(Boolean)
    .sort(comparePlayers);

  orderedPlayers.forEach((summoner) => {
    const player = players.find(
      (player) => player.name === summoner.summonerName
    );

    const negativeClass = summoner.wins < summoner.losses ? "on" : "off";

    let playerImg = player && player.img ? player.img : "indoali.jpg";

    if (player?.name === "Neyans" && negativeClass === "on") {
      playerImg = "neyanscrime.png";
    }

    html += `
            <div class="summoner">
              <div class="playerimg">
                <img src=${playerImg} />
                <span class="negative ${negativeClass}">CRIMINOSO</span>
                <img class="cadeiaimg ${negativeClass}" src="./grade-cadeia.png"/>
              </div>
                <div class="content">
                    <span>${summoner.summonerName}</span>
                    <div class="elo"><span class="tier ${summoner.tier}">${summoner.tier}</span>
                    <span class="rank">${summoner.rank}</span>
                    <span class="points">${summoner.leaguePoints} LP</span></div>
                    <span class="wins">${summoner.wins} Vitórias</span>
                    <span class="losses ${negativeClass}">${summoner.losses} Derrotas</span>
                </div>
            </div>
        `;
  });

  rankingWrapper.innerHTML = html;
}

getSummonersLeagues(players)
  .then((result) => {
    renderRanking(result);

    const updateBtn = document.getElementById("btn-update");

    updateBtn.addEventListener("click", async () => {
      const tryClear = await fetchClearCache();

      if (tryClear.status === 200) {
        window.location.reload();
      }
    });
  })
  .catch((error) => {
    console.error("Erro geral:", error);
  });
