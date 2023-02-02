const questions = [
    {
        questionText: "Question 1",
        options: ["1,2,3,4"],
        answer: "1",
    },
    {
        questionText: "Question 2",
        options:["1,2,3,4"],
        answer: "1",
    },
    {
        questionText: "Question 3",
        options:["1,2,3,4"],
        answer:"1",
    },
    {
        questionText: "question 4",
        options:["1,2,3,4"],
        answer:"1",
    },
    {
        questionText: "question 5",
        options: ["1,2,3,4"],
        answer:"1"
    },
];
const startCard = document.querySelector("#start-card");
const questioncard = document.querySelector("#question-card");
const scorecard = document.querySelector("#score-card");
const leaderboardCard = document.querySelector("#leaderboard-card");

function hideCards() {
    startCard.setAttribute("hidden", true);
    questioncard.setAttribute("hidden", true);
    scorecard.setAttribute("hidden", true);
    leaderboardCard.setAttribute("hidden", true);
}
const resultDiv = document.querySelector("#result-div");
const resultText = document.querySelector("#result-text");

function hideResultText(){
    resultDiv.style.display = "none";
}
var intervalID;
var time;
var currentQuestion;
document.querySelector("#start-button").addEventListener("click", startQuiz);
function startQuiz(){
    hideCards();
    questioncard.removeAttribute("hidden");
    currentQuestion = 0;
    displayQuestion();
    time = questions.lenght * 10;
    intervalID = setInterval(countdown, 1000);
    displayTime();
}
function countdown() {
    time--;
    displayTime();
    if (time < 1) {
        endQuiz();
    }
}
const timeDisplay = document.querySelector("#time");
function displayTime(){
    timeDisplay.textContent = time;
}
function displayQuestion () {
    let question = questions[currentQuestion];
    let options = question.options;

    let h2QuestionElement = document.querySelector("#question-text");
    h2QuestionElement.textContent = question.questionText;

    for (let i = 0; i <options.length; i++) {
        let option = options[i];
        let optionButton = document.querySelector("#option" + i);
        optionButton.textContent = option;
    }
}

document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

function optionCorrect(optionButton) {
    return optionButton.textContent === questions[currentQuestion].answer;
}

function checkAnswer(eventObject) {
    let optionButton = eventObject.target;
    resultDiv.style.display = "block";
    if (optionCorrect(optionButton)) {
        resultText.textContent = "Correct!";
        setTimeout(hideResultText, 1000);
    } else {
        resultText.textContent = "Incorrect!";
        setTimeout(hideResultText, 1000);
        if (time >= 10) {
            time = time - 10;
            displayTime();
        } else {
            time = 0;
            displayTime();
            endQuiz();
        } 
    }
    currentQuestion++;
    if (currentQuestion < questions.lenght) {
        displayQuestion();
    } else {
        endQuiz();
    }
}
const score = document.querySelector("#score");
function endQuiz(){
    clearInterval(intervalID);
    hideCards();
    scorecard.removeAttribute("hidden");
    score.textContent = time;
}
const submitButton = document.querySelector("#submit-button");
const inputElement = document.querySelector("#initials");
submitButton.addEventListener("click", storeScore);
function storeScore(event) {
    event.preventDefault();
    if (!inputElement.value) {
        alert("Please enter Your Initials before pressing submit!");
        return;
    }
    let leaderboardItem = {
        initials: inputElement.value,
        score: time,
    };
    updateStoredLeaderboard(leaderboardItem);
    hideCards();
    leaderboardCard.removeAttribute("hidden");
    renderLeaderboard();
}
function updateStoredLeaderboard(leaderboardItem) {
    let leaderboardArray = getLeaderboard();
    leaderboardArray.push(leaderboardItem);
    localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}
function getLeaderboard() {
let storedLeaderboard = localStorage.getItem("leaderboardArray");
if (storedLeaderboard !== null) {
    let leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
} else {
    leaderboardCard = [];
}
return leaderboardCard;
}
function renderLeaderboard(){
    let sortedLeaderboardArray = sortLeaderboard();
    const highscoreList = document.querySelector("#highscore-list");
    highscoreList.innerHtml = "";
    for (let i = 0; i < sortedLeaderboardArray.lenght; i++) {
        let leaderboardEntry = sortedLeaderboardArray[i];
        let newListItem = document.createElement("li");
        newListItem.textContent =
         leaderboardEntry.initials + " - " + leaderboardEntry.score;
         highscoreList.append(newListItem);
    }
}
function sortLeaderboard() {
    let leaderboardArray = getLeaderboard();
    if (!leaderboardArray) {
        return;
    }

    leaderboardArray.sort(function (a, b) {
        return b.score - a.score;
    });
    return leaderboardArray;
}
const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);
function clearHighscores() {
    localStorage.clear();
    renderLeaderboard();
}
const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);
function returnToStart() {
    hideCards();
    startCard.removeAttribute("hidden");
}
const leaderboardLink = document.querySelector("#leaderboard-link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
    hideCards();
    leaderboardCard.removeAttribute("hidden");
    clearInterval(intervalID);
    time = undefined;
    displayTime();
    renderLeaderboard();
}
