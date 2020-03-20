const Compile = require("../common/Compile.js")
const Subscription = require("../common/Subscription")
class Vue {
    constructor(options) {
        if (!options.el) return;
        this.$options = options || {}
        this.observer(this.$options.data)
        //执行编译
        new Compile(this.$options.el, this)

    }

    observer(data) {
        const sub = new Subscription()
        this.data = new Proxy(data, {
            get(obj, key) {
                if (Subscription.target) {
                    sub.addSub(Subscription.target)
                }
                return obj[key]
            },
            set(obj, key, value) {
                const result = Reflect.set(obj, key, value);
                if (result) {
                    sub.notify()
                }
                return result;
            }
        })
    }
}

module.exports = Vue