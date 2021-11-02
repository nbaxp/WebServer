//https://nginx.org/en/docs/njs/reference.html#njs_api_fs
var fs = require('fs');

var root = '/usr/share/nginx/html';
var indexFile = 'index.html';
var sep = '/';

function process(r) {
    var uri = r.uri;
    var file = root + uri;
    var data = null;
    var err = null;
    try {
        data = fs.readFileSync(file);
    }
    catch (e) {
        err = e.toString();
        var path = uri.endsWith(sep) ? uri.substr(0, uri.length - 1) : uri;
        while (true) {
            file = root + path + sep + indexFile;
            try {
                data = fs.readFileSync(file);
                r.headersOut['Content-Type'] = "text/html; charset=utf-8";
                break;
            } catch (e) {
                data = e.toString();
            }
            if (path === '') {
                break;
            }
            path = path.substr(0, path.lastIndexOf(sep));
        }
    }
    if (data) {
        data = data.toString().replace("<head>", '<head>\n<base href="' + path + sep + '" />');
        r.headersOut['x-custom-path'] = path + sep;
        r.return(200, data);
    }
    else {
        r.return(200, err);
    }
}

export default { process };