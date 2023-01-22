const INITIAL_TIME = 15;

let highScores = [];
let timer;
let timeRemaining;
let quesitonNumber;
let timeLeftEl;
let startScreenEl;
let startButton;
let questionsContainerEl;
let questionTitleEl;
let questionChoicesEl;
let questionFeedbackEl;
let endScreenEl;
let finalScoreEl;
let initialsInput;
let submitButton;
let correctSound;
let incorrectSound;

function init() {
    //Set references to page elements
    timeLeftEl = document.getElementById("time");
    startScreenEl  = document.getElementById("start-screen");
    startButton = document.getElementById("start");
    questionsContainerEl  = document.getElementById("questions");
    questionTitleEl  = document.getElementById("question-title");
    questionChoicesEl  = document.getElementById("choices");
    questionFeedbackEl =document.getElementById("feedback");
    endScreenEl  = document.getElementById("end-screen");
    finalScoreEl  = document.getElementById("final-score");
    initialsInput  = document.getElementById("initials");
    submitButton  = document.getElementById("submit");

    // Initialise audio
    correctSound = new Audio("./assets/sfx/correct.wav");
    incorrectSound = new Audio("./assets/sfx/incorrect.wav");

    // add event liteners
    startButton.addEventListener("click", start);
    questionChoicesEl.addEventListener("click",checkAnswer);
    submitButton.addEventListener("click", submitScore)
    initialsInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") { submitScore(e) }
    });
}

function start() {
    // Set the time of the quiz
    timeRemaining = INITIAL_TIME;

    // clear any existing content from the feeback elemment and show it
    questionFeedbackEl.textContent = ""
    questionFeedbackEl.classList.remove("hide");

    // Start a timer that will coutdown the time remaining and end the game at 0
    timer = setInterval(function() {
        if (timeRemaining > 0) { // Still time remaining. Decrease timeRemaining by 1 and update display
            timeRemaining--;
            timeLeftEl.textContent = timeRemaining;
        } else { // Out of time; end
            end();
        }
    }, 1000);

    // Hide the start screen
    startScreenEl.classList.add("hide");

    // Set time left content to the initial quiz time
    timeLeftEl.textContent = timeRemaining;

    // On to the first question :)
    nextQuestion();
} 

function end() {
    // clear the timer so it stop couting down/executing
    clearInterval(timer);

    // Hide the questions & question feedback
    questionsContainerEl.classList.add("hide");
    questionFeedbackEl.classList.add("hide");

    // Reset questions content just in case the element is made visible again by the user
    questionTitleEl.textContent = "";
    questionChoicesEl.innerHTML = "";
    questionFeedbackEl.textContent = "";

    // Show the end screen
    endScreenEl.classList.remove("hide");

    // Set the final score text to the time remaining
    finalScoreEl.textContent = timeRemaining;
}

function saveHighScores() {
    // Turn high scores array to a string and save to local storage
    localStorage.setItem("scores", JSON.stringify(highScores));
}

function getHighScores() {
    // Get saved data from local storage and parse string
    let savedScores = JSON.parse(localStorage.getItem("scores"));

    // If anything was retured update high scores array with the previously stored array
    if (savedScores) { highScores = savedScores; }
}

function submitScore(e) {
    e.preventDefault();
    // If the score was somehow being submitted before a timer was set
    // suspect cheating and set timeRemaing to minus 99.
    if (timeRemaining === undefined) { timeRemaining = -99; } //No-one likes a cheater
    // Get initals from input, trim whitespace and change to uppercase
    let initials = initialsInput.value.trim().toUpperCase();
    if (initials) { // If anything was entered
        // Create object to record score details
        let score = {
            initials: initials,
            score: timeRemaining,
            quizTime: new Date().toISOString(),
        }

        // get currently stored highscores array
        getHighScores();

        // Add new score to array of high scores
        highScores.push(score);

        //Save updated high socres array
        saveHighScores();

        //Go to the high socres page
        document.querySelector("a").click();
    } else { // Nothing entered
        alert("Initials can't be blank");
    }
}

function nextQuestion() {
    console.log(quesitonNumber);
    if (quesitonNumber != undefined) {
        // When we first begin question number is not initialised to only increment
        // if we're already mid-game.
        quesitonNumber++;
    } else {
        quesitonNumber = 0;
    }
    if (quesitonNumber < questions.length) {
        // On to the next question if there's still some questions left
        renderQuestion();
        questionChoicesEl.addEventListener("click", checkAnswer);
    } else {
        // If we've answered all the questions then we can finish
        end();
    }
}

function renderQuestion() {
    // Clear current feedback
    questionFeedbackEl.textContent = "";

    // Clear current question choices
    questionChoicesEl.innerHTML = "";

    // Get the current question object from the array
    let question = questions[quesitonNumber];

    //Set the question title
    questionTitleEl.textContent = question.question;

    // Loop through all the question choices and add to the question choices elemetn
    for (let choice of question.choices) {
        let btn = document.createElement("button");
        btn.dataset.answer = choice;
        btn.textContent = choice;
        questionChoicesEl.appendChild(btn);
    }
    // Show the question container and feedback container if they were not already
    // visible (only occurs for the first question).
    // Only removes the class if it's there so no need to check with an if
    questionsContainerEl.classList.remove("hide");
    questionFeedbackEl.classList.remove("hide");
}

function checkAnswer(e) {
    e.preventDefault();
    if (e.target.matches("button")) {
        // Remove it to stop double clicks.
        questionChoicesEl.removeEventListener("click", checkAnswer);
        let givenAnswer = e.target.dataset.answer;
        // Check this so the user can't just spoof there way through by clicking multiple times
        // before the next question is fully rendered. For some reason just removing the
        // click event was not enough on it's own.
        if (questions[quesitonNumber].choices.includes(givenAnswer)) {
            if (givenAnswer === questions[quesitonNumber].answer) {
                // If the correct answer matched the answer clicked then play a happy sound!
                questionFeedbackEl.textContent = "Correct!"
                correctSound.load(); // Sound only played in full once without this. Weird.
                correctSound.play();
            } else {
                // Otherwise play a not so happy sound and decrease the time reamining
                timeRemaining--;
                timeLeftEl.textContent = timeRemaining;
                questionFeedbackEl.textContent = "Wrong!"
                incorrectSound.load(); // Sound only played in full once without this. Weird.
                incorrectSound.play();
            }
            // Go to the next question in 1 second so there's chance to hear the sound and
            // view the question feedback.
            setTimeout(nextQuestion, 700);
        } 
    }   
}

// Only start initialising vairable once html content is fully rendered
window.onload = init();

