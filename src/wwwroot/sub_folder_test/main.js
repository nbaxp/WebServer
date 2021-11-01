//vue
const app = Vue.createApp({
    data() {
        return {
        };
    },
    mounted: function () {
        document.getElementById('app').removeAttribute('class');//加载完成
        if (window.route) {//history模式下，为了修复资源加载将路由暂存在了windows.route变量中
            this.$router.push(window.route);
        }
    }
});

//vuex
const store = Vuex.createStore({
    state() {
        return {
            root: '/',
            apps: [
                {
                    name: 'default',
                    text: 'Web基础',
                    path: '/',
                },
                //{
                //    name: 'library',
                //    text: 'JavaScript库',
                //    path: '/library',
                //    order: 1
                //},
            ]
        }
    },
    mutations: {
        set(state, obj) {
            state[obj.key] = obj.value;
        }
    }
});
app.use(store);

//vue router
const router = new VueRouter.createRouter({
    history: VueRouter.createWebHistory(window.appPath),
    routes: []
});
app.use(router);

//minxin
app.mixin({
    methods: {
        get(key) {
            return this.$store.state[key];
        },
        set(key, value) {
            this.$store.commit('set', { key: key, value: value });
        }
    }
});

MyVueExt.debug = true;
MyVueExt.configEntry(document.currentScript.src);
MyVueExt.configRouter(store,router);
//MyVueExt.addComponent(app, 'layout', MyVueExt.basePath + '/components/views/layout.html');//可选手动注册异步组件

app.use(ElementPlus);
app.mount("#app");