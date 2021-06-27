# min-vite

> 基于Koa实现的简易版vite,旨在学习vite的基本实现原理，适合一些初学vite的朋友参考查阅

# 运行

```shell
yarn start
```

# 项目结构
```shell
.
├── config           配置文件目录
│   └── config.js    用于存放配置文件
├── middlewares      中间件目录
│   ├── manager.js   管理所有文件识别中间件  
│   └── resolver.js  文件识别中间件
├── package.json
├── readme.md
├── server.js        vite本地启动入口
├── src              demo项目目录
│   ├── App.vue
│   ├── index.css
│   ├── index.html
│   ├── main.html
│   └── main.js
├── utils            共享工具集
│   └── tools.js
└── yarn.lock
```