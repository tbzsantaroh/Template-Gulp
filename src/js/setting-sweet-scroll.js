// Sweet Scroll
//
// https://github.com/tsuyoshiwada/sweet-scroll
// http://webdesign-dackel.com/2015/12/17/sweet-scroll/


// npmインストールしたのの読み込み
import SweetScroll from 'sweet-scroll';

// 設定書くとこ
document.addEventListener(
  'DOMContentLoaded',
  () => {
    const scroller = new SweetScroll({
      /* some options */
    });
  },
  false,
);
