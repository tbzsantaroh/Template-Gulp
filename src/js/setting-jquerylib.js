// jQuery使用ライブラリの設定
// webpack範囲外なので手動コピー必要

$(function() {
  // SNSボタン jssocials
	$('.share').jsSocials({
		showLabel: false,
    showCount: false,
    shares: ['twitter', 'facebook']
	});


  $('a[data-rel^=lightcase]').lightcase({
		shrinkFactor: 1,
		maxWidth: 2560,
		maxHeight: 1600,
    timeout: 3000
  });

  $('a[data-rel^=lightcasegallery]').lightcase({  // ギャラリーページ用解像度
    shrinkFactor: 1,
    maxWidth: 1280,
    maxHeight: 720,
    iframe: {
      width: '1280',
      height: '100vh',
      frameborder: 0
    }
  });


  // 右下の戻るボタンがスクロールしてから表示されるように
	var topBtn = $('.return_to_top');
  topBtn.hide();
  $(window).scroll(function () {  // http://semooh.jp/jquery/api/events/scroll/fn/ scrollイベントってこと Intersection Observer APIで置き換えが良さそう
    if ($(this).scrollTop() > 100) {
        topBtn.fadeIn();
    } else {
        topBtn.fadeOut();
    }
  });

});

// iframeの高さ自動取得
$(".iframeAutoHeight").on("load", function(){
  try {
      $(this).height(0);
      $(this).height(this.contentWindow.document.documentElement.scrollHeight);
  } catch (e) {
  }
});
$(".iframeAutoHeight").trigger("load");