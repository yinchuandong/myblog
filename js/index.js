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
        //控制掩饰
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

        self.rocket.css({top: top});


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
    rocket: null,
    trophyList: [],
    trophyOffset: [],
    rockList: [],
    rock1: null,


    init: function () {
        var self = this;
        var winWidth = $(window).width();
        self.rocket = $("#rocket");
        var trophy1 = $("#trophy-1");
        self.rock1 = trophy1.find(".trophy-rock");
        self.rock1.css({
            top: 0,
            left: winWidth
        });
        var oLeft = trophy1.offset().left + trophy1.width();
        var oTop = trophy1.offset().top;
        var bLeft = self.rocket.offset().left;
        var bTop = trophy1.offset().top + trophy1.height() / 2;
        self.rock1.boom = {
            oLeft: oLeft,
            oTop: oTop,
            bLeft: bLeft,
            bTop: bTop,
            inX: null,
            inY: null,
            distance: null
        };
        self.rockList.push(self.rock1);

        self.getAllTrophy();
        var top = Rocket.rTop;
//        debugger
        $('body').stop().scrollTo(bTop - $(window).height()/2, 1000);
    },

    getAllTrophy: function(){
        var self = this;
        var $trophies = $(".trophy-layout");
        $trophies.each(function(i, cont){
            cont = $(cont);
            var offset = cont.offset();
            var width = cont.width();
            var height = cont.height();
            offset.right = offset.left + width;
            offset.bottom = offset.top + height;
            self.trophyOffset.push(offset);
            self.trophyList.push(cont);
//            debugger
        });

        self.trophyOffset.reverse();
        self.trophyList.reverse();

    },
    
    checkArea: function () {
        var self = this;
        var len = self.trophyOffset.length;
        var rocket = $("#rocket");
        var rOff = rocket.offset();
        var curIndex = -1;
        for(var i = 0; i < len; i++){
            var tOff = self.trophyOffset[i];
            if((tOff.left <= rOff.left && rOff.left <= tOff.right)
                && (tOff.top <= rOff.top && rOff.top <= tOff.bottom)){
                curIndex = i;
                break;
            }
        }
        if(curIndex == -1){
            return;
        }
        console.log(curIndex);
//        debug($(window).scrollTop())
//        debug(window.pageYOffset)
        if(curIndex != 0){
            return;
        }
        var boom = self.rockList[0].boom;
        if(boom.inX == null || boom.inY ==null){
            var rock = self.rockList[0];
            var inY = self.trophyOffset[0].bottom;
            var inX = self.linearFunc(inY, boom.bLeft, boom.bTop, rOff.left, rOff.top);
            boom.inX = inX;
            boom.inY = inY;
            boom.distance = Math.sqrt((boom.bLeft - inX)*(boom.bLeft - inX) + (boom.bTop - inY)*(boom.bTop - inY));
//            debugger
        }

        self.doMove(self.rockList[0], boom);
//        self.linearFunc(200, 50, 100, 75, 150);
    },

    doMove: function(rock, boom){
        var self = this;
        var rLeft = self.rocket.offset().left;
        var rTop = self.rocket.offset().top;
        var inX = boom.inX;
        var inY = boom.inY;

        var curD = Math.sqrt((rLeft - inX)*(rLeft - inX) + (rTop - inY)*(rTop - inY));
        var per = curD / boom.distance;

        var bLeft = boom.bLeft;
        var bTop = boom.bTop;
        var oLeft = boom.oLeft;
        var oTop = boom.oTop;

        var newLeft = (bLeft - oLeft)*per + oLeft;
        var newTop = (bTop - oTop)*per + oTop;
        newTop -= window.pageYOffset;
        rock.css({
            left: newLeft - rock.width()/5,
            top: newTop
        });


    },

    /**
     *
     * @param y 给定的y用来求x
     * @param x1 为碰撞点的x
     * @param y1 为碰撞点的y
     * @param x2 火箭的x
     * @param y2 火箭的y
     * @returns {*}
     */
    linearFunc: function(y, x1, y1, x2, y2){
        if(x1 == x2){//斜率不存在
            return x1;
        }
        var k = (y1 - y2) / (x1 - x2);
        if(k == 0){//如果斜率 == 0
            return x1;
        }
        return (y - y1) / k + x1;
    },
    
    scroll: function (isUp, isRight) {
        var self = this;
//        self.move1(isUp);
        self.checkArea();
        console.log(self.rock1.offset())
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
















