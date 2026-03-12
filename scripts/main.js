import cardData from "./cards.json" with { type: "json" };
import * as utils from "./utils.js";
import * as quiz from "./quiz.js";
import * as viewer from "./viewer.js";

const container = document.querySelector("#content-container");

const lowerInput       = document.querySelector("#cards-lower");
const upperInput       = document.querySelector("#cards-upper");
const showNumber       = document.querySelector("#show-number");
const kimarijiControls = document.querySelectorAll(".allow-kimari");
const kimarijiFilter   = document.querySelector("#kimariji-filter");
const order            = document.querySelector("#order");

let cardRange = getDesiredCards();

function getDesiredCards() {
    return cardData
        .filter(card => card.number >= lowerInput.value && card.number <= upperInput.value)
        .filter(card => kimarijiControls[card.kimariji_number - 1].checked)
        .filter(card => {
            if(kimarijiFilter.value === "none") return true;

            let legal = false;

            kimarijiFilter.value
                .split(";")
                .forEach((filter) => {
                    console.log(filter);
                    if(card.kimariji.startsWith(filter)) legal = true;
                });

            if(legal) return true;
        })
        .sort((a, b) => {
            if(order.value === "normal") return 0;
            if(order.value === "shuffle") return 0;
            if(order.value === "kimariji-order") return a.kimariji > b.kimariji;

            console.error(`cant sort by unknown method ${order.value}`);
            return 0;
        });
}

function getOrderedCardRange() {
    if(order.value === "shuffle") return utils.shuffle(cardRange);
    return cardRange;
}

document.querySelectorAll(".control").forEach((control) => {
    control.addEventListener("input", () => {
        cardRange = getDesiredCards();
        document.querySelector("#card-amount-indicator").textContent = cardRange.length;
    });
});

document.querySelector("#quiz-start-button").addEventListener(
    "click",
    () => {
        container.innerHTML = "";
        quiz.startQuiz(container, getOrderedCardRange(), showNumber.checked);
    }
);

document.querySelector("#viewer-start-button").addEventListener(
    "click",
    () => {
        quiz.cancelQuiz();
        viewer.startViewer(container, getOrderedCardRange(), showNumber.checked);
    }
);