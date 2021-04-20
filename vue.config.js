const vuxLoader = require('vux-loader')
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir);
}
const lessTheme = { name: 'less-theme', path: 'src/assets/css/resetvux.less' }

module.exports = {
    configureWebpack: config => {
        vuxLoader.merge(config, {
            plugins: ['vux-ui', lessTheme, 'progress-bar', 'duplicate-style']
        })
        if (process.env.NODE_ENV !== 'production') return;
        return {
            plugins: [new UglifyJsPlugin({
                uglifyOptions: {
                    warnings: false,
                    compress: {
                        drop_debugger: true,
                        drop_console: true,
                    },
                },
                sourceMap: false,
                parallel: true,
            }), new CompressionPlugin({
                test: '/.js$|.html$|.css$/',
                threshold: 10240, //超过10K进行压缩
                deleteOriginalAssets: false //删除原文件
            })]
        }

    },
    chainWebpack: config => {
        config.resolve.alias
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('utils', resolve('src/utils'))
            // 移除 prefetch 插件
        config.plugins.delete('prefetch')
            // 移除 preload 插件
        config.plugins.delete('preload');
    },
    css: {
        sourceMap: true
    },
    productionSourceMap: false
}