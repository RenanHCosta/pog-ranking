const videoSectionElement = document.getElementById("video-section");
const playerSelectorElement = document.getElementById("player-selector");
let correctPlayer = null;

const players = [
  {
    name: "Nenemz",
    nickname: "Smurf do Nenem",
    img: "./nenemz.png",
    videos: [],
  },
  {
    name: "Kaikan",
    nickname: "Kaikan",
    img: "./kaikan.png",
    videos: [],
  },
  {
    name: "Neyans",
    nickname: "Neyans",
    img: "./neyans.png",
    videos: [],
  },
  {
    name: "Savio",
    nickname: "SrSSS",
    img: "./savio.jpg",
    videos: [],
  },
  {
    name: "Gable",
    nickname: "Dreosh",
    img: "./dreosh.png",
    videos: [],
  },
  {
    name: "Gomes",
    nickname: "Ieyasu Sawada",
    img: "./gomes.png",
    videos: ["1"],
  },
  {
    name: "Leley",
    nickname: "lele01",
    img: "./lele01.jpg",
    videos: [],
  },
  {
    name: "Nunu",
    nickname: "Nekozumi",
    img: "./nunu.png",
    videos: [],
  },
  {
    name: "Arzok",
    nickname: "Arzok",
    img: "./arzok.png",
    videos: [],
  },
  {
    name: "Bob",
    nickname: "eigamen",
    img: "",
    videos: [],
  },
  {
    name: "Patrick",
    nickname: "laimb meu zovo",
    img: "patric.jpg",
    videos: [],
  },
  {
    name: "Pablo",
    nickname: "Srpbl",
    img: "",
    videos: [],
  },
  {
    name: "Kaikan",
    nickname: "always apleasure",
    img: "./kaikan.png",
    videos: [],
  },
  {
    name: "Nenemz",
    nickname: "Nenemz",
    img: "./nenemz.png",
    videos: [],
  },
  {
    name: "Gomes",
    nickname: "rasks",
    img: "./gomes.png",
    videos: [],
  },
];

function getRandomVideo(player) {
  const rnd = player.videos[Math.floor(Math.random() * player.videos.length)];

  return `/videos/${player.name}/${rnd}.mkv`;
}

function getRandomPlayer() {
  const rnd = players[Math.floor(Math.random() * players.length)];

  if (rnd.videos.length) return rnd;
  return getRandomPlayer();
}

function renderPlayerSelector() {
  let html = ``;

  players.forEach((player) => {
    const imageSrc = !player.img ? "indoali.jpg" : player.img;

    html += `
            <div class="player" data-player="${player.name}">
                <img src=${imageSrc} />
                <span>${player.name} (${player.nickname})</span>
            </div>
        `;
  });

  playerSelectorElement.innerHTML = html;

  const playersElements = playerSelectorElement.querySelectorAll(".player");
  playersElements.forEach((elm) => {
    elm.addEventListener("click", () => {
      const thisPlayer = elm.getAttribute("data-player");

      if (thisPlayer === correctPlayer.name) {
        alert("Correto!");
      } else {
        alert("Errou!");
      }
    });
  });
}

function init() {
  const player = getRandomPlayer();
  const video = getRandomVideo(player);

  correctPlayer = player;

  videoSectionElement.innerHTML = `
    <video controls>
        <source src="${video}" type="video/mp4">
    </video>
  `;
}

init();
renderPlayerSelector();
