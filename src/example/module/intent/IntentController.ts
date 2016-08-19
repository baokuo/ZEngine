/**
 * Created bk
 */
class IntentController extends BaseController {
    
    private _intentModel: IntentModel;

    public constructor() {
        super();
        //初始化Model
        this._intentModel = new IntentModel(this);
      
    }
    
    public popIntent() :void
    {
        this._intentModel=null;
    }
    
    public PutExtraString(_stringKey : string,_stringValue : String) :void{
//        var paramObj: any = {
//            "_stringKey": _stringValue
//        };
        this._intentModel.ExtendInfo[_stringKey] = _stringValue;
    }
    
    public GetExtraString(_stringKey:string) : String
    {
        return this._intentModel.ExtendInfo[_stringKey];
    }
    
    public PutExtraList(_stringKey: string,_listValue: Array<number>): void {
  
        this._intentModel.ExtendInfo[_stringKey] = _listValue;
    }
    public GetExtraList(_stringKey: string): Array<number> {
        return this._intentModel.ExtendInfo[_stringKey];
    }
    
    
    
    
    
}
