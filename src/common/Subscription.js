/**
 * @description 做发布订阅
 */
class Subscription {
    constructor() {
        this.subs = []
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }

}
module.exports = Subscription