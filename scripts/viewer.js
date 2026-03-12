import * as utils from "./utils.js";
import { createShimonokuCard } from "./generator.js";

export function startViewer(container, data, showNumber) {
    container.innerHTML = "";

    let inner = utils.createChildNode(container, "div", "viewer-inner");

    data.forEach((curr) => {
        let card = utils.createChildNode(inner, "div", "viewer-card-container");
        card.appendChild(createShimonokuCard(curr, showNumber));

        let kaminokuText = curr.kaminoku.slice(curr.kimariji_number, curr.kaminoku.length);
        let kaminoku = utils.createChildNode(card, "div", "kaminoku");
        kaminoku.innerHTML = `<p><span class="kaminoku-kimariji">${curr.kimariji}</span> ${kaminokuText}</p>`;
    });
}