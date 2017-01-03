interface Observer {
    onChange(task: Task): void;
}

class Item extends egret.DisplayObjectContainer implements Observer {

    public _body: egret.Bitmap;
    public ad: string;
    itemName: string;
    item: Equipment;
    atk: number;
    name: string;
    constructor(name: string, ad: string, atk: number, x: number, y: number) {

        super();
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
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.onItemClick();
        }, this);

    }
    onChange() {

    }

    onItemClick() {

        if (SceneService.getInstance().list, length != 0) {
            SceneService.getInstance().list.cancel();
        }
        SceneService.getInstance().list.addCommand(new WalkCommand(Math.floor(this._body.x / TileMap.TILE_SIZE), Math.floor(this._body.y / TileMap.TILE_SIZE)));
        SceneService.getInstance().list.addCommand(new EquipCommand(this.name, this.ad, this.atk));
        SceneService.getInstance().list.execute();

    }
}

class NPC extends egret.DisplayObjectContainer implements Observer {
    public _emoji: egret.Bitmap;
    public _body: egret.Bitmap;
    private _id: string;
    public dialoguePanel: DialoguePanel;
    //public NPCTalk:string;
    // public task:Task;
    constructor(id: string, ad: string, x: number, y: number, dp: DialoguePanel) {
        super();
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

    get id(): string {
        return this._id;
    }
    onChange(task: Task) {
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
    }

    onNPCClick() {
        if (SceneService.getInstance().list, length != 0) {
            SceneService.getInstance().list.cancel();
        }
        SceneService.getInstance().list.addCommand(new WalkCommand(Math.floor(this.x / TileMap.TILE_SIZE), Math.floor(this.y / TileMap.TILE_SIZE)));
        SceneService.getInstance().list.addCommand(new TalkCommand(this.id));
        SceneService.getInstance().list.execute();



    }
}

class TaskPanel extends egret.DisplayObjectContainer implements Observer {

    body: egret.Shape;
    textField: egret.TextField;
    textField2: egret.TextField;
    textField3: egret.TextField;
    //task:Task
    constructor(x: number, y: number) {
        super();
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

    onChange(task: Task): void {
        this.textField.text = task.desc;
        var tf: string;
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
    }

}


class DialoguePanel extends egret.DisplayObjectContainer {

    button: Button;
    textField: egret.TextField;
    body: egret.Shape;
    currentTask: Task;
    linkNPC: NPC;
    nextTask: Task;

    constructor(talk: string) {

        super();
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

    showDpanel() {

        this.addChild(this.body);
        this.addChild(this.button);
        this.addChild(this.textField);

    }

    public updateViewByTask(task: Task) {
        this.currentTask = task;
        if (task.id == "000" && this.linkNPC.id == "NPC_2") {
            this.textField.text = "变得不规则挺好的，哈哈哈，来跳舞吧！";
        }
        else {
            this.textField.text = this.currentTask.NPCTaskTalk;
        }
    }

    disshowDpanel() {
        this.removeChild(this.body);
        this.removeChild(this.button);
        this.removeChild(this.textField);

    }

    onButtonClick() {



        this.disshowDpanel();
        switch (this.currentTask.status) {
            case TaskStatus.ACCEPTABLE:

                TaskService.getInstance().accept(this.currentTask.id);
                if (this.currentTask.id == "000") {
                    TaskService.getInstance().finish(this.currentTask.id);
                    if (TaskService.getInstance().getNextTask() != null)
                    { TaskService.getInstance().getNextTask().status = TaskStatus.ACCEPTABLE; }

                    if (TaskService.getInstance().getTaskByCustomRule() != null) {
                        this.updateViewByTask(TaskService.getInstance().getTaskByCustomRule());
                        TaskService.getInstance().notify(TaskService.getInstance().getTaskByCustomRule());
                    }
                }
                break;
            case TaskStatus.CAN_SUBMIT:

                TaskService.getInstance().finish(this.currentTask.id);

                if (TaskService.getInstance().getNextTask() != null)
                { TaskService.getInstance().getNextTask().status = TaskStatus.ACCEPTABLE; }

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

    }
}


class MockKillMonsterButton extends Button implements Observer {
    public count = 0;
    public linkTask: string;

    constructor(ad: string, linkTask: string) {
        super(ad);
        this.linkTask = linkTask;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonClick, this);
        egret.Ticker.getInstance().register(() => {

            if (this.count < 5) {
                this.body.scaleY *= 1.05;
            }
            else if (this.count < 10 || this.count >= 5) {
                this.body.scaleY /= 1.05;
            }
            this.count += 0.5;
            if (this.count >= 10) {
                this.count = 0;
            }

        }, this);
    }

    onButtonClick() {

        if (TaskService.getInstance().taskList[this.linkTask].status == TaskStatus.DURING) {

            //console.log(TaskService.getInstance().taskList[this.linkTask]);  神奇的bug，注释掉console下面这句就执行不了，有这行console.log 下面就能执行
            //TaskService.getInstance().taskList[this.linkTask].condition.onChange(TaskService.getInstance().taskList[this.linkTask]);
            SceneService.getInstance().notify(TaskService.getInstance().taskList[this.linkTask]);
        }
    }

    onChange() {

    }
}