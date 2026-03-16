// script.js
const playerNamesInput = document.getElementById("playerNames");
const startGameBtn = document.getElementById("startGameBtn");
const setupSection = document.getElementById("setup");
const gameSection = document.getElementById("game");
const playersContainer = document.getElementById("playersContainer");

let players = [];
let impostorIndex = null;
let revealed = {};
let chosenWord = null;
let chosenHint = null;

startGameBtn.addEventListener("click", () => {
  const namesRaw = playerNamesInput.value.trim();

  if (!namesRaw) {
    alert("Enter player names first!");
    return;
  }

  const names = namesRaw
    .split(",")
    .map(n => n.trim())
    .filter(n => n.length > 0);

  if (names.length < 3) {
    alert("You need at least 3 players.");
    return;
  }

  players = names;
  impostorIndex = Math.floor(Math.random() * players.length);
  revealed = {};

  // Pick random category
  const categories = Object.keys(WORDS);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];

  // Pick random word from that category
  const wordData = WORDS[randomCategory][Math.floor(Math.random() * WORDS[randomCategory].length)];
  chosenWord = wordData.word;
  chosenHint = wordData.hint;

  setupSection.classList.add("hidden");
  gameSection.classList.remove("hidden");

  renderPlayerCards();
});

function renderPlayerCards() {
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
        if (i === impostorIndex) {
          wordEl.textContent = `Hint: ${chosenHint}`;
        } else {
          wordEl.textContent = `Word: ${chosenWord}`;
        }
        revealed[i] = true;
      } else {
        wordEl.textContent = "Click to reveal";
        revealed[i] = false;
      }
    });

    playersContainer.appendChild(card);
  });
}
