
interface Command {

    execute(callback: Function): void;

    cancel(callback: Function): void;

}

class WalkCommand implements Command {
    private x;
    private y;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    execute(callback: Function): void {
        GameScene.getCurrentScene().moveTo(this.x, this.y, function () {
            callback();
        })
    }

    cancel(callback: Function) {
        GameScene.getCurrentScene().stopMove(function () {
            callback();
        })
    }
}

class FightCommand implements Command {

    private _hasBeenCancelled = false;
    enemyad: string;
    main: Main;
    constructor(ad: string) {
        this.enemyad = ad;

    }

    execute(callback: Function): void {

        console.log("开始战斗");
        console.log(UIScene.getCurrentScene().hero);
        var battle = new Battle(UIScene.getCurrentScene().hero, 1, this.enemyad, 6, 6);
        if (GameScene.getCurrentScene().main.$children.length != 0)
        { GameScene.getCurrentScene().main.removeChildren(); }
        GameScene.getCurrentScene().main.addChild(battle);

        // egret.setTimeout(() => {
        //  if (!this._hasBeenCancelled) {
        //     console.log("结束战斗")
        //     callback();
        // }
        //     }, this, 500)
       var batteEnd =  egret.setInterval(() => {
            if (battle.judgeEnemyDeath() == true) {
                console.log("敌人死亡，结束战斗");
                callback();
                GameScene.getCurrentScene().main.removeChildren();
               UIScene.getCurrentScene().gamehappyend();
               egret.clearInterval(batteEnd);
            }
            if (battle.judgeHeroDeath() == true) {
                console.log("英雄阵亡，结束战斗");
                callback();
                GameScene.getCurrentScene().main.removeChildren();
                UIScene.getCurrentScene().gamebadend();
                egret.clearInterval(batteEnd);
            }

        }, this, 500);



    }

    cancel(callback: Function) {
        console.log("脱离战斗")
        this._hasBeenCancelled = true;
        egret.setTimeout(function () {
            callback();
        }, this, 100)

    }
}

class TalkCommand implements Command {

    npcid: string;
    constructor(npcad: string) {
        this.npcid = npcad;
    }

    execute(callback: Function): void {

        if (this.npcid == "NPC_1") {
            UIScene.getCurrentScene().dp1.showDpanel();
        }
        if (this.npcid == "NPC_2") {
            UIScene.getCurrentScene().dp2.showDpanel();
        }
        console.log("打开对话框");
        egret.setTimeout(function () {
            console.log("结束对话");
            callback();
        }, this, 2000);
    }

    cancel(callback: Function) {
        if (this.npcid == "NPC_1") {
            UIScene.getCurrentScene().dp1.disshowDpanel();
        }
        if (this.npcid == "NPC_2") {
            UIScene.getCurrentScene().dp2.disshowDpanel();
        }
        console.log("关闭对话框");
        callback();
    }
}


class EquipCommand implements Command {
   
    private name:string;
    item:Equipment;
    ad:string;
    atk:number;
    constructor(name:string,ad:string,atk:number) {
        this.name = name;
        this.ad = ad;
        this.atk = atk;
    }

    execute(callback: Function): void {
        var ruen_1: rune[] = [new rune(2), new rune(3)];
        this.item = new Equipment(this.name, this.ad, 1, this.atk, ruen_1);
        UIScene.getCurrentScene().hero.equip(this.item);
        GameScene.getCurrentScene().main.removeChild(UIScene.getCurrentScene().item);
        callback();
        
    }

    cancel(callback: Function) {
       
            callback();
        
    }
}

class CommandList {

    private _list: Command[] = [];
    private currentCommand: Command;
    private _frozen = false;

    addCommand(command: Command) {
        this._list.push(command);
    }

    cancel() {
        this._frozen = true;
        var command = this.currentCommand;
        egret.setTimeout(() => {
            if (this._frozen) {
                this._frozen = false;
            }

        }, this, 100);
        if (command) {
            command.cancel(() => {
                this._frozen = false;
            });
            this._list = [];
        }

    }

    execute() {
        if (this._frozen) {
            egret.setTimeout(this.execute, this, 100);
            return;
        }

        var command = this._list.shift();
        this.currentCommand = command;
        if (command) {
            console.log("执行下一命令", command)
            command.execute(() => {
                this.execute();
            })

        }
        else {
            console.log("全部命令执行完毕")
        }
    }

}