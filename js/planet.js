/**
 * Created by wangjiewen on 15-1-6.
 */

var Planet = {
    rocket: null,

    init: function () {
        var self = this;
        self.rocket = $("#rocket");
        //要先初始化抛物线
        self.initParabola();
    },

    /**
     * 初始化火箭的运动轨迹
     */
    initParabola: function(){
        var self = this;
        var jLayout = $("div.work-layout .planet");

        //select 3 points to confirm a unique parabola equation
        jLayout.each(function (i, elem) {
            elem = $(elem);
            console.log($(elem).offset());
            var pW = elem.width();
            var pH = elem.height();
            var offset = elem.offset();
            var direct = elem.attr("direct");
            var p1 = {
                x: offset.left + pW / 2 - self.rocket.width() / 2,
                y: offset.top
            };//顶点
            var work = elem.parent(".work-layout");
            work.attr({
                'b-left': p1.x,
                'b-top': p1.y
            });
        });
    }

};