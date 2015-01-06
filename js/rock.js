/**
 * Created by wangjiewen on 14-12-25.
 */


//陨石
var Rock = {
    rocket: null,
    trophyList: [], //奖杯区域的列表
    trophyOffset: [], //奖杯区域的边界
    rockList: [], //岩石区域的列表，其中boom对象包含了碰撞点的信息

    init: function () {
        var self = this;
        var winWidth = $(window).width();
        self.rocket = $("#rocket");
        var trophy = $(".trophy-layout");
        trophy.each(function (i, elem) {
            elem = $(elem);
            var rock = elem.find(".trophy-rock");
            var direct = rock.attr("direct");

            //calculate the initial position and boom position of rock
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
            var bTop = elem.offset().top
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

            //calculate the area of trophy layout
            var offset = elem.offset();
            var width = elem.width();
            var height = elem.height();
            offset.right = offset.left + width;
            offset.bottom = offset.top + height;
            self.trophyOffset.push(offset);
            self.trophyList.push(elem);
            var workLayout = elem.prev(".work-layout");
            elem.attr({
                "b-left": bLeft,
                "b-top": bTop
            });
        });
        //reverse list to fit the sequence of layout
        self.rockList.reverse();
        self.trophyOffset.reverse();
        self.trophyList.reverse();

//        var bTop = self.rockList[0].boom.bTop;
//        $('body').stop().scrollTo(bTop - $(window).height() / 2, 1000,{
//            onAfter: function(){
//                debug("on after")
//            }
//        });
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
            return;
        }
//        console.log(curIndex);
        var boom = self.rockList[curIndex].boom;
        if (boom.inX == null || boom.inY == null) {
            var inY = self.trophyOffset[curIndex].bottom;
            var inX = self.linearFunc(inY, boom.bLeft, boom.bTop, rOff.left, rOff.top);
            boom.inX = inX;
            boom.inY = inY;
            boom.distance = Math.sqrt((boom.bLeft - inX) * (boom.bLeft - inX) + (boom.bTop - inY) * (boom.bTop - inY));
        }

        self.doMove(self.rockList[curIndex], boom);
    },

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
                left: newLeft ,
                top: newTop - rock.height() / 2
            };
        } else {
            attr = {
                left: newLeft - rock.width() / 2 - self.rocket.width() - 40,
                top: newTop - rock.height() / 2
            }
        }
        rock.css(attr);
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
    linearFunc: function (y, x1, y1, x2, y2) {
        if (x1 == x2) {//斜率不存在
            return x1;
        }
        var k = (y1 - y2) / (x1 - x2);
        if (k == 0) {//如果斜率 == 0
            return x1;
        }
        return (y - y1) / k + x1;
    },

    scroll: function (isUp, isRight) {
        var self = this;
        self.checkArea();
//        console.log(self.rockList[0].offset())
    }
}