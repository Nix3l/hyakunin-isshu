import cardData from "/scripts/cards.json" with { type: "json" };
import * as utils from "/scripts/utils.js";
import * as quiz from "/scripts/quiz.js";

const quizContainer = document.querySelector("#quiz-container");

const lowerInput = document.querySelector("#cards-lower");
const upperInput = document.querySelector("#cards-upper");
const showNumber = document.querySelector("#show-number");
const kimarijiControls = document.querySelectorAll(".allow-kimari");

function getDesiredCards() {
    return cardData
        .filter(card => card.number >= lowerInput.value && card.number <= upperInput.value)
        .filter(card => kimarijiControls[card.kimariji_number - 1].checked);
}

document.querySelectorAll(".control").forEach((control) => {
    control.addEventListener("input", () => {
        document.querySelector("#card-amount-indicator").textContent = getDesiredCards().length;
    });
});

document.querySelector("#quiz-start-button").addEventListener(
    "click",
    () => {
        quizContainer.innerHTML = "";
        // quiz.startQuiz(quizContainer, utils.shuffle(getDesiredCards()), showNumber.checked);
        quiz.startQuiz(quizContainer, getDesiredCards(), showNumber.checked);
    }
);