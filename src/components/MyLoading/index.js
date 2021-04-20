import Vue from 'vue';
import LoadingView from './index.vue';
const LoadingConstructor = Vue.extend(LoadingView);

class Loading {
    constructor() {
        this.instance = new LoadingConstructor({
            el: document.createElement('div')
        })
    }
    show(options) {
        let op = options || {};
        if (op.el) {
            op.el.style = 'position:relative';
            op.el.appendChild(this.instance.$el);
            this.instance.changeStyle();
        } else {
            document.body.appendChild(this.instance.$el);
        }
        let params = {
            content: op.content,
            text: op.text,
            mask: op.mask
        }
        this.instance.show(params);
    }
    hide() {
        this.instance.hide();
    }
}
export default {
    install() {
        if (!Vue.$loading) {
            Vue.$loading = new Loading();
        }
        Vue.mixin({
            created() {
                this.$loading = Vue.$loading
            }
        })
    }
};