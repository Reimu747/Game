var Player = (function (_super) {
    __extends(Player, _super);
    function Player(ad) {
        _super.call(this);
        this._i = 0;
        this._ad = ad;
        this._body = new egret.Bitmap();
        this._body.texture = RES.getRes(ad);
        this.addChild(this._body);
        this._body.width = TileMap.TILE_SIZE;
        this._body.height = TileMap.TILE_SIZE;
        // this._body.anchorOffsetX = this._body.width / 2;
        // this._body.anchorOffsetY = this._body.height / 2;
        this._stateMachine = new StateMachine();
        // this._body.x = TileMap.TILE_SIZE/2;
        // this._body.y = TileMap.TILE_SIZE/2;
        this._ifidle = true;
        this._ifwalk = false;
    }
    var d = __define,c=Player,p=c.prototype;
    p.move = function (targetX, targetY) {
        if (targetX > this._body.x) {
            this._body.skewY = 180;
        }
        else {
            this._body.skewY = 0;
        }
        this._stateMachine.setState(new PlayerMoveState(this));
    };
    p.behurt = function () {
    };
    p.attack = function () {
    };
    p.idle = function () {
        this._stateMachine.setState(new PlayerIdleState(this));
    };
    p.startWalk = function () {
        var _this = this;
        var list = [this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad];
        var count = -1;
        egret.Ticker.getInstance().register(function () {
            count = count + 0.2;
            if (count >= list.length) {
                count = 0;
            }
            _this._body.texture = RES.getRes(list[Math.floor(count)]);
        }, this);
        //egret.Tween.get(walk).to({ x: targetX, y: targetY }, 300, egret.Ease.sineIn);
        // var tw = egret.Tween.get(walk);
        // tw.wait(200);
        // tw.call(change, self);
    };
    p.startidle = function () {
        var _this = this;
        var list = [this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad];
        var count = -1;
        egret.Ticker.getInstance().register(function () {
            count = count + 0.2;
            if (count >= list.length) {
                count = 0;
            }
            _this._body.texture = RES.getRes(list[Math.floor(count)]);
        }, this);
    };
    return Player;
}(egret.DisplayObjectContainer));
egret.registerClass(Player,'Player');
var PlayerState = (function () {
    function PlayerState(player) {
        this._player = player;
    }
    var d = __define,c=PlayerState,p=c.prototype;
    p.onEnter = function () { };
    p.onExit = function () { };
    return PlayerState;
}());
egret.registerClass(PlayerState,'PlayerState',["State"]);
var PlayerMoveState = (function (_super) {
    __extends(PlayerMoveState, _super);
    function PlayerMoveState() {
        _super.apply(this, arguments);
    }
    var d = __define,c=PlayerMoveState,p=c.prototype;
    p.onEnter = function () {
        // egret.setTimeout(() => {
        //     this._player.move;
        // }, this, 500)
        this._player._ifwalk = true;
        this._player.startWalk();
    };
    p.onExit = function () {
        this._player._ifwalk = false;
    };
    return PlayerMoveState;
}(PlayerState));
egret.registerClass(PlayerMoveState,'PlayerMoveState');
var PlayerIdleState = (function (_super) {
    __extends(PlayerIdleState, _super);
    function PlayerIdleState() {
        _super.apply(this, arguments);
    }
    var d = __define,c=PlayerIdleState,p=c.prototype;
    p.onEnter = function () {
        // this._player._label.text = "idle";
        // egret.setTimeout(() => {
        //     this._player.idle();
        // }, this, 500)
        this._player._ifidle = true;
        this._player.startidle();
    };
    p.onExit = function () {
        this._player._ifidle = false;
    };
    return PlayerIdleState;
}(PlayerState));
egret.registerClass(PlayerIdleState,'PlayerIdleState');
var StateMachine = (function () {
    function StateMachine() {
    }
    var d = __define,c=StateMachine,p=c.prototype;
    p.setState = function (e) {
        if (this.CurrentState != null) {
            this.CurrentState.onExit();
        }
        this.CurrentState = e;
        e.onEnter();
    };
    return StateMachine;
}());
egret.registerClass(StateMachine,'StateMachine');
//# sourceMappingURL=Player.js.map