const fs = require('fs');
const path = require('path');
const compilerSfc = require('@vue/compiler-sfc');
const compilerDom = require('@vue/compiler-dom');
const {
    webRoot,
    projectRoot
} = require('../config/config');
const {
    resolveImport
} = require('../utils/tools');
/**
 * 解析HTML文件
 * @param {*} ctx 
 * @param {*} next 
 */
const resolveHTML = async function resolveHtml(ctx, next) {
    const {
        request: {
            url
        }
    } = ctx;
    ctx.type = "text/html";
    const fileName = url.slice(1);
    let filePath = path.resolve(webRoot, fileName);
    let text = fs.readFileSync(filePath, 'utf-8');
    // 由于在大部分的前端框架如Vue何React种都包含了`process.env.NODE_ENV`进行环境判断，而在我们的浏览器中是不支持的，因此，在这里增加一个垫片
    // 兼容一下
    text = text.replace('<script ', `
            <script>
                window.process = {
                    env: {
                        NODE_ENV: 'development'
                    }
                };
            </script>
            <script
        `);
    ctx.response.body = text;
};

/**
 * 解析js文件
 * @param {*} ctx 
 * @param {*} next 
 */
const resolveJs = async function resolveJs(ctx, next) {
    const {
        request: {
            url
        }
    } = ctx;
    const fileName = url.slice(1);
    ctx.type = "application/javascript";
    let filePath = path.resolve(webRoot, fileName);
    let content = fs.readFileSync(filePath, 'utf-8');
    content = resolveImport(content);
    ctx.response.body = content;
}
/**
 * 解析css文件
 * @param {*} ctx 
 * @param {*} next 
 */
const resolveCss = async function resolveJs(ctx, next) {
    const {
        request: {
            url
        }
    } = ctx;
    const fileName = url.slice(1);
    ctx.type = "application/javascript";
    let filePath = path.join(webRoot, fileName);
    let content = fs.readFileSync(filePath, 'utf-8');

    ctx.response.body = `
            const link = document.createElement('style');
            link.setAttribute('type', 'text/css');
            link.innerHTML="${content.replace(/\n/g, '')}";
            document.head.appendChild(link);
        `;
}
/**
 * 解析node_modules依赖
 * @param {*} ctx 
 * @param {*} next 
 */
const resolveNodeModules = async function resolveJs(ctx, next) {
    const {
        request: {
            url
        }
    } = ctx;
    const modulePath = path.resolve(projectRoot, 'node_modules', url.replace('/@module/', ''));
    const module = require(`${modulePath}/package.json`).module;
    const content = fs.readFileSync(`${modulePath}/${module}`, 'utf-8');
    ctx.type = "application/javascript";
    ctx.response.body = resolveImport(content);
}
/**
 * 解析*.vue单文件组件
 * @param {*} ctx 
 * @param {*} next 
 */
const resolveVue = async function resolveJs(ctx, next) {
    const {
        request: {
            url,
            query
        }
    } = ctx;
    const fileName = url.split('?')[0].slice(1);
    const filePath = path.resolve(webRoot, fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { descriptor } = compilerSfc.parse(content);

    if (!query.type) {
        ctx.type = "application/javascript";
        ctx.body = `
                ${resolveImport(descriptor.script.content.replace('export default ', 'const __script = '))}
                import {render as __render} from "${url}?type=template";
                __script.render = __render;
                export default __script;
            `
    } else {
        const render = compilerDom.compile(descriptor.template.content, { mode: 'module' }).code;
        ctx.type = "application/javascript";
        ctx.body = resolveImport(render.toString());
    }

}


module.exports = {
    resolveHTML,
    resolveJs,
    resolveCss,
    resolveNodeModules,
    resolveVue
};