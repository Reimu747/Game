enum BlockType {

    notmove,
    upmove,
    downmove,
    leftmove,
    rightmove,


}

class Battle extends egret.DisplayObjectContainer {

    hero: Hero;
    heropos: Pos = new Pos(0, 5);
    enemy: Enemy;
    enemypos: Pos = new Pos(5, 0);
    battleinfo: egret.TextField = new egret.TextField();
    heroSkills: egret.Bitmap[] = [];
    heroSkillsinfo: egret.TextField[] = [];
    _block: egret.Bitmap[][] = [];
    _blockType: number[][] = [];
    _herobody: egret.Bitmap = new egret.Bitmap();
    _heroHP: egret.TextField = new egret.TextField();
    _heroMP: egret.TextField = new egret.TextField();

    _herobodyad: string;
    _enemybody: egret.Bitmap = new egret.Bitmap();
    _enemyHP: egret.TextField = new egret.TextField();
    _enemyMP: egret.TextField = new egret.TextField();
    _enemybodyad: string;
    _numCols: number;
    _numRows: number;


    chance: number = 0;  //该回合行动次数

    constructor(hero: Hero, level: number, enemyad: string, x: number, y: number) {

        super();

        var BattleMask = new egret.Shape();
        BattleMask.graphics.beginFill(0x000000, 1);
        BattleMask.graphics.drawRect(0, 0, 640, 1136);
        BattleMask.graphics.endFill();
        BattleMask.width = 640;
        BattleMask.height = 1136;
        this.addChild(BattleMask);

        this.hero = hero;
        this.enemy = setEnemy(level, enemyad);
        this._enemybody.texture = RES.getRes(this.enemy.bodyad);
        this.battleinfo.text = "战斗信息";
        this.battleinfo.size = 20;
        this.addChild(this.battleinfo);
        this.battleinfo.x = 100;
        this.battleinfo.y = 740;
        switch (hero.name) {
            case "三角":
                this._herobody.texture = RES.getRes("sanjiao_png");
                this._herobodyad = "sanjiao_png";
                break;

            case "方块":
                this._herobody.texture = RES.getRes("fangkuai_png");
                this._herobodyad = "fangkuai_png";
                break;

            case "正圆":
                this._herobody.texture = RES.getRes("zhengyuan_png");
                this._herobodyad = "zhengyuan_png";
                break;
        }



        this._numCols = x;
        this._numRows = y;
        for (var i = 0; i < this._numCols; i++) {
            this._block[i] = new Array();
            this._blockType[i] = new Array();
            for (var j = 0; j < this._numRows; j++) {
                let block = new egret.Bitmap();
                block['i'] = i;
                block['j'] = j;
                this._block[i][j] = block;
                this._block[i][j].width = TileMap.TILE_BATTLE_SIZE;
                this._block[i][j].height = TileMap.TILE_BATTLE_SIZE;
                this._block[i][j].texture = RES.getRes("block2_png");
                this._block[i][j].x = i * TileMap.TILE_BATTLE_SIZE + 80;
                this._block[i][j].y = j * TileMap.TILE_BATTLE_SIZE + 240;
                this.addChild(this._block[i][j]);
                this._block[i][j].touchEnabled = true;
                this._blockType[i][j] = BlockType.notmove;
                this._block[i][j].addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
                    console.log(e.target);
                    console.log(e.target.i, e.target.j);
                    this.heroTouchMove(e.target.i, e.target.j);
                }, this);
            }
        }

        for (i = 0; i < 5; i++) {
            this.heroSkills[i] = new egret.Bitmap();

        }

        for (i = 0; i < 5; i++) {
            this.heroSkillsinfo[i] = new egret.TextField();
        }
        this.upDateBattelMap();
        this.showSkills();
        this.showALLState();
        //console.log(this.hero);
        this.updateALLState();
        this.heroturn();
    }


    heroturn() {
        this.chance = 2;
        this.heroSkills[0].touchEnabled = true;
        this.heroSkills[1].touchEnabled = true;
        this.heroSkills[2].touchEnabled = true;
        this.heroSkills[3].touchEnabled = true;
        this.heroSkills[4].touchEnabled = true;
        //egret.setInterval(()=>{this.randommove(this.heropos)},this,2000);
        //egret.setInterval(() => { this.enemyturn() }, this, 3000);

        this.heroSkills[0].addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.heroattack(this.hero.skills[0]) }, this);
        this.heroSkills[1].addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.heroattack(this.hero.skills[1]) }, this);
        this.heroSkills[2].addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.herospecial(this.hero.skills[2]) }, this);
        this.heroSkills[3].addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.herobuff(this.hero.skills[3]) }, this);
        this.heroSkills[4].addEventListener(egret.TouchEvent.TOUCH_TAP, this.heromove, this);
        this.heroturnend();
    }

    heroturnend() {
      var turn = egret.setInterval(() => {

            if (this.chance = 0) {
                this.heroSkills[0].touchEnabled = false;
                this.heroSkills[1].touchEnabled = false;
                this.heroSkills[2].touchEnabled = false;
                this.heroSkills[3].touchEnabled = false;
                this.heroSkills[4].touchEnabled = false;
            }
             if (this.judgeEnemyDeath() == true||this.judgeHeroDeath() == true) {
                console.log("结束战斗");
                egret.clearInterval(turn);
            }
            else{
            this.enemyturn();
            }
        }, this, 1000);


    }

    upDateBattelMap() {

        for (var i = 0; i < this._numCols; i++) {
            for (var j = 0; j < this._numRows; j++) {
                //this._block[i][j].texture = RES.getRes("block2_png");
                switch (this._blockType[i][j]) {
                    case BlockType.notmove:
                        this._block[i][j].texture = RES.getRes("block2_png");
                        break;

                    case BlockType.upmove:
                        this._block[i][j].texture = RES.getRes("up_png");
                        break;

                    case BlockType.downmove:
                        this._block[i][j].texture = RES.getRes("down_png");
                        break;

                    case BlockType.leftmove:
                        this._block[i][j].texture = RES.getRes("left_png");
                        break;

                    case BlockType.rightmove:
                        this._block[i][j].texture = RES.getRes("right_png");
                        break;

                }

            }
        }

        for (var i = 0; i < this._numCols; i++) {
            for (var j = 0; j < this._numRows; j++) {

                if (i == this.enemypos.x && j == this.enemypos.y) {
                    this._block[i][j].texture = RES.getRes(this.enemy.bodyad);

                }

                if (i == this.heropos.x && j == this.heropos.y) {
                    this._block[i][j].texture = RES.getRes(this._herobodyad);
                }


            }
        }

    }

    showSkills() {
        for (var i = 0; i < 5; i++) {
            this.heroSkills[i].texture = RES.getRes(this.hero.skills[i].image);
            this.heroSkills[i].x = this.hero.skills[i].x - 40;
            this.heroSkills[i].y = this.hero.skills[i].y;
            this.addChild(this.heroSkills[i]);

            this.heroSkillsinfo[i].text = this.hero.skills[i].name + "\n" + this.hero.skills[i].inf + "\nMP消耗：" + this.hero.skills[i].MPneed;
            this.heroSkillsinfo[i].size = 18;
            this.heroSkillsinfo[i].x = this.hero.skills[i].x - 28;
            this.heroSkillsinfo[i].y = this.hero.skills[i].y + 20;
            this.addChild(this.heroSkillsinfo[i]);

        }

    }

    showALLState() {
        this._herobody.x = 20;
        this._herobody.y = 800;
        this._herobody.width = 150;
        this._herobody.height = 150;
        this._heroHP.text = "HP:";
        this._heroMP.text = "MP:";

        for (var i = 0; i < 25; i++) {
            this._heroHP.text += "|";
            this._heroMP.text += "-";
        }
        this._heroHP.x = 200;
        this._heroHP.y = 800;
        this._heroMP.x = 200;
        this._heroMP.y = 840;
        this.addChild(this._herobody);
        this.addChild(this._heroHP);
        this.addChild(this._heroMP);

        this._enemybody.x = 20;
        this._enemybody.y = 80;
        this._enemybody.width = 150;
        this._enemybody.height = 150;
        this._enemyHP.text = "HP:";
        this._enemyMP.text = "MP:";
        for (var i = 0; i < 25; i++) {
            this._enemyHP.text += "|";
            this._enemyMP.text += "-";
        }
        this._enemyHP.x = 200;
        this._enemyHP.y = 80;
        this._enemyMP.x = 200;
        this._enemyMP.y = 120;
        this.addChild(this._enemybody);
        this.addChild(this._enemyHP);
        this.addChild(this._enemyMP);
    }

    updateALLState() {
        var hptemp: number, mptemp: number;
        hptemp = Math.floor(this.hero.curHP.value / this.hero._maxHP.value * 25);
        mptemp = Math.floor(this.hero.curMP.value / this.hero._maxMP.value * 25);
        this._heroHP.textAlign = "justify";
        this._heroMP.textAlign = "justify";
        // this._heroMP.textAlign = egret.HorizontalAlign.CENTER;
        this._heroHP.text = "HP:" + this.hero.curHP.value + "/" + this.hero._maxHP.value + " ";
        this._heroMP.text = "MP:" + this.hero.curMP.value + "/" + this.hero._maxMP.value + " ";;
        for (var i = 0; i < 25; i++) {
            if (i < hptemp) {
                this._heroHP.text += "|";
            }
            else {
                this._heroHP.text += ".";
            }
        }
        for (var j = 0; j < 25; j++) {
            if (j < mptemp) {
                this._heroMP.text += "-";
            }
            else {
                this._heroMP.text += ".";
            }
        }

        hptemp = Math.floor(this.enemy.curHP.value / this.enemy._maxHP.value * 25);
        mptemp = Math.floor(this.enemy.curMP.value / this.enemy._maxMP.value * 25);
        this._enemyHP.text = "HP:" + this.enemy.curHP.value + "/" + this.enemy._maxHP.value + " ";
        this._enemyMP.text = "MP:" + this.enemy.curMP.value + "/" + this.enemy._maxMP.value + " ";
        for (i = 0; i < 25; i++) {
            if (i < hptemp) {
                this._enemyHP.text += "|";
            }
            else {
                this._enemyHP.text += ".";
            }
        }
        for (j = 0; j < 25; j++) {
            if (j < mptemp) {
                this._enemyMP.text += "-";
            }
            else {
                this._enemyMP.text += ".";
            }
        }

    }



    heroTouchMove(i: number, j: number) {

        switch (this._blockType[i][j]) {
            case BlockType.notmove:
                console.log("not move", i, j);
                break;

            case BlockType.upmove:
                this.heropos.y--;
                //this.upDateBattelMap();
                if (this.hero.name == "三角") {
                    this.hero.curMP.value += 10;
                    if (this.hero.curMP.value > 100) {
                        this.hero.curMP.value = 100;
                    }
                    this.updateALLState();
                }
                break;

            case BlockType.downmove:
                this.heropos.y++;
                //this.upDateBattelMap();
                if (this.hero.name == "三角") {
                    this.hero.curMP.value += 10;
                    if (this.hero.curMP.value > 100) {
                        this.hero.curMP.value = 100;
                    }
                    this.updateALLState();
                }
                break;

            case BlockType.rightmove:
                this.heropos.x++;
                //this.upDateBattelMap();

                if (this.hero.name == "三角") {
                    this.hero.curMP.value += 10;
                    if (this.hero.curMP.value > 100) {
                        this.hero.curMP.value = 100;
                    }
                    this.updateALLState();
                }
                break;

            case BlockType.leftmove:
                this.heropos.x--;
                //this.upDateBattelMap();

                if (this.hero.name == "三角") {
                    this.hero.curMP.value += 10;
                    if (this.hero.curMP.value > 100) {
                        this.hero.curMP.value = 100;
                    }
                    this.updateALLState();
                }
                break;

        }

        for (var a = 0; a < this._numCols; a++) {
            for (var b = 0; b < this._numRows; b++) {
                this._blockType[a][b] = BlockType.notmove;
            }
        }
        this.upDateBattelMap();
        //this._block[i][j].touchEnabled = false;
    }



    heromove() {

        if (this.heropos.x + 1 < this._numCols) {

            // let rightBlock = this._block[this.heropos.x + 1][this.heropos.y];
            // rightBlock.texture = RES.getRes("right_png");
            this._blockType[this.heropos.x + 1][this.heropos.y] = BlockType.rightmove;

        }

        if (this.heropos.x - 1 >= 0) {
            // let leftBlock = this._block[this.heropos.x - 1][this.heropos.y];
            // leftBlock.texture = RES.getRes("left_png");
            this._blockType[this.heropos.x - 1][this.heropos.y] = BlockType.leftmove;

        }

        if (this.heropos.y + 1 < this._numRows) {
            // let downBlock = this._block[this.heropos.x][this.heropos.y + 1];
            // downBlock.texture = RES.getRes("down_png");
            this._blockType[this.heropos.x][this.heropos.y + 1] = BlockType.downmove;

        }


        if (this.heropos.y - 1 >= 0) {
            // let upBlock = this._block[this.heropos.x][this.heropos.y - 1];
            // upBlock.texture = RES.getRes("up_png");
            this._blockType[this.heropos.x][this.heropos.y - 1] = BlockType.upmove;

        }
        this.upDateBattelMap();
        //console.log(this.heropos);
    }

    judgeDistance(skill: SkillData): boolean {
        if (Math.abs(this.heropos.x - this.enemypos.x) +
            Math.abs(this.heropos.y - this.enemypos.y)
            <= skill.distance) {
            return true;
        }
        else {
            return false;
        }
    }


    judgeHeroDeath(): boolean {
        if (this.hero.curHP.value <= 0)
            return true;
        else
            return false;
    }

    judgeEnemyDeath(): boolean {
        if (this.enemy.curHP.value <= 0)
            return true;
        else
            return false;
    }


    randommove(pos: Pos) {
        switch (Math.floor(Math.random() * 100) % 4) {
            case 0:
                if (pos.x + 1 < this._numCols) {
                    pos.x++;
                }
                else {
                    pos.x--;
                }
                break;

            case 1:
                if (pos.y + 1 < this._numCols) {
                    pos.y++;
                }
                else {
                    pos.y--;
                }
                break;

            case 2:
                if (pos.x - 1 >= 0) {
                    pos.x--;
                }
                else {
                    pos.x++;
                }
                break;

            case 3:
                if (pos.y - 1 >= 0) {
                    pos.y--;
                }
                else {
                    pos.y++;
                }
                break;
        }
        this.upDateBattelMap();
    }


    heroattack(skill: SkillData) {

        var temp = 0;
        if (this.judgeDistance(skill) == true && this.hero.curMP.value >= skill.MPneed) {
            temp = skill.ratio * this.hero._ATK.value / 100 - Math.floor(Math.random() * 5);
            this.hero.curMP.value -= skill.MPneed;
            this.enemy.curHP.value -= temp;
            this.battleinfo.text = this.hero.name + skill.name + "对" + this.enemy.name + "造成" + temp + "点伤害";
            this.chance--;
        }
        else {
            this.battleinfo.text = "MP不足或者技能释放范围不够";
        }
        this.updateALLState();
    }

    herobuff(skill: SkillData) {

        if (this.hero.curMP.value >= skill.MPneed) {
            this.chance--;
            this.hero.curMP.value -= skill.MPneed;
            if(this.hero.curMP.value>this.hero._maxMP.value){
                this.hero.curMP.value = this.hero._maxMP.value;
            }
            switch (skill.type) {

                case SkillType.speedbuff:
                    this.chance += 2;
                    break;

                case SkillType.atkbuff:
                    this.hero._ATK.value = skill.ratio / 100 * this.hero._ATK.value;
                    break;

                case SkillType.HPbuff:
                    this.hero.curHP.value = skill.ratio / 100 * this.hero.curHP.value;
            }
        }
        else {
            this.battleinfo.text = "MP不足";
        }
    }

    herospecial(skill: SkillData) {
        switch (skill.type) {
            case SkillType.roll:
                break;
            case SkillType.jump:
                break;
        }
    }

    enemyattack() {
        var skill = this.enemy.skills[0];
        var temp = 0;
        if (this.judgeDistance(skill) == true) {
            temp = skill.ratio * this.enemy._ATK.value / 100 - Math.floor(Math.random() * 5);
            this.hero.curHP.value -= temp;
            this.enemy.curMP.value -= skill.MPneed;
            this.battleinfo.text = this.enemy.name + skill.name + "对" + this.hero.name + "造成" + temp + "点伤害";
        }
        this.updateALLState();
    }

    enemyturn() {
        this.randommove(this.enemypos);
        egret.setTimeout(() => {
            this.enemyattack();
        }, this, 1500);
    }
}

