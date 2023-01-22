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

let highScores;
let timer;
let quesiton;

function setHighScores() {

}

function getHighScores() {
    
}

function saveScore() {

}

function startTimer() {

}

function stopTimer() {

}

function win() {

}

function lose() {

}

function renderQuestion() {

}

function checkAnswer() {

}

function start() {

} 

function init() {

}

window.onload = init();


