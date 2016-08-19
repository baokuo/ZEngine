/**
 * Created by yangsong on 2014/11/22.
 * Proxy基类
 */
var BaseProxy = (function () {
    /**
     * 构造函数
     * @param $controller 所属模块
     */
    function BaseProxy($controller) {
        this._controller = $controller;
    }
    var d = __define,c=BaseProxy,p=c.prototype;
    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 参数
     *
     */
    p.applyFunc = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        return this._controller.applyFunc.apply(this._controller, arguments);
    };
    /**
     * 触发其他模块消息
     * @param controllerKey 模块标识
     * @param key 唯一标识
     * @param param 所需参数
     *
     */
    p.applyControllerFunc = function (controllerKey, key) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        return this._controller.applyControllerFunc.apply(this._controller, arguments);
    };
    /**
     * 注册从服务器返回消息的监听
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    p.receiveServerMsg = function (key, callbackFunc, callbackObj) {
        App.MessageCenter.addListener(key, callbackFunc, callbackObj);
    };
    /**
     * 注册从服务器返回消息的监听，仅一次，执行完成后删除
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    p.receiveServerMsgOnce = function (key, callbackFunc, callbackObj) {
        var callback = function (param) {
            this.removeServerMsg(key, callback, this);
            callbackFunc.apply(callbackObj, param);
        };
        this.receiveServerMsg(key, callback, this);
    };
    /**
     * 注册从Http服务端返回的Update消息
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    p.receiveServerHttpUpdateMsg = function (key, callbackFunc, callbackObj) {
        this.receiveServerMsg(key + "_HttpUpdate", callbackFunc, callbackObj);
    };
    /**
     * 注册从Http服务端返回的Update消息，仅一次，执行完成后删除
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    p.receiveServerHttpUpdateMsgOnce = function (key, callbackFunc, callbackObj) {
        this.receiveServerMsgOnce(key + "_HttpUpdate", callbackFunc, callbackObj);
    };
    /**
     * 移除服务端返回消息的监听
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    p.removeServerMsg = function (key, callbackFunc, callbackObj) {
        App.MessageCenter.removeListener(key, callbackFunc, callbackObj);
    };
    /**
     * 移除从Http服务端返回的Update消息
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    p.removeServerHttpUpdateMsg = function (key, callbackFunc, callbackObj) {
        this.removeServerMsg(key + "_HttpUpdate", callbackFunc, callbackObj);
    };
    /**
     * 发送消息到Socket服务器
     */
    p.sendSocketMsg = function (msg) {
        App.Socket.send(msg);
    };
    /**
     * 发送消息到Http服务端
     * @param type 消息标识 例如: User.login
     * @param paramObj 消息参数 例如: var paramObj:any = {"uName":uName, "uPass":uPass};
     */
    p.sendHttpMsg = function (type, paramObj) {
        if (paramObj === void 0) { paramObj = null; }
        App.Http.send(type, this.getURLVariables(type, paramObj));
    };
    p.sendHttpMsgByGetMethod = function (type, paramObj) {
        if (paramObj === void 0) { paramObj = null; }
        App.HttpGET.send(type, this.getURLVariablesGet(type, paramObj));
    };
    p.sendHttpRequestGet = function (type, paramObj) {
        if (paramObj === void 0) { paramObj = null; }
        App.HttpRequestGet.send(type, this.getURLVariablesGet(type, paramObj));
    };
    p.sendHttpRequestPost = function (type, paramObj) {
        if (paramObj === void 0) { paramObj = null; }
        App.HttpRequestPost.send(type, this.getTextVariables(type, paramObj));
    };
    /////////
    p.sendHttpRequest = function (type, paramObj, _reqtype) {
        if (paramObj === void 0) { paramObj = null; }
        App.HttpRequest.send(type, this.getVariables(type, paramObj, _reqtype), _reqtype);
    };
    p.getVariables = function (t_type, t_paramObj, _reqtype) {
        if (_reqtype == HttpMethod.MethodGET) {
            var str = "";
            var len = t_paramObj.length;
            for (var x = 0; x < len; x++) {
                str += "&" + t_paramObj[x];
            }
            str = str.substring(1, str.length);
            str = "/" + str;
            return str;
        }
        else if (_reqtype == HttpMethod.MethodPOST) {
            //上面那一段需要在实际自定义改造
            if (t_type != null && t_type.length > 0) {
                var typeArr = t_type.split(".");
                var paramObj = {};
                paramObj["mod"] = typeArr[0];
                paramObj["do"] = typeArr[1];
                if (t_paramObj != null) {
                    paramObj["message"] = t_paramObj;
                }
                var param = JSON.stringify(paramObj);
            }
            var returnStr = "data=" + param + "&h=" + App.ProxyUserFlag;
            return returnStr;
        }
        else {
            return "";
        }
    };
    /**
     * 将参数转换为URLVariables
     * @param t_type
     * @param t_paramObj
     * @returns {egret.URLVariables}
     * data:"{"mod":"User","do":"login","p",{"uname":"yangsong","upass","123456"}}"
     */
    p.getTextVariables = function (t_type, t_paramObj) {
        //上面那一段需要在实际自定义改造
        if (t_type != null && t_type.length > 0) {
            var typeArr = t_type.split(".");
            var paramObj = {};
            paramObj["mod"] = typeArr[0];
            paramObj["do"] = typeArr[1];
            if (t_paramObj != null) {
                paramObj["message"] = t_paramObj;
            }
            var param = JSON.stringify(paramObj);
        }
        var returnStr = "data=" + param + "&h=" + App.ProxyUserFlag;
        return returnStr;
    };
    p.getURLVariables = function (t_type, t_paramObj) {
        //上面那一段需要在实际自定义改造
        if (t_type != null && t_type.length > 0) {
            var typeArr = t_type.split(".");
            var paramObj = {};
            paramObj["mod"] = typeArr[0];
            paramObj["do"] = typeArr[1];
            if (t_paramObj != null) {
                paramObj["message"] = t_paramObj;
            }
            var param = JSON.stringify(paramObj);
        }
        var variables = new egret.URLVariables("data=" + param + "&h=" + App.ProxyUserFlag);
        //var variables: egret.URLVariables = new egret.URLVariables("test=ok");// post test = ok
        return variables;
    };
    p.getURLVariablesGet = function (t_type, t_paramObj) {
        var str = "";
        var len = t_paramObj.length;
        for (var x = 0; x < len; x++) {
            str += "&" + t_paramObj[x];
        }
        str = str.substring(1, str.length);
        str = "/" + str;
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
    };
    return BaseProxy;
}());
egret.registerClass(BaseProxy,'BaseProxy');
