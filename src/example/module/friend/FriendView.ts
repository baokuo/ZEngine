/**
 * Created by egret on 15-1-7.
 */
class FriendView extends BasePanelView2 {
    
    private sub :string[];
    public constructor(controller:BaseController, parent:eui.Group) {
        super(controller, parent);

        this.icon = "table_tittle";
        this.sub = ["preload_battle"];
        this.setResources(this.sub);
    }
    
    
    public setResources(resources: string[]): void {
        super.setResources(resources);
    
    }
    public initData(): void {
        super.initData();
      
    }
    public initUI(): void {
        super.initUI();
        super.clearResource();
      
    }
}