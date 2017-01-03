var WalkCommand = (function () {
    function WalkCommand(x, y) {
        this.x = x;
        this.y = y;
    }
    var d = __define,c=WalkCommand,p=c.prototype;
    p.execute = function (callback) {
        GameScene.getCurrentScene().moveTo(this.x, this.y, function () {
            callback();
        });
    };
    p.cancel = function (callback) {
        GameScene.getCurrentScene().stopMove(function () {
            callback();
        });
    };
    return WalkCommand;
}());
egret.registerClass(WalkCommand,'WalkCommand',["Command"]);
var FightCommand = (function () {
    function FightCommand(ad) {
        this._hasBeenCancelled = false;
        this.enemyad = ad;
    }
    var d = __define,c=FightCommand,p=c.prototype;
    p.execute = function (callback) {
        console.log("开始战斗");
        console.log(UIScene.getCurrentScene().hero);
        var battle = new Battle(UIScene.getCurrentScene().hero, 1, this.enemyad, 6, 6);
        if (GameScene.getCurrentScene().main.$children.length != 0) {
            GameScene.getCurrentScene().main.removeChildren();
        }
        GameScene.getCurrentScene().main.addChild(battle);
        // egret.setTimeout(() => {
        //  if (!this._hasBeenCancelled) {
        //     console.log("结束战斗")
        //     callback();
        // }
        //     }, this, 500)
        var batteEnd = egret.setInterval(function () {
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
    };
    p.cancel = function (callback) {
        console.log("脱离战斗");
        this._hasBeenCancelled = true;
        egret.setTimeout(function () {
            callback();
        }, this, 100);
    };
    return FightCommand;
}());
egret.registerClass(FightCommand,'FightCommand',["Command"]);
var TalkCommand = (function () {
    function TalkCommand(npcad) {
        this.npcid = npcad;
    }
    var d = __define,c=TalkCommand,p=c.prototype;
    p.execute = function (callback) {
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
    };
    p.cancel = function (callback) {
        if (this.npcid == "NPC_1") {
            UIScene.getCurrentScene().dp1.disshowDpanel();
        }
        if (this.npcid == "NPC_2") {
            UIScene.getCurrentScene().dp2.disshowDpanel();
        }
        console.log("关闭对话框");
        callback();
    };
    return TalkCommand;
}());
egret.registerClass(TalkCommand,'TalkCommand',["Command"]);
var EquipCommand = (function () {
    function EquipCommand(name, ad, atk) {
        this.name = name;
        this.ad = ad;
        this.atk = atk;
    }
    var d = __define,c=EquipCommand,p=c.prototype;
    p.execute = function (callback) {
        var ruen_1 = [new rune(2), new rune(3)];
        this.item = new Equipment(this.name, this.ad, 1, this.atk, ruen_1);
        UIScene.getCurrentScene().hero.equip(this.item);
        GameScene.getCurrentScene().main.removeChild(UIScene.getCurrentScene().item);
        callback();
    };
    p.cancel = function (callback) {
        callback();
    };
    return EquipCommand;
}());
egret.registerClass(EquipCommand,'EquipCommand',["Command"]);
var CommandList = (function () {
    function CommandList() {
        this._list = [];
        this._frozen = false;
    }
    var d = __define,c=CommandList,p=c.prototype;
    p.addCommand = function (command) {
        this._list.push(command);
    };
    p.cancel = function () {
        var _this = this;
        this._frozen = true;
        var command = this.currentCommand;
        egret.setTimeout(function () {
            if (_this._frozen) {
                _this._frozen = false;
            }
        }, this, 100);
        if (command) {
            command.cancel(function () {
                _this._frozen = false;
            });
            this._list = [];
        }
    };
    p.execute = function () {
        var _this = this;
        if (this._frozen) {
            egret.setTimeout(this.execute, this, 100);
            return;
        }
        var command = this._list.shift();
        this.currentCommand = command;
        if (command) {
            console.log("执行下一命令", command);
            command.execute(function () {
                _this.execute();
            });
        }
        else {
            console.log("全部命令执行完毕");
        }
    };
    return CommandList;
}());
egret.registerClass(CommandList,'CommandList');
//# sourceMappingURL=Command.js.map