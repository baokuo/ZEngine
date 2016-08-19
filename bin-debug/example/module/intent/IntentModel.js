/**
 *
 * @author bk
 *
 */
var IntentModel = (function (_super) {
    __extends(IntentModel, _super);
    /**
     * 构造函数
     * @param $controller 所属模块
     */
    function IntentModel($controller) {
        _super.call(this, $controller);
        this.Info = {};
        this.ExtendInfo = {};
    }
    var d = __define,c=IntentModel,p=c.prototype;
    return IntentModel;
}(BaseModel));
egret.registerClass(IntentModel,'IntentModel');
