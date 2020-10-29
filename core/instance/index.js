
import { initMixin } from './init.js';
import { renderMixin } from './render.js';

function Vue(options) {
    this._init(options);
    this._render();
}

initMixin(Vue);
renderMixin(Vue);
export default Vue;