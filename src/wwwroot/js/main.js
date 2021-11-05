import { createApp, defineAsyncComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createStore } from "vuex";
import ElementPlus from "element-plus";

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
MyVueExt.defineAsyncComponent = defineAsyncComponent;
MyVueExt.configRouter(store, router);

app.use(ElementPlus);
app.mount("#app");