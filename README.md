# 使用 Nginx + Vue 搭建 SPA 网站

扩展了 Vue 3 使其支持真正的动态组件；使用 Nginx 的 njs 实现 SPA 的配置。

## Vue 3 扩展

### 优点

1. 动态加载远程组件，包括普通组件和路由组件
2. 远程组件支持单文件组件格式
3. 支持组件中使用 import
4. 支持组件 css 动态加载和卸载
5. style 中可以使用 @import 引入css

### 缺点

1. 不支持 css scoped
2. 不支持 script 中 import css

## Nginx

1. SPA 路由支持：无法找到的文件返回最近一层目录的index.html
2. SAP 目录支持：将index.html的实际路径注入到base标签
3. 添加 application/javascript mjs 配置