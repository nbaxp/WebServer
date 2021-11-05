var MyVueExt = (function () {
    var exports = {
        debug: false,
        componentsPath: '/components',
        viewsPath:'/views',
        componentExt: '.html',
        styleCounter: 'component-style-counter',
        routerHome: '/home'
    };
    exports.basePath = trimEnd(document.location.protocol + '//' + document.location.host + document.querySelector('base')?.getAttribute('href') ?? document.location.href);
    function log(msg) {
        if (exports.debug) {
            console.log(msg);
        }
    }
    function trimEnd(input, char) {
        return input.endsWith(char) ? input.substr(0, input.length - 1) : input;
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
                var counter = parseInt(style.getAttribute(exports.styleCounter));
                style.setAttribute(exports.styleCounter, counter + 1);
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
                var counter = parseInt(style.getAttribute(exports.styleCounter));
                if (counter - 1 > 0) {
                    style.setAttribute(exports.styleCounter, counter - 1);
                }
                else {
                    document.head.removeChild(style);
                }
            }
        }
    }
    function templateToModel(html, name, url) {
        log({ url });
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
                    styleTag.setAttribute(exports.styleCounter, 1);
                    model.style += styleTag.outerHTML + '\n';
                }
            }
        }
        model.template = template;
        return model;
    }
    function addComponent(instance, name, url) {
        instance.component(name, exports.defineAsyncComponent(() => new Promise((resolve, reject) => {
            fetch(url).then(function (response) {
                return response.text();
            }).then(function (text) {
                if (text) {
                    var component = templateToModel(text, name, url);
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
            var url = exports.basePath + exports.componentsPath + '/' + name.replaceAll('-', "/") + exports.componentExt;
            addComponent(instance, name, url);
            result = fun();
        }
        return result;
    }
    function configRouter(store, router) {
        if (router.options.history.base) {
            exports.basePath = basePath = document.location.protocol + '//' + document.location.host + router.options.history.base
        }
        router.beforeEach((to, from, next) => {
            var path = to.path === '/' ? exports.routerHome : to.path;
            var name = path.substring(1).replaceAll('/', "-");
            var url = exports.basePath + exports.componentsPath + exports.viewsPath + path + exports.componentExt;
            if (!router.hasRoute(name)) {
                fetch(url).then(function (response) {
                    return response.text();
                }).then(function (text) {
                    if (text) {
                        var model = templateToModel(text, name, url);
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
                append(document.head, route.components.default.style)
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

    exports.addComponent = addComponent;
    exports.patchComponent = patchComponent;
    exports.configRouter = configRouter;
    return exports;
}());