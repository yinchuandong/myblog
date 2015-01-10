/**
 * Created by wangjiewen on 14-12-25.
 */


//陨石
var Rock = {
    winWidth: 0,
    rocket: null,
    trophyList: [], //奖杯区域的列表
    trophyOffset: [], //奖杯区域的边界
    rockList: [], //岩石区域的列表，其中boom对象包含了碰撞点的信息
    curIndex: 0, //当前的trophy-layout的
    isRocketUp: true, //火箭运动的方向

    init: function () {
        var self = this;
        self.winWidth = $(window).width();
        self.rocket = $("#rocket");

        var trophy = $(".trophy-layout");
        trophy.each(function (i, elem) {
            elem = $(elem);
            self.initRock(elem);
            self.initSmallRock(elem);

        });
        //reverse list to fit the sequence of layout
        self.rockList.reverse();
        self.trophyOffset.reverse();
        self.trophyList.reverse();

    },

    initRock: function(elem){
        var self = this;
        var winWidth = self.winWidth;
        var rock = elem.find(".trophy-rock");
        var direct = rock.attr("direct");

        //calcParabola the initial position and boom position of rock
        var oLeft = 0; // original left of rock
        if (direct == "right") {
            oLeft = elem.offset().left + elem.width();
            rock.css({ top: 0, left: winWidth});
        } else {
            var rockWidth = rock.width();
            oLeft = -rockWidth;
            rock.css({ top: 0, left: -rockWidth});
        }

        var oTop = elem.offset().top - elem.height() / 2; // origin top of rock
        //booming left and top
        var bLeft = self.rocket.offset().left;
        //碰撞点设置在trophy的top边界上，
        //因此checkArea函数边界需要向上扩展elem.height()/2
        var bTop = elem.offset().top;
        rock.boom = {
            oLeft: oLeft,
            oTop: oTop,
            bLeft: bLeft,
            bTop: bTop,
            inX: null,
            inY: null,
            distance: null
        };
        self.rockList.push(rock);

        //calcParabola the area of trophy layout
        var offset = elem.offset();
        var width = elem.width();
        var height = elem.height();
        offset.right = offset.left + width;
        offset.bottom = offset.top + height;
        self.trophyOffset.push(offset);
        self.trophyList.push(elem);
        elem.attr({
            "b-left": bLeft,
            "b-top": bTop
        });
    },
    initSmallRock: function(elem){
        var self = this;
        var winWidth = self.winWidth;
        var rock = elem.find(".trophy-small");
        var direct = rock.attr("direct");

        //calcParabola the initial position and boom position of rock
        if (direct == "right") {
            rock.css({ top: 0, left: winWidth});
        } else {
            var rockWidth = rock.width();
            rock.css({ top: 0, left: -rockWidth});
        }
    },

    /**
     * check the bounds of trophy layout,
     * and judge which layout is the current area
     */
    checkArea: function () {
        var self = this;
        var len = self.trophyOffset.length;
        var rocket = $("#rocket");
        var rOff = rocket.offset();
        var curIndex = -1;
        for (var i = 0; i < len; i++) {
            var tOff = self.trophyOffset[i];
            var tro = self.trophyList[i];
            if ((tOff.left <= rOff.left && rOff.left <= tOff.right)
                && (tOff.top - tro.height() / 2 <= rOff.top && rOff.top <= tOff.bottom)) {
                curIndex = i;
                break;
            }
        }
        if (curIndex == -1) {
            return curIndex;
        }
//        console.log(curIndex);
        var boom = self.rockList[curIndex].boom;
        if (boom.inX == null || boom.inY == null) {
            var inY = self.trophyOffset[curIndex].bottom;
            var inX = Matrix.linearFunc(inY, boom.bLeft, boom.bTop, rOff.left, rOff.top);
            boom.inX = inX;
            boom.inY = inY;
            boom.distance = Math.sqrt((boom.bLeft - inX) * (boom.bLeft - inX) + (boom.bTop - inY) * (boom.bTop - inY));
        }

        return curIndex;
    },

    /**
     * 陨石具体移动的函数
     * @param rock
     * @param boom
     */
    doMove: function (rock, boom) {
        var self = this;
        var rLeft = self.rocket.offset().left;
        var rTop = self.rocket.offset().top;
        var inX = boom.inX;
        var inY = boom.inY;

        var curD = Math.sqrt((rLeft - inX) * (rLeft - inX) + (rTop - inY) * (rTop - inY));
        var per = curD / boom.distance;

        var bLeft = boom.bLeft;
        var bTop = boom.bTop;
        var oLeft = boom.oLeft;
        var oTop = boom.oTop;

        var newLeft = (bLeft - oLeft) * per + oLeft;
        var newTop = (bTop - oTop) * per + oTop;
        newTop -= window.pageYOffset;

        var direct = rock.attr("direct");
        var attr = {};
        if (direct == "right") {
            attr = {
                left: newLeft + 88,
                top: newTop - rock.height() + 20
            };
        } else {
            attr = {
                left: newLeft - rock.width() + 120,
                top: newTop - rock.height() + 20
            }
        }
        rock.css(attr);
    },

    /**
     * 留给Rocket调用的接口
     * @param isUp
     * @param isRight
     */
    scroll: function (isUp, isRight) {
        var self = this;
        self.isRocketUp = isUp;
        var id = self.checkArea();
        self.curIndex = id;
        if(id == -1){
            return;
        }
        var boom = self.rockList[id].boom;
        self.doMove(self.rockList[id], boom);

    },

    /**
     * 小彗星的运动
     */
    sRockIn: function(){
        var self = this;
        var id = self.curIndex;
        if(id == -1){
            return;
        }
        var rock = self.rockList[id];
        var sRock = rock.parent(".trophy-layout").find(".trophy-small");
        if(sRock.length > 0){
            //debugger
            var attr = {};
            var direct = sRock.attr("direct");
            if(direct == "left"){
                if(self.isRocketUp){
                    attr = {
                        left: $(window).width(),
                        top: $(window).height()
                    };
                    self.rotate(sRock, 225);
                }else{
                    attr = {
                        left: 0 - sRock.width(),
                        top: 0 - sRock.height()
                    };
                    self.rotate(sRock, 30);
                }
            }else{
                if(self.isRocketUp){
                    attr = {
                        left: 0 - sRock.width(),
                        top: $(window).height()
                    };
                    self.rotate(sRock, -10);
                }else{
                    attr = {
                        left: $(window).width(),
                        top: 0 - sRock.height()
                    };
                    self.rotate(sRock, 180);
                }
            }

            sRock.stop().animate(attr ,{
                duration: 2000
            });
        }
    },

    /**
     * 旋转函数
     * @param {jquery} $elem
     * @param {int} angle
     */
    rotate: function($elem, angle){
        $elem.css({
            "transform": "rotate(" + angle + "deg)",
            "-ms-transform": "rotate(" + angle + "deg)",
            "-moz-transform": "rotate(" + angle + "deg)",
            "-webkit-transform": "rotate(" + angle + "deg)",
            "-o-transform": "rotate(" + angle + "deg)"
        });
    }
};