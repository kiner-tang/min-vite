// 为了让浏览器识别node_module中的包，需要对import语句进行处理
function resolveImport(content) {
    return content.replace(/\sfrom\s*["|']([^'"]*)["|']/g, function(s0, s1){
        if(s1[0] !== '.' && s1[1] !== '/') {
            return ` from "/@module/${s1}"`;
        }
        return s0;
    });
}

module.exports = {
    resolveImport
};