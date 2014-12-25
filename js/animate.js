/**
 * Created by wangjiewen on 14-12-25.
 */

var Animate = {
    isRunning: false,
    posList: [],
    timer: null,
    curIndex: 0,

    init: function () {
        var self = this;
        var rockList = Rock.rockList;
        var len = rockList.length;
        for(var i = 0; i < len; i++){
            var boom = rockList[i].boom;
            var pos = {left: boom.bLeft, top: boom.bTop};
            self.posList.push(pos);
        }
        self.goUp();
    },
    goUp: function(){
        var self = this;
        self.timer = setTimeout(function(){
            var bTop = self.posList[self.curIndex].top;
            $('body').stop().scrollTo(bTop - $(window).height() / 2, 1000,{
                onAfter: function(){
//                    debug("on after")
                    self.curIndex += 1;
                    if(self.curIndex >= self.posList.length){
                        clearTimeout(self.timer);
                        return;
                    }
                    self.goUp();
                }
            });

        }, 4000);
    },
    goDown: function(){

    }
};