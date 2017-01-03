/**
 *
 * @author
 * 游戏界面
 */
var GamePlayingPanel = (function (_super) {
    __extends(GamePlayingPanel, _super);
    function GamePlayingPanel() {
        _super.call(this);
        this.timeNumbers = 20; //计时的秒数
        this.init();
    }
    var d = __define,c=GamePlayingPanel,p=c.prototype;
    //开启监听
    p.start = function () {
        this.timeNumbers = 20;
        this.timer.start();
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
    };
    //初始化
    p.init = function () {
        this.bg = new egret.Bitmap(RES.getRes('gamePlayingBgImage'));
        this.addChild(this.bg);
        this.timeTitle = new egret.TextField();
        this.timeTitle.text = "剩余时间：" + this.timeNumbers + " 秒";
        this.timeTitle.x = (480 - this.timeTitle.width) * 0.5;
        this.timeTitle.y = 400;
        this.addChild(this.timeTitle);
        this.timer = new egret.Timer(1000, this.timeNumbers);
    };
    p.onTimer = function (e) {
        this.timeNumbers -= 1;
        this.timeTitle.text = "剩余时间：" + this.timeNumbers + " 秒";
    };
    p.onTimerComplete = function (e) {
        var changeEvent = new ChangeSceneEvent(ChangeSceneEvent.CHANGE_SCENE_EVENT);
        changeEvent.eventType = GameEndPanel.GAME_END;
        changeEvent.obj = this;
        ViewManager.getInstance().dispatchEvent(changeEvent);
    };
    //结束界面，释放监听
    p.end = function () {
        if (this.timer.hasEventListener(egret.TimerEvent.TIMER))
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        if (this.timer.hasEventListener(egret.TimerEvent.TIMER_COMPLETE))
            this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        this.timer.stop();
        this.timer.reset();
    };
    GamePlayingPanel.CHANGEPANEL = "changepanel";
    return GamePlayingPanel;
}(egret.Sprite));
egret.registerClass(GamePlayingPanel,'GamePlayingPanel');
//# sourceMappingURL=GamePlayingPanel.js.map