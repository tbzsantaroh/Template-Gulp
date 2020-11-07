module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ]
};
{   // 手動追加 chrome用グローバル変数
    "globals": {
        "window": true,
        "document": true
    }
}