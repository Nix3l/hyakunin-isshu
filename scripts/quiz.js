import * as utils from "./utils.js";
import { createShimonokuCard } from "./generator.js";

let active = false;
let activeContainer = null;

const CardStatus = Object.freeze({
    UNATTEMPTED:         0,
    ATTEMPTED_INCORRECT: 1,
    ATTEMPTED_CORRECT:   2,
    CORRECT:             3,
});

class Card {
    #status = CardStatus.UNATTEMPTED;

    constructor(container, inputField, cardData, index) {
        this.container = container;
        this.inputField = inputField;
        this.data = cardData;
        this.index = index;

        this.inputField.addEventListener("input", () => {
            if(this.inputIsCorrect()) {
                this.markCorrect();
                moveToNextCard();
            } else {
                cardBatch.forEach((card, index) => {
                    if(index === this.index || card === this) return;

                    if(this.inputField.value === card.data.kimariji_romaji || this.inputField.value === card.data.kimariji) {
                        this.markIncorrect();
                        moveToNextCard();
                    }
                });
            }
        });

        this.inputField.addEventListener("keyup", (event) => {
            if(event.key !== 'Enter') return;

            if(this.inputIsCorrect) this.markCorrect();
            else this.markIncorrect();

            moveToNextCard();
        });
    }

    get status() {
        return this.#status;
    }

    set status(newStatus) {
        if(this.#status === newStatus) return;

        let invalid = false;
        if(this.#status === CardStatus.CORRECT || this.#status === CardStatus.ATTEMPTED_CORRECT) invalid = true;
        if(this.#status !== CardStatus.UNATTEMPTED && newStatus === CardStatus.CORRECT) invalid = true;
        if(this.#status !== CardStatus.ATTEMPTED_INCORRECT && newStatus === CardStatus.ATTEMPTED_CORRECT) invalid = true;
        if(invalid) {
            console.error(`attempting to move to invalid state ${newState} from ${this.#status}`);
            return;
        }

        this.#status = newStatus;
        switch(this.#status) {
            case CardStatus.UNATTEMPTED:
                this.container.classList.remove("incorrect");
                this.container.classList.remove("correct");
                this.inputField.removeAttribute("disabled");
            break;
            case CardStatus.ATTEMPTED_INCORRECT:
                this.container.classList.add("incorrect");
                this.container.classList.remove("correct");
                this.inputField.removeAttribute("disabled");
            break;
            case CardStatus.CORRECT:
            case CardStatus.ATTEMPTED_CORRECT:
                this.container.classList.remove("incorrect");
                this.container.classList.add("correct");
                this.inputField.setAttribute("disabled", "");
            break;
        }
    }

    focus() {
        if(this.#status === CardStatus.ATTEMPTED_CORRECT || this.#status === CardStatus.CORRECT) {
            console.error("attempting to focus correctly answered card");
            return;
        }

        this.inputField.focus();
    }

    inputIsCorrect() {
        return (
            this.inputField.value === this.data.kimariji_romaji ||
            this.inputField.value === this.data.kimariji
        );
    }

    markCorrect() {
        if(this.#status === CardStatus.CORRECT || this.#status === CardStatus.ATTEMPTED_CORRECT) {
            console.error("attempting to mark already correct card as correct");
            return;
        }

        if(this.#status === CardStatus.UNATTEMPTED) this.status = CardStatus.CORRECT;
        else if(this.#status === CardStatus.ATTEMPTED_INCORRECT) this.status = CardStatus.ATTEMPTED_CORRECT;

        this.inputField.value = this.data.kimariji;

        if(numCardsWithStatus([CardStatus.CORRECT, CardStatus.ATTEMPTED_CORRECT]) === cardBatch.length)
            finishQuiz();
    }

    markIncorrect() {
        if(this.#status === CardStatus.CORRECT || this.#status === CardStatus.ATTEMPTED_CORRECT) {
            console.error("attempting to mark already correct card as incorrect");
            return;
        }

        this.status = CardStatus.ATTEMPTED_INCORRECT;
        this.inputField.value = "";
    }
}

let cardBatch = [];

function moveToNextCard() {
    for(let i = 0; i < cardBatch.length - 1; i ++) {
        if(cardBatch[i].inputField === document.activeElement) {
            cardBatch[i + 1].focus();
            return;
        }
    }

    for(let i = 0; i < cardBatch.length - 1; i ++) {
        if(!(cardBatch[i].status === CardStatus.CORRECT || cardBatch[i].status === CardStatus.ATTEMPTED_CORRECT)) {
            cardBatch[i].focus();
            return;
        }
    }
}

function numCardsWithStatus(arr) {
    let num = 0;

    cardBatch.forEach((card) => {
        arr.forEach((status) => {
            if(card.status === status) num ++;
        })
    });

    return num;
}

function numAttemptedCards() {
    return numCardsWithStatus([
        CardStatus.ATTEMPTED_INCORRECT,
        CardStatus.ATTEMPTED_CORRECT,
        CardStatus.CORRECT,
    ]);
}

function cardsWithStatus(arr) {
    return cardBatch.filter((card) => {
        let allow = false;

        arr.forEach(status => {
            if(card.status === status) allow = true;
        });

        return allow;
    });
}

function createQuizCards(container, data, showNumber) {
    cardBatch  = [];

    data.forEach((curr, index) => {
        let cardContainer = utils.createChildNode(container, "div", "quiz-card-container");

        cardContainer.appendChild(createShimonokuCard(curr, showNumber));

        let inputContainer = utils.createChildNode(cardContainer, "div", "kimariji-input");
        let input = utils.createChildNode(inputContainer, "input", "");
        input.setAttribute("type",           "text");
        input.setAttribute("autocomplete",   "off");
        input.setAttribute("autocorrect",    "off");
        input.setAttribute("autocapitalize", "none");
        input.setAttribute("spellcheck",     "false");
        input.setAttribute("placeholder",    "");

        cardBatch.push(new Card(cardContainer, input, curr, index));
    });

    cardBatch[0].focus();
}

export function startQuiz(container, data, showNumber) {
    if(data.length == 0) {
        window.alert("この範疇に入る札はありません。設定を変えてもう一度お試しください。");
        return;
    }

    activeContainer = container;
    active = true;

    let cardsContainer = utils.createChildNode(container, "div", "quiz-inner");
    createQuizCards(cardsContainer, data, showNumber);

    let footer = utils.createChildNode(container, "div", "quiz-footer");
    let finishButton = utils.createChildNodeWithInner(footer, "button", "<p>結果を見る</p>", "quiz-finish");
    finishButton.addEventListener("click", () => {
        if(numAttemptedCards() < cardBatch.length) {
            if(!window.confirm("まだ未回答の札がいくつかありますが、結果を見ますか？"))
                return;
        }

        finishQuiz();
    });
}

export function cancelQuiz() {
    active = false;
    activeContainer = null;
    cardBatch = [];
}

export function finishQuiz() {
    if(!active) return;

    let correct = cardsWithStatus([CardStatus.CORRECT]);

    let result = Math.round(correct.length / cardBatch.length * 100);

    // wow is this some horrible code lol
    let totalKimariCorrect = [0,0,0,0,0,0];
    let totalKimari        = [0,0,0,0,0,0]; // i can hardcode this

    cardBatch.forEach((card) => {
        totalKimari[card.data.kimariji_number - 1] ++;
    });

    correct.forEach((card) => {
        totalKimariCorrect[card.data.kimariji_number - 1] ++;
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

    cancelQuiz();
}