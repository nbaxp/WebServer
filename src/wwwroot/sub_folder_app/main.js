//vue
const app = Vue.createApp({
    data() {
        return {
        };
    },
    mounted: function () {
        document.getElementById('app').removeAttribute('class');//加载完成
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
    history: VueRouter.createWebHistory(document.querySelector('base').getAttribute('href')),
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
MyVueExt.configRouter(store,router);
//MyVueExt.addComponent(app, 'layout', MyVueExt.basePath + '/components/views/layout.html');//可选手动注册异步组件

app.use(ElementPlus);
app.mount("#app");