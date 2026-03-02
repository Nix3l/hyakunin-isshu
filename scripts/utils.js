/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffle(array) {
    for (var i = array.length - 1; i > 0; i --) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

export function createNode(tag, classes) {
    const node = document.createElement(tag);
    node.classList.add(classes);
    return node;
}

export function createNodeWithInner(tag, inner, classes) {
    const node = document.createElement(tag);
    node.classList.add(classes);
    node.innerHTML = inner;
    return node;
}