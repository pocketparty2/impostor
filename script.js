// ---------------------------
// ELEMENTS
// ---------------------------
const setupSection = document.getElementById("setup");
const revealSection = document.getElementById("reveal");
const discussionSection = document.getElementById("discussion");
const resultsSection = document.getElementById("results");

const playerNamesInput = document.getElementById("playerNames");
const startGameBtn = document.getElementById("startGameBtn");

const categoryList = document.getElementById("categoryList");

const revealPlayerName = document.getElementById("revealPlayerName");
const revealCard = document.getElementById("revealCard");
const revealText = document.getElementById("revealText");
const nextPlayerBtn = document.getElementById("nextPlayerBtn");

const discussionStarter = document.getElementById("discussionStarter");
const revealResultsBtn = document.getElementById("revealResultsBtn");

const finalWord = document.getElementById("finalWord");
const finalImpostor = document.getElementById("finalImpostor");
const playAgainBtn = document.getElementById("playAgainBtn");

// ---------------------------
// GAME STATE
// ---------------------------
let players = [];
let impostorIndex = null;
let currentRevealIndex = 0;

let chosenWord = null;
let chosenHint = null;

// ---------------------------
// BUILD CATEGORY CHECKBOXES
// ---------------------------
function buildCategoryList() {
  const categories = Object.keys(WORDS);

  categories.forEach(cat => {
    const wrapper = document.createElement("label");
    wrapper.style.display = "block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = cat;
    checkbox.checked = true;

    wrapper.appendChild(checkbox);
    wrapper.append(` ${cat}`);

    categoryList.appendChild(wrapper);
  });
}

buildCategoryList();

// ---------------------------
// START GAME
// ---------------------------
startGameBtn.addEventListener("click", () => {
  const namesRaw = playerNamesInput.value.trim();

  if (!namesRaw) {
    alert("Enter player names first!");
    return;
  }

  players = namesRaw
    .split(",")
    .map(n => n.trim())
    .filter(n => n.length > 0);

  if (players.length < 3) {
    alert("You need at least 3 players.");
    return;
  }

  // Get selected categories
  const selectedCategories = [...categoryList.querySelectorAll("input:checked")].map(c => c.value);

  if (selectedCategories.length === 0) {
    alert("Select at least one category.");
    return;
  }

  // Pick impostor
  impostorIndex = Math.floor(Math.random() * players.length);

  // Pick random category + word
  const randomCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
  const wordData = WORDS[randomCategory][Math.floor(Math.random() * WORDS[randomCategory].length)];

  chosenWord = wordData.word;
  chosenHint = wordData.hint;

  // Move to reveal phase
  setupSection.classList.add("hidden");
  revealSection.classList.remove("hidden");

  currentRevealIndex = 0;
  loadRevealScreen();
});

// ---------------------------
// LOAD REVEAL SCREEN FOR PLAYER
// ---------------------------
function loadRevealScreen() {
  const playerName = players[currentRevealIndex];

  revealPlayerName.textContent = `Player: ${playerName}`;
  revealText.textContent = "Hold to reveal";
  nextPlayerBtn.classList.add("hidden");
}

// ---------------------------
// HOLD-TO-REVEAL LOGIC
// ---------------------------
let holdTimeout = null;

revealCard.addEventListener("mousedown", () => {
  showRole();
});

revealCard.addEventListener("mouseup", () => {
  hideRole();
});

revealCard.addEventListener("mouseleave", () => {
  hideRole();
});

// Touch support
revealCard.addEventListener("touchstart", () => {
  showRole();
});

revealCard.addEventListener("touchend", () => {
  hideRole();
});

// ---------------------------
// SHOW ROLE
// ---------------------------
function showRole() {
  const isImpostor = currentRevealIndex === impostorIndex;

  if (isImpostor) {
    revealText.innerHTML = `
      YOU ARE THE IMPOSTOR<br><br>
      HINT: ${chosenHint}
    `;
  } else {
    revealText.innerHTML = `
      WORD: ${chosenWord}<br><br>
      HINT: ${chosenHint}
    `;
  }

  nextPlayerBtn.classList.remove("hidden");
}

// ---------------------------
// HIDE ROLE
// ---------------------------
function hideRole() {
  revealText.textContent = "Hold to reveal";
}

// ---------------------------
// NEXT PLAYER BUTTON
// ---------------------------
nextPlayerBtn.addEventListener("click", () => {
  currentRevealIndex++;

  if (currentRevealIndex >= players.length) {
    // Move to discussion phase
    revealSection.classList.add("hidden");
    discussionSection.classList.remove("hidden");

    const starter = players[Math.floor(Math.random() * players.length)];
    discussionStarter.textContent = `${starter} starts the conversation.`;

    return;
  }

  loadRevealScreen();
});

// ---------------------------
// REVEAL RESULTS
// ---------------------------
revealResultsBtn.addEventListener("click", () => {
  discussionSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  finalWord.textContent = `The word was: ${chosenWord}`;
  finalImpostor.textContent = `The impostor was: ${players[impostorIndex]}`;
});

// ---------------------------
// PLAY AGAIN
// ---------------------------
playAgainBtn.addEventListener("click", () => {
  resultsSection.classList.add("hidden");
  setupSection.classList.remove("hidden");

  playerNamesInput.value = "";
});
