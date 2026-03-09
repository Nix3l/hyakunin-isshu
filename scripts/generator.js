import { createNode, createNodeWithInner } from "/scripts/utils.js";

export function createShimonokuCard(card, showNumber) {
    let shimonokuContainer = createNode("div", "shimonoku-card");
    shimonokuContainer.appendChild(createNodeWithInner("p", card.shimonoku, "shimonoku"));
    shimonokuContainer.appendChild(createNodeWithInner("p", card.kimariji, "kimariji"));
    if(showNumber) shimonokuContainer.appendChild(createNodeWithInner("p", card.number, "number-indicator"));
    return shimonokuContainer;
}