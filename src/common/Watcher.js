const Subscription = require("./Subscription")
class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm; //实例对象
        this.expr = expr; //表达式
        this.cb = cb; // 回到函数
        this.get() //主要初始化依赖
    }
    get() {
        // 将来 new 一个监听器时，将当前 Watcher 实例附加到 Dep.target
        // 将来通过 Dep.target 就能拿到当时创建的 Watcher 实例
        Subscription.target = this;
        // 读取操作，主动触发 get，当前 Watcher 实例被添加到依赖管理器中 （ps这个做法有很多）
        this.vm.data[this.expr];
        // 清空操作，避免不必要的重复添加
        // 为Subscription类设置一个静态属性,默认为null,工作时指向当前的Watcher
        Subscription.target = null;
    }
    // 对外暴露的方法
    update() {
        //console.log('from Watcher update: 视图更新啦！！！');
        // 通知页面做更新
        //this.cb.call(this.vm, this.vm[this.expr]);
        this.cb(this.vm.data[this.expr])
    }
}
module.exports = Watcher