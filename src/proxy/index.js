const Vue = require("./vue")
const el = new Vue({
    el: "#app",
    data: { name: "aaaaa", list: [1, 2, 3] },
    methods: {
        handlerClick() {
            this.data.name = "bbbbb"
        }
    },
})