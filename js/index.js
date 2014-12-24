/**
 * Created by wangjiewen on 14-12-23.
 */

//火箭
var Rocket = {
    windowHeight: 0,
    docHeight: 0,
    rocket: null,
    isRunning: false,
    isActivated: false,
    rTop: 0, //火箭起始位置的top
    lastPos: {}, //上一次的位置

    init: function(){
        var self = this;
        self.windowHeight = $(window).height();
        self.docHeight = $(document).height();
        self.rocket = $('#rocket');

        //initialize the position of rocket
        self.rTop = self.windowHeight - $("#j-earth").height() - self.rocket.height() / 4;
        self.rocket.css({top: self.rTop});
        self.lastPos = self.rocket.offset();
    },

    move: function(e){
        var self = this;
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

        self.rocket.css({top: top});
        //控制掩饰
        Rock.scroll(self.isUp(), self.isRight());

        self.isRunning = false;
        self.lastPos = self.rocket.offset();

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
//                console.log('step')
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
}

//陨石
var Rock = {

    rock1: null,


    init: function () {
        var self = this;
        var winWidth = $(window).width();
        self.rock1 = $("#trophy-1").find(".trophy-rock");
        self.rock1.css({
            top: 0,
            left: winWidth - self.rock1.width()
        })
    },
    
    scroll: function (isUp, isRight) {
        var self = this;
        self.move1(isUp);
    },

    move1: function (isUp) {
        var self = this;
        var upDir = isUp ? 1 : -1;
        var rightDir = isUp ? -1 : 1;
        var node = self.rock1;
        var top = parseInt(node.css("top"));
        var left = parseInt(node.css("left"));
//        debugger
        node.css({
            left: left + rightDir*4,
            top: top + upDir*5
        });
    }

    








}
















