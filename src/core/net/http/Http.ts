/**
 * Created by yangsong on 2014/11/22.
 * Http请求处理
 */
class Http extends BaseClass {
    private _serverUrl:string;
    private _urlLoader:egret.URLLoader;
    private _request:egret.URLRequest;
    private _cache:Array<any>;
    private _isRequesting:boolean;
    //private _data:DynamicChange;
    private _type:string;

    /**
     * 构造函数
     */
    public constructor() {
        super();
        //this._data = new DynamicChange();

        this._cache = [];

        this._request = new egret.URLRequest();
        this._request.method = egret.URLRequestMethod.POST;
        this._urlLoader = new egret.URLLoader();
        this._urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
    }

    /**
     * 初始化服务器地址
     * @param serverUrl服务器链接地址
     */
    public initServer(serverUrl:string):void {
        this._serverUrl = serverUrl;
    }

    /**
     * 数据缓存
     * @returns {DynamicChange}
     * @constructor
     */
    //public get Data():DynamicChange {
    //    return this._data;
    //}

    /**
     * Http错误处理函数
     * @param e
     */
    private onError(e:egret.Event):void {
        this.nextPost();
    }

    /**
     * 请求数据
     * @param    type
     * @param    t_variables
     */
    public send(type:string, urlVariables:egret.URLVariables):void {
        this._cache.push([type, urlVariables]);
        this.post();
    }

    /**
     * 请求服务器
     */
    private post():void {
        if (this._isRequesting) {
            return;
        }

        if (this._cache.length == 0) {
            return;
        }

        var arr:Array<any> = this._cache.shift();
        var type:string = arr[0];
        //post
        var urlVariables:egret.URLVariables = arr[1];
        this._type = type;
        this._request.url = this._serverUrl+"/post";
        this._request.data = urlVariables;
        //get--只是这样就行
        this._type = type;
//        var str :String ="";
//        for(var i = 0;i < arr.length; i++)
//        {
//            str += "&" + arr[i]; 
//        }
//        str = str.substring(1,str.length);
//        str="/" + str;
        this._request.url = this._serverUrl+"/get";
        
        
        this._urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        this._urlLoader.load(this._request);
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
    private onLoaderComplete(event:egret.Event):void {
        this._urlLoader.removeEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        var t_obj:any = JSON.parse(this._urlLoader.data);
        var str: String = t_obj.toString();
        if (!t_obj.hasOwnProperty("s") || t_obj["s"] == 0) {
            //this._data.pUpdate.update(this._type, t_obj);// 去掉这段更新缓存的
            App.MessageCenter.dispatch(this._type, t_obj);
        }
        else {
            Log.trace("Http错误:" + t_obj["s"]);
        }
        this.nextPost();
    }

    /**
     * 开始下一个请求
     */
    private nextPost():void {
        this._isRequesting = false;
        this.post();
    }
}
