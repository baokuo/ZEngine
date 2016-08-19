/**
 *
 * @author
 *
 */
var HTTP_GET = (function (_super) {
    __extends(HTTP_GET, _super);
    /**
     * 构造函数
     */
    function HTTP_GET() {
        _super.call(this);
        //this._data = new DynamicChange();
        this._cache = [];
        this._request = new egret.URLRequest();
        this._request.method = egret.URLRequestMethod.GET;
        this._urlLoader = new egret.URLLoader();
        this._urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
    }
    var d = __define,c=HTTP_GET,p=c.prototype;
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
        this.nextGet();
    };
    /**
     * 请求数据
     * @param    type
     * @param    t_variables
     */
    p.send = function (type, urlVariables) {
        this._cache.push([type, urlVariables]);
        this.get();
    };
    /**
     * 请求服务器
     */
    p.get = function () {
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
        //        var str :String ="";
        //        for(var i = 0;i < arr.length; i++)
        //        {
        //            str += "&" + arr[i]; 
        //        }
        //        str = str.substring(1,str.length);
        //        str="/" + str;
        this._request.url = this._serverUrl + arr[1];
        this._urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        this._urlLoader.load(this._request);
        this._isRequesting = true;
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
        this._urlLoader.removeEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        var t_obj = JSON.parse(this._urlLoader.data);
        var str = t_obj.toString();
        if (!t_obj.hasOwnProperty("s") || t_obj["s"] == 0) {
            //this._data.pUpdate.update(this._type, t_obj);// 去掉这段更新缓存的
            App.MessageCenter.dispatch(this._type, t_obj);
        }
        else {
            Log.trace("Http错误:" + t_obj["s"]);
        }
        this.nextGet();
    };
    /**
     * 开始下一个请求
     */
    p.nextGet = function () {
        this._isRequesting = false;
        this.get();
    };
    return HTTP_GET;
}(BaseClass));
egret.registerClass(HTTP_GET,'HTTP_GET');
