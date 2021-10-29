const app = Vue.createApp({
    data() {
        return {};
    },
    mounted: function () {
        //var rsp = new URLSearchParams(document.location.search.substring(1));
        //if (rsp.has('route')) {
        //    var route = rsp.get('route');
        //    rsp.delete('route');
        //    var query = rsp.toString();
        //    var fullPath = query ? (route + '?' + query) : route;
        //    this.$router.push(fullPath);
        //}
        if (route) {
            this.$router.push(route.substr(1));
        }
        document.getElementById('app').removeAttribute('class');
    }
});
app.use(ElementPlus);

var router = new VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: []
});
MyVueExt.debug = true;
MyVueExt.configEntry(document.currentScript.src);
MyVueExt.configRouter(router);
MyVueExt.addComponent(app, 'layout', MyVueExt.basePath + '/views/components/layout.html');//可选手动注册异步组件
app.use(router);
//app.use(ArcoVue);
app.mount("#app");