# 单文件绿色版静态文件Web服务器

将ASP.NET的Web服务器以单文件方式发布出来,同时集成了SPA单页应用的路由组件。可以用于前端开发时替代安装node.js或nginx作为开发服务器。

## 功能

1. 提供HTTP/HTTPS协议支持
1. 提供静态文件支持
1. 提供CORS支持
1. 提供SPA单页路由支持

## 配置

配置文件为appsetting.json

1. server.urls配置启动URL
1. wwwroot配置网站根目录名称
1. spa配置是否使用单页路由
1. urls配置启动URL，默认会动态查找空闲的端口启动程序