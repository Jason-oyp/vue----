window.template2Vnode = new Map();
window.vNode2Template = new Map();

function getTemplateName(template) {
    return template.substring(2, template.length - 2).trim();
}

function setTemplate2Vnode(vnode, template) {
    const result = template2Vnode.get(getTemplateName(template));
    if (result) {
        result.push(vnode);
    } else {
        template2Vnode.set(getTemplateName(template), [vnode]);
    }
}

function setVnode2Template(vnode, template) {
    const result = vNode2Template.get(vnode);
    if (result) {
        result.push(getTemplateName(template));
    } else {
        vNode2Template.set(vnode, [getTemplateName(template)]);
    }
}

function analysisTemplate(vnode) {
    const result = vnode.text.match(/{{\s*[a-zA-Z0-9._\[\]]+\s*}}/g);
    for (let i = 0; result && i < result.length; i++) {
        setTemplate2Vnode(vnode, result[i]);
        setVnode2Template(vnode, result[i]);
    }
}

function get(env, template) {
    let temp = env;
    const values = template.split('.');
    for (let i = 0; i < values.length; i++) {
        if (temp[values[i]]) {
            temp = temp[values[i]];
        } else {
            return;
        }
    }
    return temp;
}

function getTemplateValue(envs, template) {
    let result;
    for (let i = 0; i < envs.length; i++) {
        result = get(envs[i], template);
        return result;
    }


}

function renderNode(vm, vnode) {
    if (vnode.nodeType === 3) { //文本节点
        let result = vnode.text;
        const templates = vNode2Template.get(vnode);
        for (let i = 0; templates && i < templates.length; i++) {
            let resultVal = getTemplateValue([vm._data, vnode.env], templates[i]);
            if (resultVal) {
                result = result.toString().replace(eval('/{{\\s*'+templates[i]+'\\s*}}/'), resultVal);
            }
        }
        vnode.el.nodeValue = result;
    } else {
        for (let i = 0; i < vnode.children.length; i++) {
            renderNode(vm, vnode.children[i]);
        }
    }
}

export function renderMixin(Vue) {
    Vue.prototype._render = function () {
        renderNode(this, this._vnode);
    }
}

export default function prepareRender(vm, vnode) {
    if (vnode === null) {
        return;
    } else if (vnode.nodeType === 3) {
        // 文本节点
        analysisTemplate(vnode);
    } else if (vnode.nodeType === 1) {
        // 标签节点
        vnode.children.forEach(item => {
            prepareRender(vm, item);
        });
    }

}