class Pos {

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}


class Enemy extends Hero {

    bodyad: string;

    constructor(name: string, ad: string, str: number, con: number, dex: number, mag: number, spd: number, quality: number) {

        super(name, str, con, dex, mag, spd, quality);
        this.bodyad = ad;

    }
}

function setEnemy(level: number, ad: string): Enemy {


    var enemy = new Enemy("不规则几何体", ad, 46 + level * 12 + Math.floor(Math.random() * 6), 80 + level * 2 + Math.floor(Math.random() * 8), 0, 2, 2, 0);
    enemy.skills = [
        { x: 30, y: 900, name: "<不规则攻击>", image: "", inf: "杂鱼也能打败纯形英雄", ratio: 100, MPneed: 0, distance: 3, type: 0, num: 4 },
        { x: 160, y: 900, name: "<不规则移动>", image: "", inf: "上下左右一格的范围", ratio: 0, MPneed: 0, distance: 1, type: 4, num: 4 },
    ]

    return enemy;
}







//  herorightmove() {

//         // if (this.heropos.x + 1 < this._numCols) {
//         //     this._block[this.heropos.x + 1][this.heropos.y].touchEnabled = false;
//         // }
//         // if (this.heropos.x - 1 >= 0) {
//         //     this._block[this.heropos.x - 1][this.heropos.y].touchEnabled = false;
//         // }
//         // if (this.heropos.y + 1 < this._numRows) {
//         //     this._block[this.heropos.x][this.heropos.y + 1].touchEnabled = false;
//         // }
//         // if (this.heropos.y - 1 >= 0) {
//         //     this._block[this.heropos.x][this.heropos.y - 1].touchEnabled = false;
//         // }

