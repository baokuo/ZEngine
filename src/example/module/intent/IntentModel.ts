/**
 *
 * @author bk
 *
 */
class IntentModel extends BaseModel {
    public Info: any;
    public ExtendInfo :any;
    
    
    
    
    /**
     * 构造函数
     * @param $controller 所属模块
     */
    public constructor($controller: BaseController) {
        super($controller);
        this.Info ={};
        this.ExtendInfo = {};
    }
}