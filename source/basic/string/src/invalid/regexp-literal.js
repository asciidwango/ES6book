// 正規表現リテラルはロード時にパターンが評価され、例外が発生する
function main(){
    // `+`は繰り返しを意味する特殊文字であるため、単独で書けない
    const invalidPattern = /+/;
}

// `main`関数を呼び出さなくても例外が発生する