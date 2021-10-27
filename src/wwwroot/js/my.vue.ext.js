var MyVueExt = (function () {
    Vue.Ext = true;
    var exports = {};
    var debug = false;
    var basePath = document.location.pathname.substr(0, document.location.pathname.lastIndexOf('/'));
    var componentsPath = '/views/components/';
    var fileExt = '.html';
    var styleCounter = 'vc-style-counter';
    var routerHome = '/views/home';
    function log(msg) {
        if (debug) {
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
        frag.appendChild(div.firstChild);
        parent.appendChild(frag);
    }
    function templateToModel(html, name, url) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var templateTag = doc.querySelector('template');
        var template = templateTag ? templateTag.innerHTML : '<template></template>';
        var scriptTag = doc.querySelector('script');
        var script = scriptTag ? scriptTag.innerHTML : '{}';
        var modelScript = '(' + (script.replace(/^\s*export\s*default\s*/, '').replace(/;?\s*$/, '') || '{}') + ')\n//# sourceURL=' + url;
        var model = eval(modelScript);
        var styleTag = doc.querySelector('style');
        if (styleTag) {
            styleTag.setAttribute('class', name);
            styleTag.setAttribute(MyVueExt.styleCounter, 1);
            model.style = styleTag.outerHTML;
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
                        var style = document.querySelector('head style.' + name);
                        if (style) {
                            var counter = parseInt(style.getAttribute(MyVueExt.styleCounter));
                            style.setAttribute(MyVueExt.styleCounter, counter + 1);
                        }
                        else {
                            if (component.style) {
                                MyVueExt.append(document.querySelector('head'), component.style)
                            }
                        }
                    };
                    component.unmounted = function () {
                        var style = document.querySelector('head style.' + name);
                        if (style) {
                            var counter = parseInt(style.getAttribute(MyVueExt.styleCounter));
                            if (counter - 1 > 0) {
                                style.setAttribute(MyVueExt.styleCounter, counter - 1);
                            }
                            else {
                                document.head.removeChild(style);
                            }
                        }
                    };
                    resolve(component);
                }
            });
        })));
    }
    function patchComponent(instance, name, fun) {
        var result = fun();
        if (!result || typeof (result) === 'string') {
            var url = basePath + componentsPath + name.replaceAll('-', "/") + fileExt;
            addComponent(instance, name, url);
            result = fun();
        }
        return result;
    }
    function configRouter(router) {
        router.beforeEach((to, from, next) => {
            var url = to.path === '/' ? routerHome : to.path;
            var name = url.substring(1).replaceAll('/', "-");
            url = MyVueExt.basePath + url + MyVueExt.fileExt;
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
                MyVueExt.append(document.querySelector('head'), route.components.default.style)
            }
        });
        router.afterEach(function (to, from) {
            if (from.name) {
                if (to.path !== from.path) {
                    var style = document.querySelector('head style.' + from.name);
                    if (style) {
                        document.head.removeChild(style);
                    }
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