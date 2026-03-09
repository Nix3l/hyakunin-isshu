// randomize array in-place using durstenfeld shuffle algorithm
// taken from some stackoverflow thing somewhere
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i --) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

export function createNode(tag, classes) {
    const node = document.createElement(tag);

    if(classes.length > 0) {
        classes
            .trim()
            .split(" ")
            .forEach(c => { node.classList.add(c); });
    }

    return node;
}

export function createNodeWithInner(tag, inner, classes) {
    const node = createNode(tag, classes);
    node.innerHTML = inner;
    return node;
}

export function createChildNode(parent, tag, classes) {
    return parent.appendChild(createNode(tag, classes));
}

export function createChildNodeWithInner(parent, tag, inner, classes) {
    return parent.appendChild(createNodeWithInner(tag, inner, classes));
}