const {
    resolveHTML,
    resolveCss,
    resolveJs,
    resolveVue,
    resolveNodeModules
} = require('./resolver');
/**
 * 在此处负责文件处理器的统一调度
 * @param {*} ctx 
 * @param {*} next 
 */
const resolveManager = function resolveManager(ctx, next) {
    const {
        request: {
            url
        }
    } = ctx;
    const pageName = url.split('?')[0];
    if(pageName === "/"){
        ctx.response.redirect(`index.html`);
    } else if(pageName.endsWith('.html')) {
        resolveHTML(ctx, next);
    } else if(pageName.endsWith('.js')) {
        resolveJs(ctx, next);
    } else if(pageName.endsWith('.css')) {
        resolveCss(ctx, next);
    } else if(pageName.startsWith('/@module/')) {
        resolveNodeModules(ctx, next);
    } else if(pageName.indexOf(".vue")>=0) {
        resolveVue(ctx, next);
    }
};

module.exports = {
    resolveManager
};