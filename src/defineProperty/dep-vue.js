const Subscription = require("../common/Subscription")
const Compile = require("../common/Compile")
class Vue {
    constructor(options) {
        if (!options.el) return;
        this.$options = options || {}
        this.data = this.$options.data
        this.observer(this.data)
        //执行编译
        new Compile(this.$options.el, this)

    }
    observer(data) {
        if (data && typeof data === "object") {
            // 将数据一一劫持
            Object.keys(data).forEach(key => {
                // 劫持
                this.defineReactive(data, key, data[key])
                this.observer(data[key]) //递归深度劫持
            })
        }
    }
    defineReactive(obj, key, value) {
        let $this = this // 这里不太原因用箭头函数
        const sub = new Subscription()
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            // 取值时调用的方法
            get() {
                // 收集依赖
                Subscription.target && sub.addSub(Subscription.target);
                return value
            },
            set(newValue) { // 当给data属性中设置的时候，更改属性的值
                if (newValue !== value) {
                    // 这里的this不是实例
                    console.log('改变了')
                    $this.observer(newValue) // 如果是对象继续劫持
                    value = newValue
                    sub.notify()
                }
            }
        })
    }
}
module.exports = Vue