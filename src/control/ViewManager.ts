/**
 *
 * @author 
 * 主要控制三个界面的切换
 */
class ViewManager extends egret.Sprite {
    public constructor() {
        super();
        this.init();
    }

    private static instance:ViewManager;
    private gameStartPanel: GameStartPanel; // 开始界面
    private gameEndPanel: GameEndPanel; //游戏结束界面
    private gamePlayingPanel: GamePlayingPanel; //游戏中界面 
	/**
	 * 这里初始化
	 */
    private init() {
        this.gameStartPanel = new GameStartPanel();
        this.gameEndPanel = new GameEndPanel();
        this.gamePlayingPanel = new GamePlayingPanel();
        this.addChild(this.gameStartPanel);
        this.gameStartPanel.start();
        this.addEventListener(ChangeSceneEvent.CHANGE_SCENE_EVENT,this.onChangeScene,this);

    }

    public start()
    {
        this.addEventListener(ChangeSceneEvent.CHANGE_SCENE_EVENT,this.onChangeScene,this);
    }
    public static getInstance():ViewManager
    {
        if(ViewManager.instance == null)
        {
            ViewManager.instance = new ViewManager();
        }

        return ViewManager.instance;
    }

    public onChangeScene(e:ChangeSceneEvent)
    {
        e.obj.end();
        this.removeChildren();

        switch (e.eventType)
        {
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
            default :
                break;
        }
    }
}
