/**
 *
 * @author 
 *
 */
class TestScence extends BaseScene
{
	public constructor() {
        super();
	}
	
    /**
    * 进入Scene调用
    */
    public onEnter(): void {
        super.onEnter();

        this.addLayerAt(LayerManager.UI_Main,0);
        this.addLayerAt(LayerManager.UI_Popup,1);
        //添加一个纯色背景
        var rect: eui.Rect = new eui.Rect();
        rect.fillColor = 0x79b96f;
        rect.percentHeight = 100;
        rect.percentWidth = 100;
        LayerManager.UI_Main.addChild(rect);
        App.ViewManager.open(ViewConst.Friend);

    }

    /**
     * 退出Scene调用
     */
    public onExit(): void {
        super.onExit();
    }
	
}
