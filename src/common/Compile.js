const Watcher = require("./Watcher")
class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;
        if (this.$el) {
            // 将dom节点转换为Fragment提高执行效率
            this.$fragment = this.documentFragment(this.$el);
            // 执行编译，编译完成以后所有的依赖已经替换成真正的值
            this.compile(this.$fragment);
            // 将生成的结果追加至宿主元素
            this.$el.appendChild(this.$fragment);
        }
    }
    //这个是用来创建文档碎片，其实就是接管真实dom，保存后面用来创建虚了节点
    documentFragment(el) {
        // 创建一个新的Fragment
        const fragment = document.createDocumentFragment();
        let child;
        // 将原生节点移动至fragment
        while ((child = el.firstChild)) {
            // appendChild 是移动操作，移动一个节点，child 就会少一个，最终结束循环
            fragment.appendChild(child);
        }
        return fragment;
    }
    // 编译指定片段 核心方法
    compile(el) {
        let childNodes = el.childNodes;
        const reg = /\{\{(.*)\}\}/
        // 判断dom节点类型，做相应处理 nodeType是dom上面一个方法
        // Array.from 是对象转数组
        Array.from(childNodes).forEach(node => {
            // 元素节点
            if (node.nodeType === 1) {
                this.compileElement(node);
            }
            // 文本节点 
            if (node.nodeType === 3 && reg.test(node.textContent)) {
                this.compileText(node, RegExp.$1); // RegExp.$1匹配{{}}之中的内容
            }
            // 继续轮询遍历
            if (node.childNodes && node.childNodes.length) {
                this.compile(node);
            }
        });
    }
    // 获取没有节点有没有事件或者指令进行编译
    compileElement(node) {
        const attrs = node.attributes;
        // Array.from 是对象转数组
        Array.from(attrs).forEach(attr => {
            const attrName = attr.name; // 获取属性名 v-text
            const exp = attr.value; // 获取属性值 表达式
            // 指令
            if (attrName.indexOf('v-') === 0) {
                const directive = attrName.substr(2)
                //判断有么有当前指令方法 有就执行赋值
                this[directive] && this[directive](node, this.$vm, exp);
            }
            // 事件
            if (attrName.indexOf('@') === 0) {
                const directive = attrName.substr(1)
                //当前节点点击addEventListener
                this.eventHandler(node, this.$vm, exp, directive);
            }
        });
    }
    compileText(node, exp) {
        this.text(node, this.$vm, exp);
    }
    // 文本更新
    text(node, vm, exp) {
        this.update(node, vm, exp, 'text');
    }
    // 处理html
    html(node, vm, exp) {
        this.update(node, vm, exp, 'html');
    }
    // 双向绑定
    model(node, vm, exp) {
        this.update(node, vm, exp, 'model');
        // 双绑还要处理视图对模型的更新
        node.addEventListener('input', e => {
            vm.data[exp] = e.target.value; // 这里相当于执行了 set
        });
    }
    // 能够触发这个 update 方法的时机有两个：1-编译器初始化视图时触发；2-Watcher更新视图时触发
    update(node, vm, exp, dir) {
        let updaterFn = this[dir + 'Updater']; //这个是对应我用attr解析出来的v-model或者v-text
        updaterFn && updaterFn(node, vm.data[exp]); // 立即执行更新；这里的 vm[exp] 相当于执行了 劫持的数据里面get
        new Watcher(vm, exp, function(value) {
            // 每次创建 Watcher 实例，都会传入一个回调函数，使函数和 Watcher 实例之间形成一对一的挂钩关系
            // 将来数据发生变化时， Watcher 就能知道它更新的时候要执行哪个函数
            updaterFn && updaterFn(node, value);
        });
    }
    // v-text 更新
    textUpdater(node, value) {
        node.textContent = value;
    }
    // v-html 更新
    htmlUpdater(node, value) {
        node.innerHTML = value;
    }
    // v-mode 更新
    modelUpdater(node, value) {
        node.value = value;
    }
    // 事件 基础的事件绑定
    eventHandler(node, vm, exp, event) {
        // 获取实例的 methods 方法
        let fn = vm.$options.methods && vm.$options.methods[exp];
        if (event && fn) {
            node.addEventListener(event, fn.bind(vm), false);
        }
    }
}
module.exports = Compile