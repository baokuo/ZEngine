/**
 * Created by yangsong on 2014/11/22.
 * Proxy基类
 */
class BaseProxy {
    private _controller:BaseController;

    /**
     * 构造函数
     * @param $controller 所属模块
     */
    public constructor($controller:BaseController) {
        this._controller = $controller;
    }

    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 参数
     *
     */
    public applyFunc(key:any, ...param:any[]):any {
        return this._controller.applyFunc.apply(this._controller, arguments);
    }

    /**
     * 触发其他模块消息
     * @param controllerKey 模块标识
     * @param key 唯一标识
     * @param param 所需参数
     *
     */
    public applyControllerFunc(controllerKey:number, key:any, ...param:any[]):any {
        return this._controller.applyControllerFunc.apply(this._controller, arguments);
    }

    /**
     * 注册从服务器返回消息的监听
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    public receiveServerMsg(key:any, callbackFunc:Function, callbackObj:any):void {
        App.MessageCenter.addListener(key, callbackFunc, callbackObj);
    }

    /**
     * 注册从服务器返回消息的监听，仅一次，执行完成后删除
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    public receiveServerMsgOnce(key:any, callbackFunc:Function, callbackObj:any):void {
        var callback:Function = function(param:any):void {
            this.removeServerMsg(key, callback, this);
            callbackFunc.apply(callbackObj, param);
        }
        this.receiveServerMsg(key, callback, this);
    }

    /**
     * 注册从Http服务端返回的Update消息
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    public receiveServerHttpUpdateMsg(key:any, callbackFunc:Function, callbackObj:any):void {
        this.receiveServerMsg(key + "_HttpUpdate", callbackFunc, callbackObj);
    }

    /**
     * 注册从Http服务端返回的Update消息，仅一次，执行完成后删除
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    public receiveServerHttpUpdateMsgOnce(key:any, callbackFunc:Function, callbackObj:any):void {
        this.receiveServerMsgOnce(key + "_HttpUpdate", callbackFunc, callbackObj);
    }

    /**
     * 移除服务端返回消息的监听
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    public removeServerMsg(key:any, callbackFunc:Function, callbackObj:any):void {
        App.MessageCenter.removeListener(key, callbackFunc, callbackObj);
    }

    /**
     * 移除从Http服务端返回的Update消息
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    public removeServerHttpUpdateMsg(key:any, callbackFunc:Function, callbackObj:any):void {
        this.removeServerMsg(key + "_HttpUpdate", callbackFunc, callbackObj);
    }

    /**
     * 发送消息到Socket服务器
     */
    public sendSocketMsg(msg:any):void {
        App.Socket.send(msg);
    }

    /**
     * 发送消息到Http服务端
     * @param type 消息标识 例如: User.login
     * @param paramObj 消息参数 例如: var paramObj:any = {"uName":uName, "uPass":uPass};
     */
    public sendHttpMsg(type:string, paramObj:any = null):void {
        App.Http.send(type, this.getURLVariables(type, paramObj));
    }
    public sendHttpMsgByGetMethod(type: string,paramObj: any = null): void {
        App.HttpGET.send(type,this.getURLVariablesGet(type,paramObj));
    }
    public sendHttpRequestGet(type: string,paramObj: any = null): void {
        App.HttpRequestGet.send(type,this.getURLVariablesGet(type,paramObj));
    }
    public sendHttpRequestPost(type: string,paramObj: any = null): void {
        App.HttpRequestPost.send(type,this.getTextVariables(type,paramObj));
    }
    /////////
    public sendHttpRequest(type: string,paramObj: any = null,_reqtype): void {
        App.HttpRequest.send(type,this.getVariables(type,paramObj,_reqtype),_reqtype);
    }
    
    
    private getVariables(t_type: string,t_paramObj: any,_reqtype:number): String {

        if(_reqtype==HttpMethod.MethodGET)
        {
            var str: String = "";
            var len: number = t_paramObj.length;
            for(var x: number = 0;x < len;x++) {
                str += "&" + t_paramObj[x];
            }
            str = str.substring(1,str.length);
            str = "/" + str;
            return str;
        }
        else if(_reqtype == HttpMethod.MethodPOST)
        {
            //上面那一段需要在实际自定义改造
            if(t_type != null && t_type.length > 0) {
                var typeArr: Array<any> = t_type.split(".");
                var paramObj: any = {};
                paramObj["mod"] = typeArr[0];
                paramObj["do"] = typeArr[1];
                if(t_paramObj != null) {
                    paramObj["message"] = t_paramObj;
                }
                var param: string = JSON.stringify(paramObj);
            }
            var returnStr = "data=" + param + "&h=" + App.ProxyUserFlag;
            return returnStr;
        }
        else
        {
            return "";
        }
        

       
    }
    
    
    
    /**
     * 将参数转换为URLVariables
     * @param t_type
     * @param t_paramObj
     * @returns {egret.URLVariables}
     * data:"{"mod":"User","do":"login","p",{"uname":"yangsong","upass","123456"}}"
     */
    private getTextVariables(t_type:string, t_paramObj:any):String {
        
        
        //上面那一段需要在实际自定义改造
        if(t_type !=null && t_type.length>0){
            var typeArr:Array<any> = t_type.split(".");
            var paramObj:any = {};
            paramObj["mod"] = typeArr[0];
            paramObj["do"] = typeArr[1];
            if (t_paramObj != null) {
                paramObj["message"] = t_paramObj;
            }
            var param:string = JSON.stringify(paramObj);
        }
        var returnStr = "data=" + param + "&h=" + App.ProxyUserFlag;
        return returnStr;
    }
    private getURLVariables(t_type: string,t_paramObj: any): egret.URLVariables {


        //上面那一段需要在实际自定义改造
        if(t_type != null && t_type.length > 0) {
            var typeArr: Array<any> = t_type.split(".");
            var paramObj: any = {};
            paramObj["mod"] = typeArr[0];
            paramObj["do"] = typeArr[1];
            if(t_paramObj != null) {
                paramObj["message"] = t_paramObj;
            }
            var param: string = JSON.stringify(paramObj);
        }
        var variables: egret.URLVariables = new egret.URLVariables("data=" +  param + "&h=" + App.ProxyUserFlag);
        //var variables: egret.URLVariables = new egret.URLVariables("test=ok");// post test = ok
        return variables;
    }
    
    
    
    
    
    
    
    
    
    
    private getURLVariablesGet(t_type: string,t_paramObj: Array<string>): any {

        
        var str: String = "";
        var len: number = t_paramObj.length;
        for(var x: number = 0;x < len;x++)
        {
            str += "&" + t_paramObj[x]; 
        }
        str = str.substring(1,str.length);
        str="/" + str;
        
        
        
        return str;
  
//        //上面那一段需要在实际自定义改造
//        if(t_type != null && t_type.length > 0) {
//            var typeArr: Array<any> = t_type.split(".");
//            var paramObj: any = {};
//            paramObj["mod"] = typeArr[0];
//            paramObj["do"] = typeArr[1];
//            if(t_paramObj != null) {
//                paramObj["message"] = t_paramObj;
//            }
//            var param: string = JSON.stringify(paramObj);
//        }
//        var variables: egret.URLVariables = new egret.URLVariables("data=" + param + "&h=" + App.ProxyUserFlag);
//        //var variables: egret.URLVariables = new egret.URLVariables("test=ok");// post test = ok
//        return variables;
    }
    
    
    
    
    
    
    
    
    
}
