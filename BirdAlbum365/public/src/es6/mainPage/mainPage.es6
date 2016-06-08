
//モジュール
//名前空間（jadeファイル上にある）
const MainPageNameSpace = require('MainPageNameSpace');

//processで順に実行する関数モジュール
const socketJoin = require('./components/socketJoin');
const preloadData = require('./components/preloadData');
const init = require('./components/init');
const main = require('./components/main');


socketJoin(MainPageNameSpace)
    .then(preloadData)
    .then(init)
    .then(main);
