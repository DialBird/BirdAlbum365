
var originSrcDir = './public/src';
var originBldDir = './public/build';

module.exports = {
    src: originSrcDir,
    bld: originBldDir,
    js: {
        srcDir: originSrcDir + '/es6',
        bldDir: originBldDir + '/js',
        uglify: true
    },
    webpack: {
        entry: {
            introPage.js: originSrcDir + '/es6/introPage.es6',
            mainPage.js: originBldDir + '/es6/mainPage.es6'
        },
        output: {
            path: __dirname,
            filename: [name].js
        },
        resolve: {
            extensions: ['', '.es6']
        },
        module: {
            loaders: [
                {test: /\.es6$/, exclude: /node_modules/, loaders: ['babel', 'eslint-loader']}
            ]
        },
        eslint: {
            configFile: './.eslintrc'
        }
    },
    css: {
        srcDir: originSrcDir + '/sass',
        bldDir: originBldDir + '/css'
    },
    img: {
        srcDir: originSrcDir + '/img',
        bldDir: originBldDir + '/img'
    },
    audio: {
        srcDir: originSrcDir + '/audio',
        bldDir: originBldDir + '/audio'
    }
}
};