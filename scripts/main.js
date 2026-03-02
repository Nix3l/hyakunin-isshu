import cardData from "/scripts/cards.json" with { type: "json" };
import * as utils from "/scripts/utils.js";
import * as generator from "/scripts/generator.js";

const quizContainer = document.querySelector("#quiz-container");
const lowerInput = document.querySelector("#cards-lower");
const upperInput = document.querySelector("#cards-upper");
const showNumber = document.querySelector("#show-number");

const kimariji = document.querySelectorAll(".allow-kimari");

function getDesiredCards() {
    return cardData
        .filter(card => card.number >= lowerInput.value && card.number <= upperInput.value)
        .filter(card => kimariji[card.kimariji_number - 1].checked);
}

document.querySelector("#start-button").addEventListener(
    "click",
    () => {
        quizContainer.innerHTML = "";
        generator.createCards(utils.shuffle(getDesiredCards()), showNumber.checked);
        // generator.createCards(getDesiredCards(), showNumber.checked);
    }
);