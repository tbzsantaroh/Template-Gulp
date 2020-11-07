// audioタグの音声を任意の要素クリックで再生する
//
// htmlの上から順番にボイス再生タグを取得しているだけなので、ファイル名には関係なくボタンと音声データの関連付けが行われている点に注意。


window.onload = () => { // できれば指定ページでだけ読み込むってやりたい
  const btns = document.querySelectorAll('.voiceplay'); // ボイス再生ボタンを変数登録
  const datas = document.querySelectorAll('.voicedata'); // ボイスデータタグを変数登録

  for (let i=0; i<btns.length; i++){ // ボイス再生ボタンの数だけループ処理
    btns[i].addEventListener('click', () => datas[i].play()); // ボイス再生ボタンのクリックを取得してボイスデータタグを再生する。 ファイル名はループ数から取得。
  }
}
