import { createApp, defineAsyncComponent } from "vue";
import { createStore } from "vuex";
import { createRouter, createWebHistory } from "vue-router";
import ElementPlus from "element-plus";

import * as Vue from "vue";
import { loadModule } from "vue3-sfc-loader";


const options = {
    moduleCache: {
        vue: Vue
    },
    async getFile(url) {

        const res = await fetch(url);
        if (!res.ok)
            throw Object.assign(new Error(res.statusText + ' ' + url), { res });
        return {
            getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
        }
    },
    addStyle(textContent) {
        const style = Object.assign(document.createElement('style'), { textContent });
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },
}

MyVueExt.load = function(url){
    return defineAsyncComponent( () => loadModule(url, options));
}

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