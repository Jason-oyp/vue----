export default class VNode {
    constructor(tag, el, children, parent, nodeType, text, data) {
        this.tag = tag;  // 标签类型
        this.el = el;  // 对应的真实dom元素
        this.children = children;  // 子节点
        this.parent = parent; // 父节点
        this.nodeType = nodeType; // 节点类型
        this.text = text; // 文本内容
        this.data = data; // 预留字段
        this.env = {}; // 环境变量
        this.template = []; // 当前节点涉及到的模板
        this.instructions = null; // 存放指令
    }
}