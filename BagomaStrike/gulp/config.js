

const originSourceDir = 'public/src';
const originBuildDir = 'public/build';

module.exports = {
    src: originSourceDir,
    build: originBuildDir,

    js: {
        srcDir: `${originSourceDir}/js`,
        bldDir: `${originBuildDir}/js`,
        uglify: false
    },
    webpack: {
        entry: {
            bundle: `${originSourceDir}/js/index.js`
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
        extensions: ['','.js']
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loaders: ['babel', 'eslint-loader'] }
        ]
    },
    eslint:{
        configFile: './.eslintrc'
    }
};
