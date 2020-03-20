const Vue = require("./dep-vue")
const el = new Vue({
    el: "#app",
    data: { name: "tutu", list: [1, 2, 3] },
    methods: {
        handlerClick() {
            this.data.name = "测试"
        }
    },
})