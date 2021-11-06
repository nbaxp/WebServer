import { createApp, defineAsyncComponent, resolveComponent } from "vue";
import { createStore } from "vuex";
import { createRouter, createWebHistory } from "vue-router";
//import ElementPlus from "element-plus";
import * as Vue from "vue";

//vue
const app = createApp({
    data() {
        return {};
    },
    mounted: function () {
        document.getElementById("app").removeAttribute("class");
    },
});
//vuex
const store = createStore({
    state() {
        return {
            root: "/",
            apps: [
                {
                    name: "default",
                    text: "Web基础",
                    path: "/",
                },
            ],
        };
    },
    mutations: {
        set(state, obj) {
            state[obj.key] = obj.value;
        },
    },
});
app.use(store);
//vue-router
const router = new createRouter({
    history: createWebHistory(
        document.querySelector("base")?.getAttribute("href")
    ),
    routes: [],
});
app.use(router);
//minxin
app.mixin({
    methods: {
        get(key) {
            return this.$store.state[key];
        },
        set(key, value) {
            this.$store.commit("set", { key: key, value: value });
        },
    },
});

MyVueExt.debug = true;
MyVueExt.config(app,defineAsyncComponent);
MyVueExt.configRouter(store, router);
//MyVueExt.addComponent(app,'layout','https://localhost/components/layout.html');
//MyVueExt.addComponent(app,'menu','https://localhost/components/menu.html');

//app.use(ElementPlus);
app.mount("#app");