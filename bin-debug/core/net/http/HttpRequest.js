/**
 *
 * @author
 *
 */
var HttpRequest = (function (_super) {
    __extends(HttpRequest, _super);
    /**
     * 构造函数
     */
    function HttpRequest() {
        _super.call(this);
        this._cache = [];
        this._request = new egret.HttpRequest();
    }
    var d = __define,c=HttpRequest,p=c.prototype;
    /**
     * 初始化服务器地址
     * @param serverUrl服务器链接地址
     */
    p.initServer = function (serverUrl) {
        this._serverUrl = serverUrl;
    };
    /**
     * Http错误处理函数
     * @param e
     */
    p.onError = function (e) {
        this.nextProcess();
    };
    /**
     * 请求数据
     * @param    type
     * @param    t_variables
     */
    p.send = function (type, urlVariables, _reqtype) {
        if (urlVariables.length == 0)
            return;
        this._cache.push([type, urlVariables, _reqtype]);
        this.process();
    };
    /**
     * 请求服务器
     */
    p.process = function () {
        if (this._isRequesting) {
            return;
        }
        if (this._cache.length == 0) {
            return;
        }
        var arr = this._cache.shift();
        var type = arr[0];
        //get--只是这样就行
        this._type = type;
        var req = arr[2];
        if (req == HttpMethod.MethodGET + "") {
            this._baseurl = this._serverUrl + arr[1];
            this._request.responseType = egret.HttpResponseType.TEXT;
            //设置为 GET 请求
            this._request.open(this._baseurl, egret.HttpMethod.GET);
            this._request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            this._request.send();
            this._request.addEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
            this._request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
            //this._request.addEventListener(egret.ProgressEvent.PROGRESS,this.onPostProgress,this);         
            this._isRequesting = true;
        }
        else if (req == HttpMethod.MethodPOST + "") {
            this._baseurl = this._serverUrl + "/post";
            this._request.responseType = egret.HttpResponseType.TEXT;
            //设置为 POST 请求
            this._request.open(this._baseurl, egret.HttpMethod.POST);
            this._request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            this._request.send(arr[1]);
            this._request.addEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
            this._request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
            //this._request.addEventListener(egret.ProgressEvent.PROGRESS,this.onPostProgress,this);         
            this._isRequesting = true;
        }
    };
    /**
     * 数据返回
     * @param event
     *
     *
     *
     *
     * str = "{
                  "args": {},
                  "data": "",
                  "files": {},
                  "form": {
                    "test": "ok"
                  },
                  "headers":
                  {
                    *",
                    "Accept-Encoding": "gzip, deflate",
                    "Accept-Language": "zh-CN,zh;q=0.8",
                    "Content-Length": "7",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Host": "httpbin.org",
                    "Origin": "http://192.168.1.102:3001",
                    "Referer": "http://192.168.1.102:3001/index.html",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36"
                  },
                    "json": null,
                    "origin": "1.180.237.255","url": "http://httpbin.org/post"
            }
    "
     *
     *
     *
     *
     */
    p.onLoaderComplete = function (event) {
        this._request.removeEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        this._request.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
        var request = event.currentTarget;
        var t_obj = JSON.parse(request.response);
        var str = t_obj.toString();
        if (!t_obj.hasOwnProperty("s") || t_obj["s"] == 0) {
            App.MessageCenter.dispatch(this._type, t_obj);
        }
        else {
            Log.trace("Http错误:" + t_obj["s"]);
        }
        this.nextProcess();
    };
    /**
     * 开始下一个请求
     */
    p.nextProcess = function () {
        this._isRequesting = false;
        this.process();
    };
    return HttpRequest;
}(BaseClass));
egret.registerClass(HttpRequest,'HttpRequest');
