/**
 * Created bk
 */
var IntentController = (function (_super) {
    __extends(IntentController, _super);
    function IntentController() {
        _super.call(this);
        //初始化Model
        this._intentModel = new IntentModel(this);
    }
    var d = __define,c=IntentController,p=c.prototype;
    p.popIntent = function () {
        this._intentModel = null;
    };
    p.PutExtraString = function (_stringKey, _stringValue) {
        //        var paramObj: any = {
        //            "_stringKey": _stringValue
        //        };
        this._intentModel.ExtendInfo[_stringKey] = _stringValue;
    };
    p.GetExtraString = function (_stringKey) {
        return this._intentModel.ExtendInfo[_stringKey];
    };
    p.PutExtraList = function (_stringKey, _listValue) {
        this._intentModel.ExtendInfo[_stringKey] = _listValue;
    };
    p.GetExtraList = function (_stringKey) {
        return this._intentModel.ExtendInfo[_stringKey];
    };
    return IntentController;
}(BaseController));
egret.registerClass(IntentController,'IntentController');
