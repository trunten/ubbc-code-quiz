// Import questions
import { questions } from "./questions.js";

// Global variables
let timer;
let timeRemaining;
let quesitonNumber;
let questionScore = 0;
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
let reloadSounds =false;

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
    document.getElementById("modal-button").addEventListener("click",function() {
        document.querySelector(".modal").close();
    });

    // Variable to see if I need to reload the sounds each question (Audio fix for safari)
    if (!navigator.userAgent.match(/chrome|chromium|crios/i) 
            && !navigator.userAgent.match(/edg/i)
            && navigator.userAgent.match(/safari/i) ) { 
        reloadSounds = true;
    };
}

function start() {
    // Set the time of the quiz
    timeRemaining = getInitialTime();;

    // clear any existing content from the feeback elemment and show it
    questionFeedbackEl.textContent = ""
    questionFeedbackEl.classList.remove("hide");

    // Start a timer that will coutdown the time remaining and end the game at 0
    timer = setInterval(function() {
        if (timeRemaining > 0) { // Still time remaining. Decrease timeRemaining by 1 and update display
            timeRemaining--;
            updateTimeRemaining();
        } else { // Out of time; end
            end();
        }
    }, 1000);

    // Hide the start screen
    startScreenEl.classList.add("hide");

    // Set time left content to the initial quiz time
    updateTimeRemaining();

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
    questionFeedbackEl.dataset.value = "";

    // Show the end screen
    endScreenEl.classList.remove("hide");

    // Set the final score text to the time remaining plus the question score.
    // The question score is a running total of the number of correct answers.
    // Decided this would give a nice bonus to someone who answered slowly but got everything right.
    questionScore = questionScore + timeRemaining;
    finalScoreEl.textContent = questionScore;
}

function submitScore(e) {
    e.preventDefault();
    // If the score was somehow being submitted before a timer was set
    // suspect cheating and set timeRemaing to minus 99.
    if (timeRemaining === undefined) { questionScore = -99; } //No-one likes a cheater
    // Get initals from input, trim whitespace and change to uppercase
    let initials = initialsInput.value.trim().toUpperCase();
    if (initials) { // If anything was entered
        // Create object to record score details
        let score = {
            initials: initials,
            score: questionScore,
            quizTime: new Date().toISOString(), // Added quiz time in case I decide to use it later
        }

        // Get saved data from local storage, parse string and assign to highScores varaible
        // Assign an empty array if nothing exists in local storage.
        let highScores = JSON.parse(localStorage.getItem("scores")) || [];

        // Add new score to array of high scores
        highScores.push(score);

        // Save updated high scores array to local storage
        localStorage.setItem("scores", JSON.stringify(highScores));

        //Go to the high scores page
        window.location.href = "highscores.html"
    } else { // Nothing entered. Inform the user input is required.
        document.querySelector(".modal").showModal();
    }
}

function nextQuestion() {
    // Fix for sound issue in safari on macOS and iOS. Sound only played in full once without this.
    if (reloadSounds) { 
        correctSound.load(); 
        incorrectSound.load(); 
    }
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
    questionFeedbackEl.dataset.value = "";

    // Clear current question choices
    questionChoicesEl.innerHTML = "";

    // Get the current question object from the array
    let question = questions[quesitonNumber];

    //Set the question title
    questionTitleEl.textContent = question.question;

    // Loop through all the question choices and add to the question choices element
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
                // If the correct answer matched the answer clicked then increase question score by one and play a happy sound!
                questionScore++;
                questionFeedbackEl.textContent = "Correct!";
                questionFeedbackEl.dataset.value = "correct";
                correctSound.play();
            } else {
                // Otherwise, play a not so happy sound and decrease the time reamining
                timeRemaining-= getDecrement();
                updateTimeRemaining();
                questionFeedbackEl.textContent = "Wrong!";
                questionFeedbackEl.dataset.value = "incorrect";
                incorrectSound.play();
            }
            if (timeRemaining > 0) {
                // If there's still time left on the clock Go to the next question after a
                // slight delay so there's chance to hear the sound and view the question feedback.
                setTimeout(nextQuestion, 700);
            } else {
                // Wrong answer has taken the time remaining to zero or below so set time 
                // to zero (don't want a negative time remaining!) and end the game.
                // Slight delay again to hear the sound and view feedback.
                timeRemaining = 0;
                setTimeout(end, 700);
            }
        } 
    }   
}

// Helper function to get the length of the quiz. This should be the number of
// questions multiplied by 10. 10 seconds per question seems fair.
function getInitialTime() {
    let time = questions.length * 10;
    return time;
}

// Helper function to get time penalty for a wrong answer. Set to just 10 for   
// now but using a function just in case I decide to change the logic later.
function getDecrement() {
    return 10;
}

//Function to update time remaining and give it red text when there's only 5 seconds (or less) left.
function updateTimeRemaining() {
    timeLeftEl.textContent = Math.max(0, timeRemaining);
    if (timeRemaining <= 5) {
        // Can't decide if it's better to have just the time or the whole div red. May change this later (ditto in else block)
        // document.querySelector(".timer").classList.add("red-text"); 
        timeLeftEl.classList.add("red-text");
    } else {
        // document.querySelector(".timer").classList.remove("red-text");
        timeLeftEl.classList.remove("red-text");
    }
}

// Initialise app
init();

