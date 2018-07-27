const {ccclass, property} = cc._decorator;

@ccclass
export default class RankingView extends cc.Component {

    @property(cc.Node)
    groupFriendButton: cc.Node = null;
    @property(cc.Node)
    friendButton: cc.Node = null;
    @property(cc.Node)
    gameOverButton: cc.Node = null;
    @property(cc.Sprite)
    rankingScrollView: cc.Sprite = null;//显示排行榜
    @property(cc.Texture2D)
    tex:cc.Texture2D = null

    start() {
        if (CC_WECHATGAME) {
            wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();

            let openDataContext = wx.getOpenDataContext()
            let sharedCanvas = openDataContext.canvas
            sharedCanvas.width = 720;
            sharedCanvas.height = 1280;
            wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
        }
    }

    friendButtonFunc(event) {
        if (CC_WECHATGAME) {
            // 发消息给子域
            wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取好友排行榜数据。x1");
        }
    }

    groupFriendButtonFunc(event) {
        if (CC_WECHATGAME) {
            wx.shareAppMessage({
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        wx.postMessage({
                            messageType: 5,
                            MAIN_MENU_NUM: "x1",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        } else {
            cc.log("获取群排行榜数据。x1");
        }
    }

    gameOverButtonFunc (event) {
        if (CC_WECHATGAME) {
            wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取横向展示排行榜数据。x1");
        }
    }

    submitScoreButtonFunc(){
        let score = 123;
        if (CC_WECHATGAME) {
            wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "x1",
                score: score,
            });
        } else {
            cc.log("提交得分: x1 : " + score)
        }
    }

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        let openDataContext = wx.getOpenDataContext()
        let sharedCanvas = openDataContext.canvas
        if (sharedCanvas != undefined) {
            this.tex.initWithElement(sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    }

    update() {
        this._updateSubDomainCanvas();
    }
}
