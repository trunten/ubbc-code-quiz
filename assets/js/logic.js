// Notes on the js files:

// - Break the code up into functions:

//     - Start the quiz (which of the below functions can be called when we start the quiz?)

//     - Get Question and display it on the page 
//         - Grabbing the question from the questions array inside of questions.js file. 
//         - These get displayed in the choices div.
//         - What happens when each choice has been clicked? 
//             - Need to display feedback: lets the user know if it was answered correctly or incorrectly. 
//             - Also, need to play a sound effect if it is right or wrong. There is a folder with two different sound effects inside. 
//             The Audio needs to be imported into logic.js:
                
//             var sfxRight = new Audio("assets/sfx/correct.wav");
//             var sfxWrong = new Audio("assets/sfx/incorrect.wav");
            
//             Example of how to call:
//             sfxWrong.play();
//             - If the user answers incorrectly then time is taken off of the timer
    
//     - End the Quiz
//         - what needs to happen here? 
//         - Display high scores
//         - Stop the timer

//     - function to handle saving the high score
//     - make sure to add the final score to local storage

const INITIAL_TIME = 20;

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
    correctSound = new Audio("assets/sfx/correct.wav");
    incorrectSound = new Audio("assets/sfx/incorrect.wav");

    // add event liteners
    startButton.addEventListener("click", start);
    questionChoicesEl.addEventListener("click",checkAnswer);
    submitButton.addEventListener("click", submitScore)
}

function start() {
    timeRemaining = INITIAL_TIME;
    questionFeedbackEl.textContent = ""
    questionFeedbackEl.classList.remove("hide");
    timer = setInterval(function() {
        if (timeRemaining > 0) {
            timeRemaining--;
            timeLeftEl.textContent = timeRemaining;
        } else {
            end();
        }
    }, 1000);
    startScreenEl.classList.add("hide");
    timeLeftEl.textContent = timeRemaining;
    nextQuestion();
} 

function end() {
    clearInterval(timer);
    questionsContainerEl.classList.add("hide");
    questionFeedbackEl.classList.add("hide")
    questionTitleEl.textContent = "";
    questionChoicesEl.innerHTML = "";
    questionFeedbackEl.textContent = "";
    endScreenEl.classList.remove("hide");
    finalScoreEl.textContent = timeRemaining;
}

function saveHighScores() {
    localStorage.setItem("scores", JSON.stringify(highScores));
}

function getHighScores() {
    let savedScores = JSON.parse(localStorage.getItem("scores"));
    if (savedScores) { highScores = savedScores; }
}

function submitScore(e) {
    e.preventDefault();
    let initials = initialsInput.value.trim().toUpperCase();
    if (initials) {
        let score = {
            initials: initials,
            score: timeRemaining
        }
        getHighScores();
        highScores.push(score);
        saveHighScores();
        document.querySelector("a").click();
    } else {
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
    } else {
        // If we've answered all the questions then we can finish
        end();
    }
}

function renderQuestion() {
    questionFeedbackEl.textContent = "";
    questionChoicesEl.innerHTML = "";
    let question = questions[quesitonNumber];
    questionTitleEl.textContent = question.question;
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
        let givenAnswer = e.target.dataset.answer;
        // Check this so the user can't just spoof there way through by clicking multiple times
        // before the next question is fully rendered.
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
            setTimeout(nextQuestion, 1000);
        } 
    }   
}

// Only start initialising vairable once html content is fully rendered
window.onload = init();

