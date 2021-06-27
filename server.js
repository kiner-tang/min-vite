const Koa = require('koa');
const { resolveManager } = require('./middlewares/manager');
const { port } = require('./config/config');
const app = new Koa();

/**
 * 中间件调用文件处理调度器，统一处理各种文件的请求，并做出响应
 */
app.use(async (ctx, next) => {
    resolveManager(ctx, next);
});

app.listen(port, () => console.log(`服务已启动：http://localhost:${port}`));