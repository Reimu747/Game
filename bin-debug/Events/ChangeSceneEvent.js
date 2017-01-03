/**
 * Created by xiashishi on 15/9/24.
 */
var ChangeSceneEvent = (function (_super) {
    __extends(ChangeSceneEvent, _super);
    function ChangeSceneEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        _super.call(this, type, bubbles, cancelable);
    }
    var d = __define,c=ChangeSceneEvent,p=c.prototype;
    ChangeSceneEvent.CHANGE_SCENE_EVENT = "changesceneevent";
    return ChangeSceneEvent;
}(egret.Event));
egret.registerClass(ChangeSceneEvent,'ChangeSceneEvent');
//# sourceMappingURL=ChangeSceneEvent.js.map