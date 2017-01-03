/**
 *
 * @author
 * 游戏结束界面
 */
var GameEndPanel = (function (_super) {
    __extends(GameEndPanel, _super);
    function GameEndPanel() {
        _super.call(this);
        this.init();
    }
    var d = __define,c=GameEndPanel,p=c.prototype;
    //开启监听
    p.start = function () {
        this.restartBtn.touchEnabled = true;
        this.restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
    };
    //初始化
    p.init = function () {
        this.bg = new egret.Bitmap(RES.getRes('gameEndBgImage'));
        this.addChild(this.bg);
        this.restartBtn = new egret.TextField();
        this.restartBtn.text = '重新开始游戏';
        this.addChild(this.restartBtn);
        this.restartBtn.x = (480 - this.restartBtn.width) * 0.5;
        this.restartBtn.y = 400;
    };
    p.onTouchTab = function (e) {
        var changeEvent = new ChangeSceneEvent(ChangeSceneEvent.CHANGE_SCENE_EVENT);
        changeEvent.eventType = GameStartPanel.GAME_START;
        changeEvent.obj = this;
        ViewManager.getInstance().dispatchEvent(changeEvent);
    };
    //结束界面，释放监听
    p.end = function () {
        this.restartBtn.touchEnabled = false;
        if (this.restartBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP))
            this.restartBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
    };
    GameEndPanel.GAME_END = "gameEnd";
    return GameEndPanel;
}(egret.Sprite));
egret.registerClass(GameEndPanel,'GameEndPanel');
//# sourceMappingURL=GameEndPanel.js.map