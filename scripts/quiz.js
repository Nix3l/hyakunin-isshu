import * as utils from "./utils.js";
import { createShimonokuCard } from "./generator.js";

let active = false;
let activeContainer = null;

// id probably do this whole thing differently if i were to refactor this.
// maybe make these into an array of objects rather than a bunch of separate arrays
let cardData   = [];
let cardBatch  = [];
let inputBatch = [];
let correct    = [];
let incorrect  = [];

function moveToNextCard() {
    for(let i = 0; i < cardBatch.length - 1; i ++) {
        if(inputBatch[i] === document.activeElement) {
            inputBatch[i + 1].focus();
            break;
        }
    }
}

function markCardCorrect(i) {
    cardBatch[i].classList.add("correct");
    inputBatch[i].setAttribute("disabled", "");
    inputBatch[i].value = cardData[i].kimariji;

    if(incorrect.includes(i)) incorrect = incorrect.filter(curr => curr !== i);
    correct.push(i);

    if(correct.length == cardBatch.length) finishQuiz();
}

function markCardIncorrect(i) {
    cardBatch[i].classList.add("incorrect");
    inputBatch[i].value = "";
    inputBatch[i].addEventListener("focus", () => {
        cardBatch[i].classList.remove("incorrect");
        inputBatch[i].removeEventListener("focus");
    });

    incorrect.push(i);
}

function attachCardEvents(input, card, index) {
    input.addEventListener("input", () => {
        if(input.value === card.kimariji_romaji || input.value === card.kimariji) {
            markCardCorrect(index);
            moveToNextCard();
        }
    });

    input.addEventListener("keyup", (event) => {
        if(event.key !== 'Enter') return;

        if(input.value === card.kimariji_romaji || input.value === card.kimariji) {
            markCardCorrect(index);
        } else {
            markCardIncorrect(index);
        }

        moveToNextCard();
    });
}

function createQuizCards(container, data, showNumber) {
    cardBatch  = [];
    inputBatch = [];

    data.forEach((curr, index) => {
        let card = utils.createChildNode(container, "div", "quiz-card-container");

        card.appendChild(createShimonokuCard(curr, showNumber));

        let inputContainer = utils.createChildNode(card, "div", "kimariji-input");
        let input = utils.createChildNode(inputContainer, "input", "");
        input.setAttribute("type",           "text");
        input.setAttribute("autocomplete",   "off");
        input.setAttribute("autocorrect",    "off");
        input.setAttribute("autocapitalize", "none");
        input.setAttribute("spellcheck",     "false");
        input.setAttribute("placeholder",    "");

        cardBatch.push(card);
        inputBatch.push(input);

        attachCardEvents(input, curr, index);
    });

    inputBatch[0].focus();
}

export function startQuiz(container, data, showNumber) {
    if(data.length == 0) {
        window.alert("この範疇に入る札はありません。設定を変えてもう一度お試しください。");
        return;
    }

    cardData = data;
    correct = [];
    incorrect = [];
    activeContainer = container;
    active = true;

    let cardsContainer = utils.createChildNode(container, "div", "quiz-inner");
    createQuizCards(cardsContainer, data, showNumber);

    let footer = utils.createChildNode(container, "div", "quiz-footer");
    let finishButton = utils.createChildNodeWithInner(footer, "button", "<p>結果を見る</p>", "quiz-finish");
    finishButton.addEventListener("click", () => {
        if(correct.length + incorrect.length < cardData.length) {
            if(!window.confirm("まだ未回答の札がいくつかありますが、結果を見ますか？"))
                return;
        }

        finishQuiz();
    });
}

export function cancelQuiz() {
    active = false;
    activeContainer = null;
    cardData = [];
}

export function finishQuiz() {
    if(!active) return;

    let result = Math.round(correct.length / cardData.length * 100);

    // wow is this some horrible code lol
    let totalKimariCorrect = [0,0,0,0,0,0];
    let totalKimari        = [0,0,0,0,0,0]; // i can hardcode this

    cardData.forEach((card) => {
        totalKimari[card.kimariji_number - 1] ++;
    });

    correct.forEach((_, index) => {
        totalKimariCorrect[cardData[index].kimariji_number - 1] ++;
    });

    activeContainer.innerHTML = "";

    // what even is php anyway
    let out = "";
    out += "<div class=\"quiz-results\">";
    out +=    "<div class=\"results-header\">";
    out +=        `<p>採点:</p><p>${result}%</p>`;
    totalKimari.forEach((n, index)=> {
        if(n > 0) out += `<p>${index + 1}字決まり:</p><p>${totalKimariCorrect[index]}/${n}</p>`;
    });
    out +=    "</div>";
    out += "</div>";

    activeContainer.innerHTML = out;

    active = false;
    activeContainer = null;
    cardData = [];
}