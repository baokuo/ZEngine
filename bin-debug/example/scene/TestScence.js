/**
 *
 * @author
 *
 */
var TestScence = (function (_super) {
    __extends(TestScence, _super);
    function TestScence() {
        _super.call(this);
    }
    var d = __define,c=TestScence,p=c.prototype;
    /**
    * 进入Scene调用
    */
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.addLayerAt(LayerManager.UI_Main, 0);
        this.addLayerAt(LayerManager.UI_Popup, 1);
        //添加一个纯色背景
        var rect = new eui.Rect();
        rect.fillColor = 0x79b96f;
        rect.percentHeight = 100;
        rect.percentWidth = 100;
        LayerManager.UI_Main.addChild(rect);
        App.ViewManager.open(ViewConst.Friend);
    };
    /**
     * 退出Scene调用
     */
    p.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return TestScence;
}(BaseScene));
egret.registerClass(TestScence,'TestScence');
