const path = require('path')

module.exports = {
    mode: "development",
    entry: {
        app: './src/app.ts',
        appscene2: './src/appscene2.ts',
        appscene3: './src/appscene3.ts',
        appscene4: './src/appscene4.ts',
        appscene5: './src/appscene5.ts',
    scene1: './src/scene1.ts',
    scene2: './src/scene2.ts',
    scene3: './src/scene3.ts',
    scene4: './src/scene4.ts',
    scene5: './src/scene5.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [],
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    }
}