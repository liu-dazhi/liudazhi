module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://8.130.120.167:8082', // 将请求代理到后端服务器的地址
                changeOrigin: true, // 设置为 true，以便将主机头的来源更改为目标 URL
                pathRewrite: {
                    '^/api': '', // 如果后端接口没有使用统一的前缀路径，可以将此处的 '/api' 替换为实际的前缀路径
                },
            },
        },
    },
};