/**
 *
 * @author
 * 游戏开始界面
 */
var GameStartPanel = (function (_super) {
    __extends(GameStartPanel, _super);
    function GameStartPanel() {
        _super.call(this);
        this.init();
    }
    var d = __define,c=GameStartPanel,p=c.prototype;
    //开启监听
    p.start = function () {
        this.startBtn.touchEnabled = true;
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
    };
    //初始化
    p.init = function () {
        this.bg = new egret.Bitmap(RES.getRes('gameStartBgImage'));
        this.addChild(this.bg);
        this.startBtn = new egret.TextField();
        this.startBtn.text = '开始游戏';
        this.addChild(this.startBtn);
        this.startBtn.x = (480 - this.startBtn.width) * 0.5;
        this.startBtn.y = 400;
    };
    p.onTouchTab = function (e) {
        var changeEvent = new ChangeSceneEvent(ChangeSceneEvent.CHANGE_SCENE_EVENT);
        changeEvent.eventType = GamePlayingPanel.CHANGEPANEL;
        changeEvent.obj = this;
        ViewManager.getInstance().dispatchEvent(changeEvent);
    };
    //结束界面，释放监听
    p.end = function () {
        this.startBtn.touchEnabled = false;
        if (this.startBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP))
            this.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
    };
    GameStartPanel.GAME_START = "gameStart";
    return GameStartPanel;
}(egret.Sprite));
egret.registerClass(GameStartPanel,'GameStartPanel');
//# sourceMappingURL=GameStartPanel.js.map