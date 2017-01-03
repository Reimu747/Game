var SceneService = (function () {
    function SceneService() {
        this.observerList = [];
        this.list = new CommandList();
        SceneService.count++;
        if (SceneService.count > 1) {
            throw "singleton!!!";
        }
    }
    var d = __define,c=SceneService,p=c.prototype;
    SceneService.getInstance = function () {
        if (SceneService.instance == null) {
            SceneService.instance = new SceneService();
        }
        return SceneService.instance;
    };
    p.addObserver = function (observer) {
        for (var i = 0; i < this.observerList.length; i++) {
            if (observer == this.observerList[i])
                return ErrorCode.REPEAT_OBSERVER;
        }
        this.observerList.push(observer);
    };
    p.notify = function (task) {
        for (var _i = 0, _a = this.observerList; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer.onChange(task);
        }
    };
    SceneService.count = 0;
    return SceneService;
}());
egret.registerClass(SceneService,'SceneService',["EventEmitter"]);
var GameScene = (function () {
    function GameScene() {
    }
    var d = __define,c=GameScene,p=c.prototype;
    GameScene.replaceScene = function (scene) {
        GameScene.scene = scene;
    };
    GameScene.getCurrentScene = function () {
        return GameScene.scene;
    };
    p.moveTo = function (x, y, callback) {
        var _this = this;
        console.log("开始移动");
        var playerX = Math.floor(GameScene.getCurrentScene().player._body.x / TileMap.TILE_SIZE);
        var playerY = Math.floor(GameScene.getCurrentScene().player._body.y / TileMap.TILE_SIZE);
        // var playerX: number = 0;
        // var playerY: number = 0;
        var gridX = x;
        var gridY = y;
        var astar = new AStar();
        var grid = new Grid(12, 16, config);
        grid.setStartNode(playerX, playerY);
        grid.setEndNode(gridX, gridY);
        //console.log(grid._nodes);
        if (astar.findPath(grid)) {
            astar._path.map(function (tile) {
                console.log("x:" + tile.x + ",y:" + tile.y);
            });
            var path = astar._path;
            var current = path.shift();
            this.ticker = function () {
                playerX = Math.floor(GameScene.getCurrentScene().player._body.x / TileMap.TILE_SIZE);
                playerY = Math.floor(GameScene.getCurrentScene().player._body.y / TileMap.TILE_SIZE);
                // if (current.x - playerX > 0) {
                //     var tempX: number = 1;
                // }
                // if (current.x - playerX < 0) {
                //     var tempX: number = -1;
                // }
                // if (current.y - playerY > 0) {
                //     var tempY: number = 1;
                // }
                // if (current.y - playerY < 0) {
                //     var tempY: number = -1;
                // }
                GameScene.getCurrentScene().player._body.x += TileMap.TILE_SPEED * (current.x - playerX);
                GameScene.getCurrentScene().player._body.y += TileMap.TILE_SPEED * (current.y - playerY);
                //  GameScene.getCurrentScene().player._body.x += 3 * (current.x - playerX);
                // GameScene.getCurrentScene().player._body.y += 3 * (current.y - playerY);
                if (playerX == current.x && playerY == current.y) {
                    // var tween = egret.Tween.get(GameScene.getCurrentScene().player._body);
                    // tween.to ( {x:current.x * TileMap.TILE_SIZE,y:current.y * TileMap.TILE_SIZE}, 100 );
                    GameScene.getCurrentScene().player._body.x = current.x * TileMap.TILE_SIZE;
                    GameScene.getCurrentScene().player._body.y = current.y * TileMap.TILE_SIZE;
                    if (astar._path.length == 0) {
                        console.log("寻路完毕");
                        egret.Ticker.getInstance().unregister(_this.ticker, _this);
                        console.log("结束移动");
                        callback();
                    }
                    else {
                        current = path.shift();
                    }
                }
            };
            egret.Ticker.getInstance().register(this.ticker, this);
        }
    };
    p.stopMove = function (callback) {
        egret.Ticker.getInstance().unregister(this.ticker, this);
        egret.setTimeout(function () {
            console.log("中断移动");
            callback();
        }, this, 500);
    };
    GameScene.scene = new GameScene();
    return GameScene;
}());
egret.registerClass(GameScene,'GameScene');
var UIScene = (function () {
    function UIScene() {
    }
    var d = __define,c=UIScene,p=c.prototype;
    UIScene.replaceScene = function (scene) {
        UIScene.scene = scene;
    };
    UIScene.getCurrentScene = function () {
        return UIScene.scene;
    };
    p.gameMenu = function () {
        var stageW = 640;
        var stageH = 1136;
        console.log(stageW, stageH);
        var BlackMask = new egret.Shape();
        BlackMask.graphics.beginFill(0x000000, 1);
        BlackMask.graphics.drawRect(0, 0, stageW, stageH);
        BlackMask.graphics.endFill();
        BlackMask.width = stageW;
        BlackMask.height = stageH;
        GameScene.getCurrentScene().main.addChild(BlackMask);
        //   UIScene.getCurrentScene().hero = SetTriangle();
        //   var battle = new Battle(UIScene.getCurrentScene().hero,1,"npc_2_png",6,6);
        //  GameScene.getCurrentScene().main.addChild(battle);
        var WhiteMask = new egret.Shape();
        WhiteMask.graphics.beginFill(0xFFFFFF, 1);
        WhiteMask.graphics.drawRect(0, 0, stageW, stageH);
        WhiteMask.graphics.endFill();
        WhiteMask.width = stageW;
        WhiteMask.height = stageH;
        // //this.addChild(WhiteMask);
        // //WhiteMask.alpha = 0;
        var back = new egret.Bitmap();
        back.texture = RES.getRes("menu_jpg");
        GameScene.getCurrentScene().main.addChild(back);
        var stageW = 640;
        var stageH = 1136;
        back.width = stageW;
        back.height = stageH;
        back.y = -150;
        var count = 0;
        egret.Ticker.getInstance().register(function () {
            if (count < 5) {
                back.scaleY *= 1.003;
            }
            else if (count < 10 || count >= 5) {
                back.scaleY /= 1.003;
            }
            count += 0.5;
            if (count >= 10) {
                count = 0;
            }
        }, this);
        var Title = new egret.TextField();
        Title.textColor = 0xffffff;
        Title.width = stageW - 172;
        Title.textAlign = "center";
        Title.text = "二维位面之纯形争霸";
        Title.size = 50;
        Title.fontFamily = '黑体';
        Title.x = 100;
        Title.y = 100;
        GameScene.getCurrentScene().main.addChild(Title);
        var start = new egret.TextField();
        start.textColor = 0xffffff;
        start.width = stageW - 172;
        start.textAlign = "center";
        start.text = "开始游戏";
        start.size = 40;
        start.fontFamily = '黑体';
        start.x = 90;
        start.y = 800;
        GameScene.getCurrentScene().main.addChild(start);
        var material = new egret.TextField();
        material.textColor = 0xffffff;
        material.width = stageW - 172;
        material.textAlign = "center";
        material.text = "背景资料";
        material.size = 40;
        material.fontFamily = '黑体';
        material.x = 90;
        material.y = 850;
        GameScene.getCurrentScene().main.addChild(material);
        material.touchEnabled = true;
        material.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var p = new PageContainer();
            GameScene.getCurrentScene().main.removeChildren();
            GameScene.getCurrentScene().main.addChild(p);
        }, this);
        var about = new egret.TextField();
        about.textColor = 0xffffff;
        about.width = stageW - 172;
        about.textAlign = "center";
        about.text = "游戏理念";
        about.size = 40;
        about.fontFamily = '黑体';
        about.x = 90;
        about.y = 900;
        GameScene.getCurrentScene().main.addChild(about);
        about.touchEnabled = true;
        about.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameScene.getCurrentScene().main.removeChildren();
            UIScene.getCurrentScene().gameabout();
        }, this);
        start.touchEnabled = true;
        start.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameScene.getCurrentScene().main.removeChild(start);
            GameScene.getCurrentScene().main.removeChild(material);
            GameScene.getCurrentScene().main.removeChild(about);
            GameScene.getCurrentScene().main.removeChild(Title);
            GameScene.getCurrentScene().main.removeChild(back);
            UIScene.getCurrentScene().showPick();
        }, this);
    };
    p.showPick = function () {
        var _this = this;
        var pick = new egret.TextField();
        pick.textColor = 0xffffff;
        pick.width = 640 - 172;
        pick.textAlign = "center";
        pick.text = "选择进入一名纯形战士视角";
        pick.size = 36;
        pick.fontFamily = '黑体';
        pick.x = 90;
        pick.y = 400;
        GameScene.getCurrentScene().main.addChild(pick);
        var sanjiao = new egret.TextField();
        sanjiao.textColor = 0xffffff;
        sanjiao.width = 640 - 172;
        sanjiao.textAlign = "center";
        sanjiao.text = "▲三角（善于迂回和远程输出）";
        sanjiao.size = 30;
        sanjiao.fontFamily = '黑体';
        sanjiao.x = 90;
        sanjiao.y = 600;
        GameScene.getCurrentScene().main.addChild(sanjiao);
        sanjiao.touchEnabled = true;
        sanjiao.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            _this.ad = "sanjiao_png";
            switch (_this.ad) {
                case "sanjiao_png":
                    console.log("sanjiao");
                    _this.hero = SetTriangle();
                    break;
                case "fangkuai_png":
                    _this.hero = SetSquare();
                    break;
                case "zhengyuan_png":
                    _this.hero = SetCircle();
                    break;
            }
            GameScene.getCurrentScene().main.removeChild(pick);
            GameScene.getCurrentScene().main.removeChild(sanjiao);
            GameScene.getCurrentScene().main.removeChild(fangkuai);
            GameScene.getCurrentScene().main.removeChild(zhengyuan);
            _this.gamestart();
        }, this);
        var fangkuai = new egret.TextField();
        fangkuai.textColor = 0xffffff;
        fangkuai.width = 640 - 172;
        fangkuai.textAlign = "center";
        fangkuai.text = "■方块（侵略性强并善于近战）";
        fangkuai.size = 30;
        fangkuai.fontFamily = '黑体';
        fangkuai.x = 90;
        fangkuai.y = 650;
        GameScene.getCurrentScene().main.addChild(fangkuai);
        fangkuai.touchEnabled = true;
        fangkuai.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            _this.ad = "fangkuai_png";
            switch (_this.ad) {
                case "sanjiao_png":
                    console.log("sanjiao");
                    _this.hero = SetTriangle();
                    break;
                case "fangkuai_png":
                    _this.hero = SetSquare();
                    break;
                case "zhengyuan_png":
                    _this.hero = SetCircle();
                    break;
            }
            GameScene.getCurrentScene().main.removeChild(pick);
            GameScene.getCurrentScene().main.removeChild(sanjiao);
            GameScene.getCurrentScene().main.removeChild(fangkuai);
            GameScene.getCurrentScene().main.removeChild(zhengyuan);
            _this.gamestart();
        }, this);
        var zhengyuan = new egret.TextField();
        zhengyuan.textColor = 0xffffff;
        zhengyuan.width = 640 - 172;
        zhengyuan.textAlign = "center";
        zhengyuan.text = "●正圆（兼具灵活性和消耗战）";
        zhengyuan.size = 30;
        zhengyuan.fontFamily = '黑体';
        zhengyuan.x = 90;
        zhengyuan.y = 700;
        GameScene.getCurrentScene().main.addChild(zhengyuan);
        zhengyuan.touchEnabled = true;
        zhengyuan.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            _this.ad = "zhengyuan_png";
            switch (_this.ad) {
                case "sanjiao_png":
                    console.log("sanjiao");
                    _this.hero = SetTriangle();
                    break;
                case "fangkuai_png":
                    _this.hero = SetSquare();
                    break;
                case "zhengyuan_png":
                    _this.hero = SetCircle();
                    break;
            }
            GameScene.getCurrentScene().main.removeChild(pick);
            GameScene.getCurrentScene().main.removeChild(sanjiao);
            GameScene.getCurrentScene().main.removeChild(fangkuai);
            GameScene.getCurrentScene().main.removeChild(zhengyuan);
            _this.gamestart();
        }, this);
    };
    p.gameabout = function () {
        var rect = new egret.Shape();
        var textField = new egret.TextField();
        rect.graphics.beginFill(0x000000, 1);
        rect.graphics.drawRect(0, 0, 640, 1136);
        rect.graphics.endFill();
        GameScene.getCurrentScene().main.addChild(rect);
        textField.text = "作者 14081216 白宇昆\n这是一款半即时的战棋对抗游戏\n改编的刘慈欣的《镜子》作为剧情背景\n在二维位面里\n形状越正，血统越纯\n借几何喻人，反应现实\n未来可能会加入的新细节\n根据随机的颜色改变敌人的属性\nR攻击撞击力\nG连接深入能力\nB特殊攻击能力\n六边形，三角形等对战地图";
        GameScene.getCurrentScene().main.addChild(textField);
        textField.size = 30;
        textField.y = 200;
        textField.x = 60;
        textField.width = 620;
        var back = new egret.TextField();
        back.text = "返回";
        back.size = 30;
        back.touchEnabled = true;
        back.y = 900;
        back.x = 300;
        GameScene.getCurrentScene().main.addChild(back);
        back.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameScene.getCurrentScene().main.removeChildren();
            UIScene.getCurrentScene().gameMenu();
        }, this);
    };
    p.gamestart = function () {
        var equipmentButtun = new egret.TextField();
        equipmentButtun.text = "状态";
        equipmentButtun.size = 40;
        equipmentButtun.x = 280;
        equipmentButtun.y = 1000;
        GameScene.getCurrentScene().main.addChild(equipmentButtun);
        equipmentButtun.touchEnabled = true;
        equipmentButtun.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (PropertyPanel.flag == 0) {
                console.log(PropertyPanel.flag);
                var pp = new PropertyPanel(UIScene.getCurrentScene().hero);
                GameScene.getCurrentScene().main.addChild(pp);
            }
        }, this);
        var Dpanel_1 = new DialoguePanel("年轻纯种的纯形战士，我已经被腐化了，去找还有希望被拯救的形状吧");
        var Dpanel_2 = new DialoguePanel("我还有救，但变得不规则好像也没什么不好，先跟我较量看看吧");
        this.dp1 = Dpanel_1;
        this.dp2 = Dpanel_2;
        var NPC_1 = new NPC("NPC_1", "npc_1_png", TileMap.TILE_SIZE * 4, TileMap.TILE_SIZE * 4, this.dp1);
        var NPC_2 = new NPC("NPC_2", "npc_2_png", TileMap.TILE_SIZE * 6, TileMap.TILE_SIZE * 12, this.dp2);
        this.dp1.linkNPC = NPC_1;
        this.dp2.linkNPC = NPC_2;
        var task_0 = new Task("000", "对话任务", new NPCTalkTaskCondition());
        task_0.fromNpcId = "NPC_1";
        task_0.toNpcId = "NPC_2";
        task_0.desc = "救援伤残纯形几何体";
        task_0.NPCTaskTalk = "不要管我了，我不行了";
        task_0.total = 1;
        task_0.status = TaskStatus.ACCEPTABLE;
        var task_1 = new Task("001", "战斗任务", new KillMonsterTaskCondition());
        task_1.fromNpcId = "NPC_2";
        task_1.toNpcId = "NPC_2";
        task_1.desc = "探寻下方的几何体";
        task_1.NPCTaskTalk = "哈哈哈哈哈，放荡不羁";
        task_1.total = 1;
        task_1.status = TaskStatus.UNACCEPTABLE;
        TaskService.getInstance().addTask(task_0);
        TaskService.getInstance().addTask(task_1);
        var mainPanel = new TaskPanel(50, 850);
        TaskService.getInstance().addObserver(mainPanel);
        TaskService.getInstance().addObserver(NPC_1);
        TaskService.getInstance().addObserver(NPC_2);
        TaskService.getInstance().notify(TaskService.getInstance().getTaskByCustomRule());
        this.dp1.updateViewByTask(TaskService.getInstance().getTaskByCustomRule());
        this.dp2.updateViewByTask(TaskService.getInstance().getTaskByCustomRule());
        // var monster_1: MockKillMonsterButton = new MockKillMonsterButton("egret_icon_png", "001");
        // this.addChild(monster_1);
        // monster_1.body.x = 350;
        // monster_1.body.y = 600;
        //var scenceService:SceneService = new SceneService();
        //SceneService.getInstance().addObserver(monster_1);
        SceneService.getInstance().addObserver(task_1.condition);
        this.item = new Item("五角星型残骸", "star_png", 5, TileMap.TILE_SIZE * 11, TileMap.TILE_SIZE * 0);
        var player = new Player(this.ad);
        GameScene.getCurrentScene().player = player;
        var map = new TileMap(GameScene.getCurrentScene().player);
        GameScene.getCurrentScene().main.addChild(map);
        GameScene.getCurrentScene().main.addChild(GameScene.getCurrentScene().player);
        GameScene.getCurrentScene().player.idle();
        GameScene.getCurrentScene().main.addChild(mainPanel);
        GameScene.getCurrentScene().main.addChild(NPC_1);
        GameScene.getCurrentScene().main.addChild(NPC_2);
        GameScene.getCurrentScene().main.addChild(this.dp1);
        GameScene.getCurrentScene().main.addChild(this.dp2);
        GameScene.getCurrentScene().main.addChild(this.item);
    };
    p.gamebadend = function () {
        var no = new egret.Bitmap();
        no.texture = RES.getRes("End_jpg");
        no.width = 640;
        no.height = 1134;
        GameScene.getCurrentScene().main.addChild(no);
        var back = new egret.TextField();
        back.text = "返回主菜单";
        back.size = 30;
        back.touchEnabled = true;
        back.y = 900;
        back.x = 250;
        GameScene.getCurrentScene().main.addChild(back);
        back.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameScene.getCurrentScene().main.removeChildren();
            UIScene.getCurrentScene().gameMenu();
        }, this);
    };
    p.gamehappyend = function () {
        var blackback = new egret.Shape();
        blackback.graphics.beginFill(0x000000, 1);
        blackback.graphics.drawRect(0, 0, 640, 1134);
        blackback.graphics.endFill();
        blackback.width = 640;
        blackback.height = 1134;
        GameScene.getCurrentScene().main.addChild(blackback);
        var win = new egret.TextField();
        win.textColor = 0xffffff;
        win.width = 640 - 172;
        win.textAlign = "center";
        win.text = "纯形战士战胜了不规则几何体，但战斗仍将继续！";
        win.size = 50;
        win.fontFamily = '黑体';
        win.x = 100;
        win.y = 300;
        GameScene.getCurrentScene().main.addChild(win);
        var back = new egret.TextField();
        back.text = "返回主菜单";
        back.size = 30;
        back.touchEnabled = true;
        back.y = 900;
        back.x = 250;
        GameScene.getCurrentScene().main.addChild(back);
        back.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameScene.getCurrentScene().main.removeChildren();
            UIScene.getCurrentScene().gameMenu();
        }, this);
    };
    return UIScene;
}());
egret.registerClass(UIScene,'UIScene');
//# sourceMappingURL=Scene.js.map