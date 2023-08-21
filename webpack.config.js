const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(ts|tsx)?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './index.html',
        }),
    ],
    devServer: {
        static: [path.join(__dirname, 'dist'), path.join(__dirname, 'public')],
        port: 9000,
    },

    resolve: {
        fallback: {
            fs: false,
            path: require.resolve("path-browserify")
        },
        extensions: ['.tsx', '.ts', '.js'],
    }

};
