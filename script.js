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
const revealBackText = document.getElementById("revealBackText");
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
// RANDOM CARD COLORS
// ---------------------------
function randomColor() {
  const colors = [
    "#ff6b6b", "#ff9f43", "#feca57", "#1dd1a1",
    "#48dbfb", "#54a0ff", "#5f27cd", "#c56cf0",
    "#ff9ff3", "#f368e0"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

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
  revealBackText.textContent = "";

  // Reset flip state
  revealCard.classList.remove("holding");

  // Assign random colors to this player's card
  const front = document.querySelector(".reveal-front");
  const back = document.querySelector(".reveal-back");

  const color = randomColor();
  front.style.background = color;
  back.style.background = color;

  // Next button always visible
  nextPlayerBtn.classList.remove("hidden");
}

// ---------------------------
// HOLD-TO-REVEAL LOGIC
// ---------------------------
function showRole() {
  const isImpostor = currentRevealIndex === impostorIndex;

  if (isImpostor) {
    revealBackText.innerHTML = `
      YOU ARE THE IMPOSTOR<br><br>
      HINT: ${chosenHint}
    `;
  } else {
    revealBackText.innerHTML = `
      WORD: ${chosenWord}
    `;
  }

  revealCard.classList.add("holding");
}

function hideRole() {
  revealCard.classList.remove("holding");
}

// Mouse events
revealCard.addEventListener("mousedown", showRole);
revealCard.addEventListener("mouseup", hideRole);
revealCard.addEventListener("mouseleave", hideRole);

// Touch events
revealCard.addEventListener("touchstart", showRole);
revealCard.addEventListener("touchend", hideRole);

// ---------------------------
// NEXT PLAYER BUTTON
// ---------------------------
nextPlayerBtn.addEventListener("click", () => {
  // Slide out animation
  revealCard.classList.add("slide-out");

  setTimeout(() => {
    revealCard.classList.remove("slide-out");
    revealCard.classList.add("slide-in");

    currentRevealIndex++;

    if (currentRevealIndex >= players.length) {
      revealSection.classList.add("hidden");
      discussionSection.classList.remove("hidden");

      const starter = players[Math.floor(Math.random() * players.length)];
      discussionStarter.textContent = `${starter} starts the conversation.`;
      return;
    }

    loadRevealScreen();

    setTimeout(() => {
      revealCard.classList.remove("slide-in");
    }, 250);

  }, 250);
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
