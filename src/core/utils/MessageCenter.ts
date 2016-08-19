/**
 * Created by yangsong on 2014/11/23.
 * 服务端返回消息处理
 */
class MessageCenter extends BaseClass {
    private dict:any;
    private eVec:Array<MessageVo>;
    private lastRunTime:number;
    private type:number;

    /**
     * 构造函数
     * @param type 0:使用分帧处理 1:及时执行
     */
    public constructor(type:number) {
        super();
        this.type = type;
        this.dict = {};
        this.eVec = new Array<MessageVo>();
        this.lastRunTime = 0;
        if (this.type == 0) {
            App.TimerManager.doFrame(1, 0, this.run, this);
        }
    }

    /**
     * 清空处理
     */
    public clear() {
        this.dict = {};
        this.eVec.splice(0);
    }

    /**
     * 添加消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     *
     */
    public addListener(type:string, listener:Function, listenerObj:any):void {
        var arr:Array<any> = this.dict[type];
        if (arr == null) {
            arr = new Array<any>();
            this.dict[type] = arr;
        }

        //检测是否已经存在
        var i:number = 0;
        var len:number = arr.length;
        for (i; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                return;
            }
        }

        arr.push([listener, listenerObj]);
    }

    /**
     * 移除消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     */
    public removeListener(type:string, listener:Function, listenerObj:any):void {
        var arr:Array<any> = this.dict[type];
        if (arr == null) {
            return;
        }

        var i:number = 0;
        var len:number = arr.length;
        for (i; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                arr.splice(i, 1);
                break;
            }
        }

        if (arr.length == 0) {
            this.dict[type] = null;
            delete this.dict[type];
        }
    }

    /**
     * 移除某一对象的所有监听
     * @param listenerObj 侦听函数所属对象
     */
    public removeAll(listenerObj:any):void {
        var keys = Object.keys(this.dict);
        for (var i:number = 0, len = keys.length; i < len; i++) {
            var type = keys[i];
            var arr:Array<any> = this.dict[type];
            for (var j = 0; j < arr.length; j++) {
                if (arr[j][1] == listenerObj) {
                    arr.splice(j, 1);
                    j--;
                }
            }

            if (arr.length == 0) {
                this.dict[type] = null;
                delete this.dict[type];
            }
        }
    }

    /**
     * 触发消息
     * @param type 消息唯一标识
     * @param param 消息参数
     *
     */
    public dispatch(type:string, ...param:any[]):void {
        if (this.dict[type] == null) {
            return;
        }

        var vo:MessageVo = ObjectPool.pop("MessageVo");//注意这里循环使用objpool里的message 所以用完的时候他设置了一个null 妈的
        vo.type = type;
       
        vo.param = param;
        //注意这里有一个type 和其他的type 没关系是开始初始化的时候定义的。定义msgcenter是走线程池 还是local thread
        if (this.type == 0) {
            this.eVec.push(vo);//添加了http头的参数 交给timer run 线程处理--交给队列处理
        }
        else if (this.type == 1) {
            this.dealMsg(vo);//直接回调
        }
        else {
            Log.trace("MessageCenter未实现的类型");
        }
    }

    /**
     * 运行
     *
     */
    private run():void {
        var currTime:number = egret.getTimer();
        var inSleep:boolean = currTime - this.lastRunTime > 100;
        this.lastRunTime = currTime;
        if (inSleep) {
            while (this.eVec.length > 0) {
                this.dealMsg(this.eVec.shift());//这里也只取一次
            }
        } else {
            while (this.eVec.length > 0) {
                this.dealMsg(this.eVec.shift());
                if ((egret.getTimer() - currTime) > 5) {
                    break;
                }
            }
        }
    }

    /**
     * 处理一条消息
     * @param msgVo
     */
    private dealMsg(msgVo:MessageVo):void {
        var listeners:Array<any> = this.dict[msgVo.type];
        var i:number = 0;
        var len:number = listeners.length;
        var listener:Array<any> = null;
        while (i < len) {
            listener = listeners[i];
            listener[0].apply(listener[1], msgVo.param);
            if (listeners.length != len) {
                len = listeners.length;
                i--;
            }
            i++;
        }
        msgVo.dispose();
        ObjectPool.push(msgVo);//把这个用过的再放回去。下次继续用...hehehe 
    }
}

class MessageVo {
    public type:string;
    public param:any[];

    public constructor() {
    }

    public dispose():void {
        this.type = null
        this.param = null;
    }
}