/**
 *
 * @author
 * 主要控制三个界面的切换
 */
var ViewManager = (function (_super) {
    __extends(ViewManager, _super);
    function ViewManager() {
        _super.call(this);
        this.init();
    }
    var d = __define,c=ViewManager,p=c.prototype;
    /**
     * 这里初始化
     */
    p.init = function () {
        this.gameStartPanel = new GameStartPanel();
        this.gameEndPanel = new GameEndPanel();
        this.gamePlayingPanel = new GamePlayingPanel();
        this.addChild(this.gameStartPanel);
        this.gameStartPanel.start();
        this.addEventListener(ChangeSceneEvent.CHANGE_SCENE_EVENT, this.onChangeScene, this);
    };
    p.start = function () {
        this.addEventListener(ChangeSceneEvent.CHANGE_SCENE_EVENT, this.onChangeScene, this);
    };
    ViewManager.getInstance = function () {
        if (ViewManager.instance == null) {
            ViewManager.instance = new ViewManager();
        }
        return ViewManager.instance;
    };
    p.onChangeScene = function (e) {
        e.obj.end();
        this.removeChildren();
        switch (e.eventType) {
            case GameStartPanel.GAME_START:
                this.gameStartPanel.start();
                this.addChild(this.gameStartPanel);
                break;
            case GamePlayingPanel.CHANGEPANEL:
                this.gamePlayingPanel.start();
                this.addChild(this.gamePlayingPanel);
                break;
            case GameEndPanel.GAME_END:
                this.gameEndPanel.start();
                this.addChild(this.gameEndPanel);
                break;
            default:
                break;
        }
    };
    return ViewManager;
}(egret.Sprite));
egret.registerClass(ViewManager,'ViewManager');
//# sourceMappingURL=ViewManager.js.map