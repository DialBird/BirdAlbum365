

//------------------------------------------------------
//名前空間(routesでのグローバル変数を定義)
//------------------------------------------------------

var namespace = {
    /*
    ThreeJSの情報を格納しておく
    */
    //planeの枚数（鳥の名前を枚数分選ぶ必要がある）
    planeNum: 100,
    
    /*
    鳥の情報を持ってくるキーとなる鳥の名前を季節ジャンルに分けて格納
    */
    
    birdNames: { summer: 
                [ 'akasyoubin',
                 'chigohayabusa',
                 'daisagi',
                 'hachikuma',
                 'iwatsubame',
                 'kakkou',
                 'kibitaki',
                 'kisekirei',
                 'koajisashi',
                 'kochidori',
                 'komukudori',
                 'kosamebitaki',
                 'nobitaki',
                 'nogoma',
                 'ooruri',
                 'ooyoshikiri',
                 'sankoutyou',
                 'sashiba',
                 'tsubame',
                 'umineko' ],
                winter: 
                [ 'hashibirogamo',
                 'hidorigamo',
                 'hishikui',
                 'hoojirogamo',
                 'joubitaki',
                 'kashiradaka',
                 'kinkurohajiro',
                 'kogamo',
                 'kohakutyou',
                 'kuroji',
                 'mahiwa',
                 'mikoaisa',
                 'onagagamo',
                 'oowashi',
                 'oshidori',
                 'shime',
                 'sirohara',
                 'tsugumi',
                 'tyougenbou',
                 'yurikamome' ],
                journey: 
                [ 'ajisashi',
                 'daisyakusigi',
                 'ezobitaki',
                 'hourokushigi',
                 'koobashigi',
                 'kuroharaajisasi',
                 'kyoujosigi',
                 'miyubishigi',
                 'ojirotounen',
                 'oohashishigi',
                 'oomedaitidori',
                 'tashigi' ],
                resident: 
                [ 'akagera',
                 'aogera',
                 'aoji',
                 'aosagi',
                 'ban',
                 'dobato',
                 'enaga',
                 'goisagi',
                 'gojuukara',
                 'hakusekirei',
                 'hashibosogarasu',
                 'hashibutogarasu',
                 'hayabusa',
                 'hibari',
                 'hiyodori',
                 'hoojiro',
                 'isohiyodori',
                 'isoshigi',
                 'kaitsuburi',
                 'kakesu',
                 'karugamo',
                 'kasasagi',
                 'kawarahiwa',
                 'kawasemi',
                 'kawau',
                 'kiji',
                 'kijibato',
                 'kikuitadaki',
                 'kogera',
                 'kojukei',
                 'kosagi',
                 'mejiro',
                 'misosazai',
                 'mozu',
                 'mukudori',
                 'ooban',
                 'ootaka',
                 'ruribitaki',
                 'segurosekirei',
                 'shijuukara',
                 'sirotidori',
                 'suzume',
                 'tonbi',
                 'tsumi',
                 'uguisu',
                 'uso',
                 'yamagara' ] }
}

module.exports = namespace;