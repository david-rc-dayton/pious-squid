const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        "unholy-octopus": path.join(__dirname, 'dist', 'index.js'),
        "unholy-octopus.min": path.join(__dirname, 'dist', 'index.js'),
    },
    output: {
        path: path.join(__dirname, 'bundle'),
        filename: '[name].js',
        library: 'UnholyOctopus'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            compress: true,
            mangle: true
        })
    ]
}