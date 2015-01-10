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
    curSkyId: 0,//目前的天空对象id

    init: function(){
        var self = this;
        self.windowHeight = $(window).height();
        self.windowWidth = $(window).width();
        self.docHeight = $(document).height();
        self.rocket = $('#rocket');

        //initialize the position of rocket
        self.rTop = self.windowHeight - self.rocket.height();
        self.rocket.css({top: self.rTop});
        self.lastPos = self.rocket.offset();
        self.rotate(0);
    },

    /**
     * 由Animate.js调用
     * @param target
     */
    animate: function (target) {
        var self = this;
        self.rocket.animate(target,{
            easing: 'easeInOutQuad',
            duration: 2000,
            step: function(){

            },
            complete: function(){

            }
        });
    },

    /**
     * 火箭移动的主函数
     * @param e
     */
    move: function(e){
        var self = this;
        //控制岩石
        Rock.scroll(self.isUp(), self.isRight());

        //判断火箭是否被激活
        if(!Rocket.isActivated && !Rocket.isRunning){
            Rocket.launch();
            return;
        }

        if(self.isRunning){
            return;
        }

        self.isRunning = true;

        //self.calcDegree();

        self.isRunning = false;
        self.lastPos = self.rocket.offset();

    },

    /**
     * 根据不同的条件计算当前火箭的角度，并进行旋转
     */
    calcDegree: function(p1, p2){
        var self = this;

        //var p1 = self.rocket.offset();
        //var p2 = self.lastPos;
        var angle = 0;

        //当垂直运动的时候
        if(p1.left == p2.left){
            if(!self.isUp()){
                angle = 180;
            }
            //debugger
            self.rotate(angle);
            return;
        }

        //当两个天体的b-left的差小于150的时候
        if(0 < self.curSkyId && self.curSkyId < self.skyList.length - 3){
            var sky = null;
            var bLeft1 = 0;
            var bLeft2 = 0;
            if(self.isUp()){
                sky = self.skyList[self.curSkyId - 1];
                bLeft1 = parseInt(sky.attr("b-left"));
                var upSky = self.skyList[self.curSkyId];
                bLeft2 = parseInt(upSky.attr("b-left"));
                if(Math.abs(bLeft1 - bLeft2) < 150){
                    angle = 0;
                    self.rotate(angle);
                    return;
                }
            }else{
                sky = self.skyList[self.curSkyId];
                bLeft1 = parseInt(sky.attr("b-left"));
                var downSky = self.skyList[self.curSkyId - 1];
                bLeft2 = parseInt(downSky.attr("b-left"));
                if(Math.abs(bLeft1 - bLeft2) < 150){
                    angle = 180;
                    self.rotate(angle);
                    return;
                }
            }
        }

        var tan = (p2.top - p1.top)/(p1.left - p2.left);
        angle = Math.atan(tan) / Math.PI * 180;
        angle = angle > 0 ? angle - 50 : angle + 50;
        if(!self.isUp()){
            angle += 180;
        }
        self.rotate(angle);

    },

    /**
     * 旋转函数
     * @param angle
     */
    rotate: function(angle){
        var self = this;
        self.rocket.find("img").css({
            "transform": "rotate(" + angle + "deg)",
            "-ms-transform": "rotate(" + angle + "deg)",
            "-moz-transform": "rotate(" + angle + "deg)",
            "-webkit-transform": "rotate(" + angle + "deg)",
            "-o-transform": "rotate(" + angle + "deg)"
        });
    },


    /**
     * 发射火箭
     */
    launch: function () {
        var self = this;
        console.log(self.rTop);
        self.rotate(0);
        //debugger
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

    /**
     * 判断火箭是否向上运动
     * @returns {boolean}
     */
    isUp: function () {
        var self = this;
        if(self.rocket.offset().top - self.lastPos.top >= 0){
            return false; //向下
        }else{
            return true; //向上
        }
    },

    /**
     * 判断火箭是否向右运动
     * @returns {boolean}
     */
    isRight: function(){
        var self = this;
        if(self.rocket.offset().left - self.lastPos.left >= 0){
            return true; //向右
        }else{
            return false; //向左
        }
    }
};


















