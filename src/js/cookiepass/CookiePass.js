// このファイルだけ読み込めばcookie確認ポップアップが表示される
/**
* iframe.html の 39行目
* max-age=
* ここで有効期限を指定しておく
*/


// cookieを連想配列に入れる
// document.cookieで取り出すと、他のcookieも一緒に平文で出てくるから!==では判別できないので配列にする
function getCookieArray(){
  var arr = new Array();
  if(document.cookie != ''){
    var tmp = document.cookie.split('; ');
    for(var i=0;i<tmp.length;i++){
      var data = tmp[i].split('=');
      arr[data[0]] = decodeURIComponent(data[1]);
    }
  }
  return arr;
}

// 配列に入れたcookieを変数にぶちこむ
var arr = getCookieArray();
var over18result = arr["over18"];


// ポップアップウィンドを生成する
if(over18result !== 'true') { // cookieが無い場合は以下を実行

  /**
  * iframeの変数
  * @type {object}
  */
  const ifra = document.createElement('iframe');


// このjsファイルのパスを取得 iframeのディレクトリ位置を指定するため
// https://qiita.com/kijtra/items/472cb34a8f0eb6dde459
// https://stackoverflow.com/questions/984510/what-is-my-script-src-url/984656#984656
// Q. Neil C. Obremski https://stackoverflow.com/users/9642/neil-c-obremski
// A. Crescent Fresh https://stackoverflow.com/users/45433/crescent-fresh
  var current = (function() {
    if (document.currentScript) {
      return document.currentScript.src;
    } else {
      var scripts = document.getElementsByTagName('script'),
          script = scripts[scripts.length-1];
      if (script.src) {
        return script.src;
      }
    }
  })();

  // パスに含まれてるファイル名部分を削除して、ディレクトリのみにする
  currentdir = current.slice(0, -13);

  ifra.src = currentdir + 'iframe/iframe.html';  // iframeのソースアドレス入れる
  ifra.id = 'cookiepassWindow'; // iframeのid付与 Yesボタン押した時にこのidに対してdisplay:noneがつく

  document.body.appendChild(ifra); // bodyの最後にiframe要素を生成する

  // iframeをポップアップしてるウィンドウっぽく見せるCSS
  ifra.style.position = 'fixed';
  ifra.style.top = '0';
  ifra.style.left = '0';
  ifra.style.width = '100vw';
  ifra.style.height = '100vh';
  ifra.style.zIndex = '999999';
  ifra.style.border = 'none';
}