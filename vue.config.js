/*
 * @Author: liushulun liushulun@doorock.com
 * @Date: 2023-11-18 21:57:33
 * @LastEditors: liushulun liushulun@doorock.com
 * @LastEditTime: 2023-11-18 21:58:37
 * @FilePath: \liudazhi\vue.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:9998', // 将请求代理到后端服务器的地址
                changeOrigin: true, // 设置为 true，以便将主机头的来源更改为目标 URL
                pathRewrite: {
                    '^/api': '', // 如果后端接口没有使用统一的前缀路径，可以将此处的 '/api' 替换为实际的前缀路径
                },
            },
        },
    },
};