const playerNamesInput = document.getElementById("playerNames");
const commonWordInput = document.getElementById("commonWord");
const impostorHintInput = document.getElementById("impostorHint");
const startGameBtn = document.getElementById("startGameBtn");
const setupSection = document.getElementById("setup");
const gameSection = document.getElementById("game");
const playersContainer = document.getElementById("playersContainer");

let players = [];
let impostorIndex = null;
let revealed = {}; // track which players have revealed

startGameBtn.addEventListener("click", () => {
  const namesRaw = playerNamesInput.value.trim();
  const commonWord = commonWordInput.value.trim();
  const impostorHint = impostorHintInput.value.trim();

  if (!namesRaw || !commonWord || !impostorHint) {
    alert("Fill in all fields first!");
    return;
  }

  const names = namesRaw
    .split(",")
    .map(n => n.trim())
    .filter(n => n.length > 0);

  if (names.length < 3) {
    alert("You need at least 3 players for this to be fun.");
    return;
  }

  players = names;
  impostorIndex = Math.floor(Math.random() * players.length);
  revealed = {};

  setupSection.classList.add("hidden");
  gameSection.classList.remove("hidden");

  renderPlayerCards(commonWord, impostorHint);
});

function renderPlayerCards(commonWord, impostorHint) {
  playersContainer.innerHTML = "";

  players.forEach((name, index) => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.dataset.index = index;

    const nameEl = document.createElement("div");
    nameEl.className = "player-name";
    nameEl.textContent = name;

    const wordEl = document.createElement("div");
    wordEl.className = "player-word";
    wordEl.textContent = "Click to reveal";

    card.appendChild(nameEl);
    card.appendChild(wordEl);

    card.addEventListener("click", () => {
      const i = parseInt(card.dataset.index, 10);

      if (!revealed[i]) {
        // First click: show word/hint
        if (i === impostorIndex) {
          wordEl.textContent = `Hint: ${impostorHint}`;
        } else {
          wordEl.textContent = `Word: ${commonWord}`;
        }
        revealed[i] = true;
      } else {
        // Second click: hide again (optional)
        wordEl.textContent = "Click to reveal";
        revealed[i] = false;
      }
    });

    playersContainer.appendChild(card);
  });
}
