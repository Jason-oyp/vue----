import VNode from '../Vdom/Vnode.js';

export function mount(vm, el) {
    vm._vnode = constructVNode(vm, el, null);
}

function getNodeText(el) {
    return el.nodeType === 3 ? el.nodeValue : '';
}

function constructVNode(vm, el, parent) {
    let children = [];
    let data = null;
    const vnode = new VNode(el.nodeName, el, children, parent, el.nodeType, getNodeText(el), data);

    el.childNodes.forEach(item => {
        const resultNode = constructVNode(vm, item, vnode);
        if (resultNode instanceof VNode) {
            vnode.children.push(resultNode);
        } else {
            // 返回的是vnode数组，  v-for的情况
            vnode.children.push(...resultNode);
        }
    });
    return vnode;
}