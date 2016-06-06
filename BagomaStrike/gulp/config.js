

const originSourceDir = 'public/src';
const originBuildDir = 'public/build';

module.exports = {
    src: originSourceDir,
    build: originBuildDir,

    js: {
        srcDir: `${originSourceDir}/es6`,
        bldDir: `${originBuildDir}/js`,
        uglify: false
    },
    webpack: {
        entry: {
            bundle: `${originSourceDir}/es6/index.js`
        },
        output: {
            path: __dirname,
            fileName: '[name].js'
        }
    },
    externals: {
        "createjs": "createjs",
        "TweenLite": "TweenLite",
        "socket": "io"
    },
    resolve: {
        //requireするときに拡張子を省くことができるようになる。
        extensions: ['', '.es6']
    },
    module: {
        loaders: [
            { test: /\.es6$/, exclude: /node_modules/, loaders: ['babel', 'eslint-loader'] }
        ]
    },
    eslint:{
        configFile: './.eslintrc'
    }
};