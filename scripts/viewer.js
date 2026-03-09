import { createShimonokuCard } from "./generator";

export function createCardView(container, data, showNumber) {
    data.forEach((curr, index) => {
        let card = container.appendChild(createNode("div", "viewer-card-container"));
        let shimonokuContainer = card.appendChild(createShimonokuCard(curr, showNumber));
    });
}