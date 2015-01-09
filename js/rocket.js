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
    skyList: [],//天空的对象,
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
        self.initSkyBounds();
        self.calcDegree();
    },

    /**
     * 初始化天体的边界
     */
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
        var top = self.windowHeight/2;
        var left = self.getRoute();
        if(!self.isUp()){
            //top = top - self.rocket.height() / 2;
            //left = left - self.rocket.width();
        }
        self.rocket.css({
            left: left,
            top: top
        });

        self.calcDegree();

        self.isRunning = false;
        self.lastPos = self.rocket.offset();

    },

    /**
     * 根据不同的条件计算当前火箭的角度，并进行旋转
     */
    calcDegree: function(){
        var self = this;

        var p1 = self.rocket.offset();
        var p2 = self.lastPos;
        var angle = 0;

        //当垂直运动的时候
        if(p1.left == p2.left){
            if(!self.isUp()){
                angle = 180;
            }
            //debugger
            self.rocket.find("img").css({
                "transform": "rotate(" + angle + "deg)",
                "-ms-transform": "rotate(" + angle + "deg)",
                "-moz-transform": "rotate(" + angle + "deg)",
                "-webkit-transform": "rotate(" + angle + "deg)",
                "-o-transform": "rotate(" + angle + "deg)"
            });
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
     * 通过当前的位置和当前运动的天体计算出rocket当前的left
     * @returns {*}
     */
    getRoute: function(){
        var self = this;
        var top = self.rocket.offset().top;
        var left = self.rocket.offset().left;
        var curIndex = self.checkArea(top);
        self.curSkyId = curIndex;
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

    /**
     * 判定当前rocket属于哪一个天体
     * 如果超过了class=sky的区域，将会返回-1或者-2
     * @param top
     * @returns {number}
     */
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


















