import { createNode, createNodeWithInner } from "/scripts/utils.js";

export let cardBatch = [];
export let inputBatch = [];

function moveToNextCard() {
    for(let i = 0; i < cardBatch.length - 1; i ++) {
        if(inputBatch[i] === document.activeElement) {
            inputBatch[i + 1].focus();
            break;
        }
    }
}

function markCardCorrect(id) {
    cardBatch[id].classList.add("correct");
    inputBatch[id].setAttribute("disabled", "");
}

function markCardIncorrect(id) {
    cardBatch[id].classList.add("incorrect");
    inputBatch[id].setAttribute("disabled", "");
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

export function createCards(data, showNumber) {
    cardBatch = [];
    inputBatch = [];

    const container = document.querySelector("#quiz-container");
    data.forEach((curr, index) => {
        let card = createNode("div", "card-container");

        let shimonokuContainer = createNode("div", "shimonoku-card");
        shimonokuContainer.appendChild(createNodeWithInner("p", curr.shimonoku, "shimonoku"));
        shimonokuContainer.appendChild(createNodeWithInner("p", curr.kimariji, "kimariji"));
        if(showNumber) shimonokuContainer.appendChild(createNodeWithInner("p", curr.number, "number-indicator"));

        let inputContainer = createNode("div", "kimariji-input");
        let input = document.createElement("input");
        input.setAttribute("type",           "text");
        input.setAttribute("autocomplete",   "off");
        input.setAttribute("autocorrect",    "off");
        input.setAttribute("autocapitalize", "none");
        input.setAttribute("spellcheck",     "false");
        input.setAttribute("placeholder",    "");

        input = inputContainer.appendChild(input);
        shimonokuContainer = card.appendChild(shimonokuContainer);
        inputContainer = card.appendChild(inputContainer);
        card = container.appendChild(card);

        cardBatch.push(card);
        inputBatch.push(input);

        attachCardEvents(input, curr, index);
    });

    inputBatch[0].focus();
}