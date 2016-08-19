/**
 *
 * @author 
 *
 */
class HttpRequestGet extends BaseClass {
    private _serverUrl: string;
    private _request: egret.HttpRequest;
    private _cache: Array<any>;
    private _isRequesting: boolean;
    private _type: string;
    private _baseurl: string;
    

    /**
     * 构造函数
     */
    public constructor() {
        super();
        this._cache = [];
        this._request = new egret.HttpRequest();
    }

    /**
     * 初始化服务器地址
     * @param serverUrl服务器链接地址
     */
    public initServer(serverUrl: string): void {
        this._serverUrl = serverUrl;
    }

    /**
     * Http错误处理函数
     * @param e
     */
    private onError(e: egret.Event): void {
        this.nextGet();
    }

    /**
     * 请求数据
     * @param    type
     * @param    t_variables
     */
    public send(type: string,urlVariables: String): void {
        this._cache.push([type,urlVariables]);
        this.get();
    }

    /**
     * 请求服务器
     */
    private get(): void {
        if(this._isRequesting) {
            return;
        }

        if(this._cache.length == 0) {
            return;
        }

        var arr: String = this._cache.shift();
        var type: string = arr[0];
        //get--只是这样就行
        this._type = type;
        this._baseurl = this._serverUrl + arr[1];

        
        this._request.responseType = egret.HttpResponseType.TEXT;
        //设置为 GET 请求
        this._request.open(this._baseurl,egret.HttpMethod.GET);
        this._request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        this._request.send();
        this._request.addEventListener(egret.Event.COMPLETE,this.onLoaderComplete,this);
        this._request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onError,this);
        //this._request.addEventListener(egret.ProgressEvent.PROGRESS,this.onPostProgress,this);         
        this._isRequesting = true;
    }

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
    private onLoaderComplete(event: egret.Event): void {
        this._request.removeEventListener(egret.Event.COMPLETE,this.onLoaderComplete,this);
        this._request.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onError,this);
        var request = <egret.HttpRequest>event.currentTarget;
        
        var t_obj: any = JSON.parse(request.response);
        var str: String = t_obj.toString();
        if(!t_obj.hasOwnProperty("s") || t_obj["s"] == 0) {
            App.MessageCenter.dispatch(this._type,t_obj);
        }
        else {
            Log.trace("Http错误:" + t_obj["s"]);
        }
        this.nextGet();
    }

    /**
     * 开始下一个请求
     */
    private nextGet(): void {
        this._isRequesting = false;
        this.get();
    }
}