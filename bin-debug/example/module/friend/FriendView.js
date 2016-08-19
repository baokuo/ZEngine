/**
 * Created by egret on 15-1-7.
 */
var FriendView = (function (_super) {
    __extends(FriendView, _super);
    function FriendView(controller, parent) {
        _super.call(this, controller, parent);
        this.icon = "table_tittle";
        this.sub = ["preload_battle"];
        this.setResources(this.sub);
    }
    var d = __define,c=FriendView,p=c.prototype;
    p.setResources = function (resources) {
        _super.prototype.setResources.call(this, resources);
    };
    p.initData = function () {
        _super.prototype.initData.call(this);
    };
    p.initUI = function () {
        _super.prototype.initUI.call(this);
        _super.prototype.clearResource.call(this);
    };
    return FriendView;
}(BasePanelView2));
egret.registerClass(FriendView,'FriendView');
