var MyVueExt = (function () {
    Vue.Ext = true;
    var exports = {};
    var debug = false;
    var basePath = document.location.pathname.substr(0, document.location.pathname.lastIndexOf('/'));
    var componentsPath = '/components/';
    var fileExt = '.html';
    var styleCounter = 'vc-style-counter';
    var routerHome = '/home';
    function log(msg) {
        if (MyVueExt.debug) {
            console.log(msg);
        }
    }
    function configEntry(endpoint) {
        MyVueExt.basePath = endpoint.substr(0, endpoint.lastIndexOf('/'));
    }
    function append(parent, html) {
        var frag = document.createDocumentFragment();
        var div = document.createElement('div');
        div.innerHTML = html;
        var list = div.querySelectorAll('*');
        for (var i = 0; i < list.length; i++) {
            parent.appendChild(list[i]);
        }
    }
    function addStyles(name, style) {
        var styleList = document.querySelectorAll('head style.' + name);
        if (styleList.length > 0) {
            for (var i = 0; i < styleList.length; i++) {
                var style = styleList[i];
                var counter = parseInt(style.getAttribute(MyVueExt.styleCounter));
                style.setAttribute(MyVueExt.styleCounter, counter + 1);
            }
        }
        else {
            if (style) {
                append(document.head, style)
            }
        }
    }
    function removeStyles(name) {
        var styleList = document.querySelectorAll('head style.' + name);
        if (styleList.length > 0) {
            for (var i = 0; i < styleList.length; i++) {
                var style = styleList[i];
                var counter = parseInt(style.getAttribute(MyVueExt.styleCounter));
                if (counter - 1 > 0) {
                    style.setAttribute(MyVueExt.styleCounter, counter - 1);
                }
                else {
                    document.head.removeChild(style);
                }
            }
        }
    }
    function templateToModel(html, name, url) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var templateTag = doc.querySelector('template');
        var template = templateTag ? templateTag.innerHTML : '<template></template>';
        var scriptTag = doc.querySelector('script');
        var script = scriptTag ? scriptTag.innerHTML : '{}';
        var modelScript = '(' + (script.replace(/^\s*export\s*default\s*/, '').replace(/;?\s*$/, '') || '{}') + ')\n//@ sourceURL=' + url;
        var model = eval(modelScript);
        var styleTagList = doc.querySelectorAll('style');
        if (styleTagList.length > 0) {
            model.style = '\n';
            for (var i = 0; i < styleTagList.length; i++) {
                var styleTag = styleTagList[i];
                if (styleTag) {
                    styleTag.setAttribute('class', name);
                    styleTag.setAttribute(MyVueExt.styleCounter, 1);
                    model.style += styleTag.outerHTML + '\n';
                }
            }
        }
        model.template = template;
        return model;
    }
    function addComponent(instance, name, url) {
        log('add vue component:' + name + ' from ' + url);
        instance.component(name, Vue.defineAsyncComponent(() => new Promise((resolve, reject) => {
            fetch(url).then(function (response) {
                return response.text();
            }).then(function (text) {
                if (text) {
                    var component = MyVueExt.templateToModel(text, name, url);
                    component.created = function () {
                        addStyles(name, component.style);
                    };
                    component.unmounted = function () {
                        removeStyles(name);
                    };
                    resolve(component);
                }
            });
        })));
    }
    function patchComponent(instance, name, fun) {
        var result = fun();
        if (!result || typeof (result) === 'string') {
            var url = MyVueExt.basePath + componentsPath + name.replaceAll('-', "/") + fileExt;
            addComponent(instance, name, url);
            result = fun();
        }
        return result;
    }
    function configRouter(store,router) {
        router.beforeEach((to, from, next) => {
            var path = to.path === '/' ? routerHome : to.path;
            var name = path.substring(1).replaceAll('/', "-");
            var url = MyVueExt.basePath + '/components/views' + path + MyVueExt.fileExt;
            var root = '';
            if (store.apps && store.apps.length > 0) {
                for (var i = 0; i < store.apps[i]; i++) {
                    var app = store[i];
                    if (app.path !== '/' && to.path.startsWith(app.path)) {
                        root = app.path;
                    }
                }
            }
            console.warn('debug:'+MyVueExt.basePath+ '/apps' + root + '/components/views' + path + MyVueExt.fileExt);
            if (!router.hasRoute(name)) {
                fetch(url).then(function (response) {
                    return response.text();
                }).then(function (text) {
                    if (text) {
                        var model = MyVueExt.templateToModel(text, name, url);
                        var route = {
                            name: name,
                            path: to.path,
                            component: model,
                            meta: model.meta
                        };
                        router.addRoute(route);
                        router.push({ path: to.path, query: to.query });
                    }
                });
            }
            else {
                next();
            }
        });
        router.beforeResolve(async function (to) {
            var route = router.getRoutes().find(function (item, index) { return item.name === to.name });
            if (route.components.default.style && !document.querySelector('head style.' + to.name)) {
                MyVueExt.append(document.head, route.components.default.style)
            }
        });
        router.afterEach(function (to, from) {
            if (from.name) {
                if (to.path !== from.path) {
                    removeStyles(from.name);
                }
            }
        });
    }
    exports.debug = debug;
    exports.basePath = basePath;
    exports.componentsPath = componentsPath;
    exports.fileExt = fileExt;
    exports.styleCounter = styleCounter;
    exports.log = log;
    exports.configEntry = configEntry;
    exports.append = append;
    exports.templateToModel = templateToModel;
    exports.addComponent = addComponent;
    exports.patchComponent = patchComponent;
    exports.configRouter = configRouter;
    exports.routerHome = routerHome;
    return exports;
}());