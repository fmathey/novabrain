var Path             = require('path');
var Webpack          = require('webpack');
var node_modules_dir = Path.resolve(__dirname, 'node_modules');
var isEnvProd        = process.env.NODE_ENV === 'production';

var config = {
    target: 'web',
    entry: {
        novabrain: Path.join(__dirname, 'source/novabrain.js'),
    },
    output: {
        path: Path.join(__dirname, 'dist'),
        filename: (isEnvProd ? "[name].min.js" :  "[name].js"),
        library: 'Novabrain',
        libraryTarget: 'var'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: node_modules_dir,
                loaders: [
                    'babel-loader'
                ]
            }
        ]
    },
    plugins: []
};

if (isEnvProd) {
    config.plugins.push(new Webpack.optimize.UglifyJsPlugin({ minimize: true }));
} else {
    config.devtool = "source-map";
}

module.exports = config;