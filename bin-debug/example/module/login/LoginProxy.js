/**
 * Created by Administrator on 2014/11/23.
 */
var LoginProxy = (function (_super) {
    __extends(LoginProxy, _super);
    function LoginProxy($controller) {
        _super.call(this, $controller);
        this.num = 1;
        //注册从服务器返回消息的监听
        this.receiveServerMsg(HttpConst.USER_LOGIN, this.loginSuccess, this);
    }
    var d = __define,c=LoginProxy,p=c.prototype;
    /**
     * 用户登陆
     * @param userName
     * @param pwd
     */
    p.login = function (userName, pwd) {
        //        var paramObj:any = {
        //            "uName":userName,
        //            "uPass":pwd
        //        };
        //        this.sendHttpMsg(HttpConst.USER_LOGIN, paramObj);//data:"{"mod":"User","do":"login","p",{"uname":"yangsong","upass","123456"}}"
        // GET TEST
        //        var paramObj: Array<string> = [];
        //        paramObj[0] = "get";
        //       
        //        this.sendHttpMsgByGetMethod(HttpConst.USER_LOGIN,paramObj);
        // Get basic TEST
        //        var paramObj: Array<string> = [];
        //        paramObj[0] = "get";
        //        this.sendHttpRequestGet(HttpConst.USER_LOGIN,paramObj);
        //POST basic Test
        //        var paramObj:any = {
        //            "uName":userName,
        //            "uPass":pwd
        //        };
        //        this.sendHttpRequestPost(HttpConst.USER_LOGIN, paramObj);//data:"{"mod":"User","do":"login","p",{"uname":"yangsong","upass","123456"}}"
        //        var paramObj:any = {
        //            "uName":userName,
        //            "uPass":pwd
        //        };
        //        this.sendHttpRequest(HttpConst.USER_LOGIN, paramObj,HttpMethod.MethodPOST);//data:"{"mod":"User","do":"login","p",{"uname":"yangsong","upass","123456"}}"
        //        var paramObj: Array<string> = [];
        //        paramObj[0] = "get";
        //        this.sendHttpRequest(HttpConst.USER_LOGIN,paramObj,HttpMethod.MethodGET);
        this.num++;
        if (this.num == 2) {
            var paramObj = {
                "uName": userName,
                "uPass": pwd
            };
            this.sendHttpRequest(HttpConst.USER_LOGIN, paramObj, HttpMethod.MethodPOST); //data:"{"mod":"User","do":"login","p",{"uname":"yangsong","upass","123456"}}"
        }
        else if (this.num == 3) {
            var paramObj1 = [];
            paramObj1[0] = "get";
            this.sendHttpRequest(HttpConst.USER_LOGIN, paramObj1, HttpMethod.MethodGET);
        }
        else if (this.num == 4) {
            var paramObj2 = {
                "uName": userName + "11",
                "uPass": pwd + "11"
            };
            this.sendHttpRequest(HttpConst.USER_LOGIN, paramObj2, HttpMethod.MethodPOST);
        }
        else if (this.num == 5) {
            var paramObj3 = [];
            paramObj3[0] = "get";
            this.sendHttpRequest(HttpConst.USER_LOGIN, paramObj3, HttpMethod.MethodGET);
        }
        else if (this.num == 6) {
            var paramObj4 = {
                "uName": userName + "22",
                "uPass": pwd + "22"
            };
            this.sendHttpRequest(HttpConst.USER_LOGIN, paramObj4, HttpMethod.MethodPOST);
        }
        else if (this.num == 7) {
            var paramObj5 = [];
            paramObj5[0] = "get";
            this.sendHttpRequest(HttpConst.USER_LOGIN, paramObj5, HttpMethod.MethodGET);
        }
        else if (this.num == 8) {
            var paramObj6 = {
                "uName": userName + "2333",
                "uPass": pwd + "2333"
            };
            this.sendHttpRequest(HttpConst.USER_LOGIN, paramObj6, HttpMethod.MethodPOST);
        }
    };
    /**
     * 用户登陆成功返回
     */
    p.loginSuccess = function (obj) {
        this.applyFunc(LoginConst.LOGIN_S2C, obj);
    };
    return LoginProxy;
}(BaseProxy));
egret.registerClass(LoginProxy,'LoginProxy');
