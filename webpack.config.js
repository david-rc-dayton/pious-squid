const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        "pious-squid": path.join(__dirname, 'dist', 'index.js'),
        "pious-squid.min": path.join(__dirname, 'dist', 'index.js'),
    },
    output: {
        path: path.join(__dirname, 'bundle'),
        filename: '[name].js',
        library: 'PiousSquid'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            compress: true,
            mangle: true
        })
    ]
}