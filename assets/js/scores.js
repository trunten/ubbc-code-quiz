let highScores;
let highscoresListEl;
let clearButton;

function renderHighScores() {
    highscoresListEl.innerHTML = "";
    if (highScores) {
        highScores.sort((a, b) => b.score - a.score); // Sort highest to lowest score
        for (let score of highScores) {
            let li = document.createElement("li");
            li.textContent = score.initials + " - " + score.score
            highscoresListEl.appendChild(li);
        }
    }
}

function clearHighScores() {
    highscoresListEl.innerHTML = "";
    localStorage.removeItem("scores");
}

function init() {
    highscoresListEl = document.getElementById("highscores");
    clearButton = document.getElementById("clear");
    clearButton.addEventListener("click", clearHighScores);
    highScores = JSON.parse(localStorage.getItem("scores"));
    renderHighScores();
}

// Initialise app
init();

