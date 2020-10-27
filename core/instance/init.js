
let uid = 0;

export function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        let vm = this;
        vm._uid = uid++;
        vm.isVue = true;

        // 初始化data
        // 初始化created
        // 初始化methods
        // 初始化computed
        // 初始化el并挂载
    };
}