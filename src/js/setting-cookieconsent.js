// GDPR cookie consent
// https://www.osano.com/cookieconsent

// npmインストールしたライブラリ
// CookieConsent https://www.npmjs.com/package/cookieconsent
// よくわかんなかったので手動で調べて追加
import 'cookieconsent/build/cookieconsent.min.js'; 

// 設定 osanoオフィシャルサイトに設定例ある
window.addEventListener("load", function(){
  window.cookieconsent.initialise({
    "palette": {
      "popup": {
        "background": "#000"
      },
      "button": {
        "background": "#f1d600"
      }
    },
    "content": {
      "message": "This website uses cookies.",
      "dismiss": "OK",
      "link": "Privacy Policy",
      "href": "https://sampleURL/privacy-policy/"
    },
    "law": {
      "regionalLaw": false,
    },
    location: true,
})});