//         for (var i = 0; i < this._numCols; i++) {
//             for (var j = 0; j < this._numRows; j++) {
//                 this._block[i][j].touchEnabled = false;
//             }
//         }

//         this.heropos.x++;
//         this.upDateBattelMap();

//         if (this.hero.name == "三角") {
//             this.hero.curMP.value += 10;
//             if (this.hero.curMP.value > 100) {
//                 this.hero.curMP.value = 100;
//             }
//             this.updateALLState();
//         }
//     }

//     heroleftmove() {

//         for (var i = 0; i < this._numCols; i++) {
//             for (var j = 0; j < this._numRows; j++) {
//                 this._block[i][j].touchEnabled = false;
//             }
//         }
//         this.heropos.x--
//         this.upDateBattelMap();


//         if (this.hero.name == "三角") {
//             this.hero.curMP.value += 10;
//             if (this.hero.curMP.value > 100) {
//                 this.hero.curMP.value = 100;
//             }
//             this.updateALLState();
//         }

//     }

//     heroupmove() {
//         for (var i = 0; i < this._numCols; i++) {
//             for (var j = 0; j < this._numRows; j++) {
//                 this._block[i][j].touchEnabled = false;
//             }
//         }

//         this.heropos.y--;
//         this.upDateBattelMap();


//         if (this.hero.name == "三角") {
//             this.hero.curMP.value += 10;
//             if (this.hero.curMP.value > 100) {
//                 this.hero.curMP.value = 100;
//             }
//             this.updateALLState();
//         }

//     }

//     herodownmove() {

//         for (var i = 0; i < this._numCols; i++) {
//             for (var j = 0; j < this._numRows; j++) {
//                 this._block[i][j].touchEnabled = false;
//             }
//         }

//         this.heropos.y++;
//         this.upDateBattelMap();

//         if (this.hero.name == "三角") {
//             this.hero.curMP.value += 10;
//             if (this.hero.curMP.value > 100) {
//                 this.hero.curMP.value = 100;
//             }
//             this.updateALLState();
//         }
//     }