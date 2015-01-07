/**
 * Created by wangjiewen on 14-12-23.
 */

//火箭
var Rocket = {
    windowHeight: 0,
    windowWidth: 0,
    docHeight: 0,
    rocket: null,
    isRunning: false,
    isActivated: false,
    rTop: 0, //火箭起始位置的top
    lastPos: {}, //上一次的位置
    skyBounds: [],//不同天空区域的bounds
    skyList: [],//天空的对象

    init: function(){
        var self = this;
        self.windowHeight = $(window).height();
        self.windowWidth = $(window).width();
        self.docHeight = $(document).height();
        self.rocket = $('#rocket');

        //initialize the position of rocket
        self.rTop = self.windowHeight - $("#j-earth").height() - self.rocket.height() / 4;
        self.rocket.css({top: self.rTop});
        self.lastPos = self.rocket.offset();

        self.initSkyBounds();
        Planet.init();
    },

    initSkyBounds: function(){
        var self = this;
        var sky = $("#master-layout").find("div.sky");
        sky.each(function(i, elem){
            elem = $(elem);
            var width = elem.width();
            var height = elem.height();
            var left = elem.offset().left;
            var top = elem.offset().top;
            var right = left + width;
            var bottom = top + height;
            var bound = {
                left: left,
                top: top,
                right: right,
                bottom: bottom
            };
            self.skyBounds.push(bound);
            self.skyList.push(elem);
        });
        self.skyBounds.reverse();
        self.skyList.reverse();
    },


    move: function(e){
        var self = this;
        //控制岩石
        Rock.scroll(self.isUp(), self.isRight());

        if(self.isRunning){
            return;
        }

        //判断是否被激活
        if(!self.isActivated && !self.isRunning){
            self.launch();
            return;
        }
        self.isRunning = true;
        var top = self.windowHeight/2;
        //var left = Planet.calcParabola(0, window.pageYOffset + top);
        var left = self.getRoute();
        self.rocket.css({
            left: left,
            top: top
        });

        self.getRoute();

        self.isRunning = false;
        self.lastPos = self.rocket.offset();

    },

    getRoute: function(){
        var self = this;
        var top = self.rocket.offset().top;
        var left = self.rocket.offset().left;
        var curIndex = self.checkArea(top);
        if(curIndex >= 0){
            var sky = self.skyList[curIndex];
            var type = sky.attr("b-type");
            var id = parseInt(sky.attr("id").split("-")[1]) - 1;
            var newLeft = 0;
            if(type == 'work'){
                //work
                newLeft = Planet.calcParabola(id, top);
            }else{
                //trophy
                newLeft = Planet.calcLine(id, top);
            }
            return newLeft;
        }
        return left;
    },

    checkArea: function (top) {
        var self = this;
        var len = self.skyBounds.length;
        var curIndex = -1;
        for(var i = 0; i < len; i++){
            var sb = self.skyBounds[i];
//            var span = self.isUp() ? 1 : 0; //向上和向下判定不一样
            if(sb.top <= top && top < sb.bottom){
                curIndex = i;
                break;
            }
        }

        if(curIndex == -1){
            var bottomSky = self.skyBounds[0];
            var topSky = self.skyBounds[len - 1];
            //大于底部的sky的bottom时，返回-1
            if(top > bottomSky.bottom){
                curIndex = -1;
            }
            //小于顶部的sky的top时，返回-2
            if(top < topSky.top){
                curIndex = -2;
            }
        }

        return curIndex;
    },
    
    launch: function () {
        var self = this;
        console.log(self.rTop);
        self.isRunning = true;
        var top = self.windowHeight/2;
        self.rocket.stop().animate({top: top}, {
            duration: 1500,
            easing: 'easeInQuad',
            step: function(){
                //change the direction of rocket
            },
            complete: function() {
                self.isActivated = true;
                self.isRunning = false;
            }
        });
    },
    
    isUp: function () {
        var self = this;
        if(self.rocket.offset().top - self.lastPos.top >= 0){
            return false; //向下
        }else{
            return true; //向上
        }
    },

    isRight: function(){
        var self = this;
        if(self.rocket.offset().left - self.lastPos.left >= 0){
            return true; //向右
        }else{
            return false; //向左
        }
    }
};


















