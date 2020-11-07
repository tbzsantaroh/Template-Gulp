import anime from 'animejs/lib/anime.es.js';  // anime.js https://github.com/juliangarnier/anime/#es6-modules


const IndexAnimeSet = anime.timeline({
//  targets: '#TLParamsInheritance .el',
  delay: 100,
  duration: 1500,
  easing: 'easeOutQuart',
});
IndexAnimeSet
.add({  // モバイル用ど真ん中テキスト 初期値
  targets: '#index-anime2',
  opacity: 1,
  duration: 1,
})
.add({  // 右タイトルロゴ 初期値
  targets: '#index-anime3',
  opacity: 0,
  translateY: 10,
  duration: 1,
})
.add({  // 右日 初期値
  targets: '#index-anime4',
  opacity: 0,
  translateY: 10,
  duration: 1,
})
.add({  // 先行 初期値
  targets: '#index-anime41',
  opacity: 0,
  translateY: 10,
  duration: 1,
})
.add({  // 左PC用テキスト 初期値
  targets: '#index-anime6',
  opacity: 0,
  duration: 1,
})

.add({  // モバイル用ど真ん中テキスト 2000 -> 2
  targets: '#index-anime2',
  opacity: 0,
  delay: 2000,
  duration: 500,
})
.add({  // 背景白色をフェードアウト 3000 -> 3
  targets: '#index-anime1',
  opacity: .2,
  duration: 3000,
  // イージングを上書きします
  easing: 'easeInExpo',
})
.add({  // 邪魔で下のボタン押せないので白背景を消す
  targets: '#index-anime1',
  scale: 0, // display:noneでないのでサイズ0にして消す
  duration: 1,
})
.add({  // 右タイトルロゴ
  targets: '#index-anime3',
  opacity: 1,
  translateY: -10,

  duration: 2000,
})
.add({  // 右日
  targets: '#index-anime41',
  opacity: 1,
  translateY: -10,
  delay: -1000,
  duration: 2000,
})
.add({  // 右日
  targets: '#index-anime4',
  opacity: 1,
  translateY: -10,
  delay: -1900,
  duration: 2000,
})
.add({  // 左PC用テキスト
  targets: '#index-anime6',
  opacity: 1,
  delay: -1000,
  duration: 2000,
})
