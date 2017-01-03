var Item = (function (_super) {
    __extends(Item, _super);
    function Item(name, ad, atk, x, y) {
        var _this = this;
        _super.call(this);
        this._body = new egret.Bitmap();
        this._body.texture = RES.getRes(ad);
        this._body.width = TileMap.TILE_SIZE;
        this._body.height = TileMap.TILE_SIZE;
        this.name = name;
        this.ad = ad;
        this.atk = atk;
        this._body.x = x;
        this._body.y = y;
        this.addChild(this._body);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.onItemClick();
        }, this);
    }
    var d = __define,c=Item,p=c.prototype;
    p.onChange = function () {
    };
    p.onItemClick = function () {
        if (SceneService.getInstance().list, length != 0) {
            SceneService.getInstance().list.cancel();
        }
        SceneService.getInstance().list.addCommand(new WalkCommand(Math.floor(this._body.x / TileMap.TILE_SIZE), Math.floor(this._body.y / TileMap.TILE_SIZE)));
        SceneService.getInstance().list.addCommand(new EquipCommand(this.name, this.ad, this.atk));
        SceneService.getInstance().list.execute();
    };
    return Item;
}(egret.DisplayObjectContainer));
egret.registerClass(Item,'Item',["Observer"]);
var NPC = (function (_super) {
    __extends(NPC, _super);
    //public NPCTalk:string;
    // public task:Task;
    function NPC(id, ad, x, y, dp) {
        _super.call(this);
        this._body = new egret.Bitmap();
        this._emoji = new egret.Bitmap();
        this.dialoguePanel = dp;
        this._body.texture = RES.getRes(ad);
        this._emoji.texture = RES.getRes("notice_png");
        this._id = id;
        this.x = x;
        this.y = y;
        this._body.width = this._body.width / 2;
        this._body.height = this._body.height / 2;
        this._emoji.width = 70;
        this._emoji.height = 70;
        this._emoji.y = -60;
        this._emoji.x = -5;
        this._emoji.alpha = 0;
        this.addChild(this._body);
        this.addChild(this._emoji);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onNPCClick, this);
    }
    var d = __define,c=NPC,p=c.prototype;
    d(p, "id"
        ,function () {
            return this._id;
        }
    );
    p.onChange = function (task) {
        if (task.status == TaskStatus.ACCEPTABLE && this.id == task.fromNpcId) {
            //task.status = TaskStatus.DURING;
            this._emoji.texture = RES.getRes("notice_png");
            this._emoji.alpha = 1;
        }
        if (task.status == TaskStatus.DURING && this.id == task.fromNpcId) {
            this._emoji.alpha = 0;
        }
        if (task.status == TaskStatus.DURING && this.id == task.toNpcId) {
            this._emoji.texture = RES.getRes("question_png");
            this._emoji.alpha = 1;
        }
        if (task.status == TaskStatus.CAN_SUBMIT && this.id == task.fromNpcId) {
            //this._emoji.texture = RES.getRes("question_png");
            this._emoji.alpha = 0;
        }
        if (task.status == TaskStatus.CAN_SUBMIT && this.id == task.toNpcId) {
            this._emoji.texture = RES.getRes("question_png");
            this._emoji.alpha = 1;
        }
        if (task.status == TaskStatus.SUBMITED && this.id == task.toNpcId) {
            this._emoji.alpha = 0;
        }
    };
    p.onNPCClick = function () {
        if (SceneService.getInstance().list, length != 0) {
            SceneService.getInstance().list.cancel();
        }
        SceneService.getInstance().list.addCommand(new WalkCommand(Math.floor(this.x / TileMap.TILE_SIZE), Math.floor(this.y / TileMap.TILE_SIZE)));
        SceneService.getInstance().list.addCommand(new TalkCommand(this.id));
        SceneService.getInstance().list.execute();
    };
    return NPC;
}(egret.DisplayObjectContainer));
egret.registerClass(NPC,'NPC',["Observer"]);
var TaskPanel = (function (_super) {
    __extends(TaskPanel, _super);
    //task:Task
    function TaskPanel(x, y) {
        _super.call(this);
        this.x = x;
        this.y = y;
        this.body = new egret.Shape();
        this.body.graphics.beginFill(0x000000, 0.4);
        this.body.graphics.drawRect(0, 0, 600, 100);
        this.body.graphics.endFill();
        this.textField = new egret.TextField();
        this.textField.text = "   任务进程    ";
        this.textField.x = 0;
        this.textField.x = 0;
        this.textField2 = new egret.TextField();
        this.textField2.text = "  任务状态    ";
        this.textField2.x = 0;
        this.textField2.y = 30;
        this.textField3 = new egret.TextField();
        this.textField2.text = "   进度    ";
        this.textField3.x = 0;
        this.textField3.y = 55;
        this.addChild(this.body);
        this.addChild(this.textField);
        this.addChild(this.textField2);
        this.addChild(this.textField3);
    }
    var d = __define,c=TaskPanel,p=c.prototype;
    p.onChange = function (task) {
        this.textField.text = task.desc;
        var tf;
        switch (task.status) {
            case 0:
                tf = "未可接受";
                break;
            case 1:
                tf = "可接受";
                break;
            case 2:
                tf = "进行中";
                break;
            case 3:
                tf = "可完成";
                break;
            case 4:
                tf = "已完成";
                break;
        }
        this.textField2.text = task.name + " :" + tf;
        this.textField3.text = task.name + " :" + task.getcurrent() + "/" + task.total;
    };
    return TaskPanel;
}(egret.DisplayObjectContainer));
egret.registerClass(TaskPanel,'TaskPanel',["Observer"]);
var DialoguePanel = (function (_super) {
    __extends(DialoguePanel, _super);
    function DialoguePanel(talk) {
        _super.call(this);
        this.body = new egret.Shape();
        this.body.graphics.beginFill(0x000000, 0.7);
        this.body.graphics.drawRect(0, 0, 600, 172);
        this.body.graphics.endFill();
        this.body.y = 450;
        this.textField = new egret.TextField();
        this.textField.text = talk;
        this.button = new Button("close_png");
        this.textField.x = 80;
        this.textField.y = 500;
        this.button.width = 40;
        this.button.height = 40;
        this.button.x = 500;
        this.button.y = 550;
        this.button.touchEnabled = true;
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }
    var d = __define,c=DialoguePanel,p=c.prototype;
    p.showDpanel = function () {
        this.addChild(this.body);
        this.addChild(this.button);
        this.addChild(this.textField);
    };
    p.updateViewByTask = function (task) {
        this.currentTask = task;
        if (task.id == "000" && this.linkNPC.id == "NPC_2") {
            this.textField.text = "变得不规则挺好的，哈哈哈，来跳舞吧！";
        }
        else {
            this.textField.text = this.currentTask.NPCTaskTalk;
        }
    };
    p.disshowDpanel = function () {
        this.removeChild(this.body);
        this.removeChild(this.button);
        this.removeChild(this.textField);
    };
    p.onButtonClick = function () {
        this.disshowDpanel();
        switch (this.currentTask.status) {
            case TaskStatus.ACCEPTABLE:
                TaskService.getInstance().accept(this.currentTask.id);
                if (this.currentTask.id == "000") {
                    TaskService.getInstance().finish(this.currentTask.id);
                    if (TaskService.getInstance().getNextTask() != null) {
                        TaskService.getInstance().getNextTask().status = TaskStatus.ACCEPTABLE;
                    }
                    if (TaskService.getInstance().getTaskByCustomRule() != null) {
                        this.updateViewByTask(TaskService.getInstance().getTaskByCustomRule());
                        TaskService.getInstance().notify(TaskService.getInstance().getTaskByCustomRule());
                    }
                }
                break;
            case TaskStatus.CAN_SUBMIT:
                TaskService.getInstance().finish(this.currentTask.id);
                if (TaskService.getInstance().getNextTask() != null) {
                    TaskService.getInstance().getNextTask().status = TaskStatus.ACCEPTABLE;
                }
                if (TaskService.getInstance().getTaskByCustomRule() != null) {
                    this.updateViewByTask(TaskService.getInstance().getTaskByCustomRule());
                    TaskService.getInstance().notify(TaskService.getInstance().getTaskByCustomRule());
                }
                break;
            default:
                break;
        }
        if (this.linkNPC.id == "NPC_2") {
            if (SceneService.getInstance().list, length != 0) {
                SceneService.getInstance().list.cancel();
            }
            SceneService.getInstance().list.addCommand(new FightCommand("npc_2_png"));
            SceneService.getInstance().list.execute();
        }
    };
    return DialoguePanel;
}(egret.DisplayObjectContainer));
egret.registerClass(DialoguePanel,'DialoguePanel');
var MockKillMonsterButton = (function (_super) {
    __extends(MockKillMonsterButton, _super);
    function MockKillMonsterButton(ad, linkTask) {
        var _this = this;
        _super.call(this, ad);
        this.count = 0;
        this.linkTask = linkTask;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonClick, this);
        egret.Ticker.getInstance().register(function () {
            if (_this.count < 5) {
                _this.body.scaleY *= 1.05;
            }
            else if (_this.count < 10 || _this.count >= 5) {
                _this.body.scaleY /= 1.05;
            }
            _this.count += 0.5;
            if (_this.count >= 10) {
                _this.count = 0;
            }
        }, this);
    }
    var d = __define,c=MockKillMonsterButton,p=c.prototype;
    p.onButtonClick = function () {
        if (TaskService.getInstance().taskList[this.linkTask].status == TaskStatus.DURING) {
            //console.log(TaskService.getInstance().taskList[this.linkTask]);  神奇的bug，注释掉console下面这句就执行不了，有这行console.log 下面就能执行
            //TaskService.getInstance().taskList[this.linkTask].condition.onChange(TaskService.getInstance().taskList[this.linkTask]);
            SceneService.getInstance().notify(TaskService.getInstance().taskList[this.linkTask]);
        }
    };
    p.onChange = function () {
    };
    return MockKillMonsterButton;
}(Button));
egret.registerClass(MockKillMonsterButton,'MockKillMonsterButton',["Observer"]);
//# sourceMappingURL=Observer.js.map