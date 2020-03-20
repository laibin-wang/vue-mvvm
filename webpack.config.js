const path = require('path')

const webpack = require("webpack")

const html = require("html-webpack-plugin")
module.exports = {
    mode: 'development',
    entry: './src/defineProperty/index.js',
    //entry: './src/proxy/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    },
    plugins: [
        new html({
            template: path.join(__dirname, './index.html'),
            filename: 'index.html'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 6644,
        compress: false,
        progress: true
    },
}