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
    tag: "BR1",
    img: "./nenemz.png",
  },
  {
    name: "Kaikan",
    tag: "BR1",
    img: "./kaikan.png",
  },
  {
    name: "Neyans",
    tag: "001",
    img: "./neyans.png",
  },
  {
    name: "SrSSS",
    tag: "BR1",
    img: "./savio.jpg",
  },
  {
    name: "Dreosh",
    tag: "BR1",
    img: "./dreosh.png",
  },
  {
    name: "Ieyasu Sawada",
    tag: "BR1",
    img: "./gomes.png",
  },
  {
    name: "Kenai",
    tag: "duo",
    img: "./lele01.jpg",
  },
  {
    name: "Nekozumi",
    tag: "TLS",
    img: "./nunu.png",
  },
  {
    name: "Arzok",
    tag: "BR1",
    img: "./arzok.png",
  },
  {
    name: "bobtheconstrutor",
    tag: "1596",
    img: "",
  },
  {
    name: "laimb meu zovo",
    tag: "BR1",
    img: "patric.jpg",
  },
  {
    name: "Srpbl",
    tag: "BR1",
    img: "",
  },
  {
    name: "always apleasure",
    tag: "BR1",
    img: "./kaikan.png",
  },
  {
    name: "Nenemz",
    tag: "3514",
    img: "./nenemz.png",
  },
  {
    name: "rasks",
    tag: "BR1",
    img: "",
  },
  {
    name: "Raizzeni",
    tag: "Toth",
    img: "./gomes.png",
  },
];

async function fetchSummonerByName(summonerName, tag) {
  const response = await fetch(`/${SUMMONER_API}/${summonerName}/${tag}`);
  const data = await response.json();
  return data;
}

async function fetchSummonerLeagues(summonerName, tag) {
  const response = await fetch(`/${LEAGUE_API}/${summonerName}/${tag}`);
  const data = await response.json();
  return data;
}

async function getSummonersLeagues(summoners) {
  const fetchPromises = summoners.map(async (summoner) => {
    const leagueData = await fetchSummonerLeagues(summoner.name, summoner.tag);
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
    const rankComparison =
      RANK_ORDER.indexOf(playerB.rank) - RANK_ORDER.indexOf(playerA.rank);

    if (rankComparison === 0) {
      return playerB.leaguePoints - playerA.leaguePoints;
    }

    return rankComparison;
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

      if (soloQueueData)
        return {
          ...soloQueueData,
          name: summoner.summoner.name,
          tag: summoner.summoner.tag,
        };
    })
    .filter(Boolean)
    .sort(comparePlayers);

  orderedPlayers.forEach((summoner) => {
    const player = players.find(
      (player) => player.name === summoner.name && player.tag === summoner.tag
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
                    <span>${summoner.name}#${summoner.tag}</span>
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
