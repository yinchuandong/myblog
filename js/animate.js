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
        var layout = $('#master-layout').find('div.sky');
        layout.each(function(i, elem){
            elem = $(elem);
            var bLeft = parseFloat(elem.attr("b-left"));
            var bTop = parseFloat(elem.attr("b-top"));
            var pos = {left: bLeft, top: bTop};
            self.posList.push(pos);
        });
        self.posList.reverse();
        self.goUp();
    },
    goUp: function(){
        var self = this;
        self.timer = setTimeout(function(){
            var bTop = self.posList[self.curIndex].top;
            $('body').stop().scrollTo(bTop - $(window).height() / 2, 2000,{
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