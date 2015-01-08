/**
 * Created by wangjiewen on 15-1-6.
 */

var Planet = {
    rocket: null,

    pointsOfLine: [], //直线方程的点
    pointsOfParabola: [], //火箭的驻停点, 通过三个点来确定唯一的抛物线
    alphaList: [], //抛物线方程的[a,b,c]系数

    init: function () {
        var self = this;
        self.rocket = $("#rocket");
        //要先初始化抛物线
        self.initParabola();
        self.buildParabola();
        //抛物线初始化完了之后再初始化直线，因为b-left,b-top是在iniParabola函数中
        self.initLine();
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
            var p1 = {x: offset.left + pW / 2, y: offset.top};//顶点
            var p2 = {x: 0, y: offset.top + pH / 2};//中间点
            switch (direct){
                case 'left' :
                    p2.x = offset.left + pW * -0.5;
                    break;
                case 'right':
                    p2.x = offset.left;
                    break;
                case 'mid-left'://从左边运动到中间
                    p2.x = offset.left;
                    break;
                case 'mid-right'://从右边运动到中间
                    p2.x = offset.left + pW;
                    break;
            }

            var work = elem.parent(".work-layout");
            var from = work.next("div");
            var className = from.attr("class");
            var pattern = new RegExp("(^|\\s)trophy-layout(\\s|$)");
            var p3 = {};
            //if rocket flies from trophy-layout
            if(pattern.test(className)){
                p3.x = parseFloat(from.attr("b-left"));
                p3.y = parseFloat(from.attr("b-top"));
            }else{
                var fromPos = from.find(".planet").offset();
                p3.x = fromPos.left + pW / 2;
                p3.y = fromPos.top;
            }
            var arr = [
                [p1.x, p1.y],
                [p2.x, p2.y],
                [p3.x, p3.y]
            ];
            work.attr({
                'b-left': p1.x,
                'b-top': p1.y
            });
            self.pointsOfParabola.push(arr)
        });
        self.pointsOfParabola.reverse();
    },

    /**
     * 创建抛物线方程
     */
    buildParabola: function () {
        var self = this;
        var len = self.pointsOfParabola.length;
        for(var i = 0; i < len; i++){
            var points = self.pointsOfParabola[i];
            var mat = Matrix.buildAugMatrix(points, 3);
            var alpha = Matrix.solve(mat);
            self.alphaList.push(alpha);
        }
        var left = self.calcParabola(0, 17520);
        var last = self.lastPos;
        //debugger
    },

    /**
     * 当火箭飞过work-layout的时候
     * 抛物线方程，根据top计算当前的left,再对结果进行筛选
     * @param workId
     * @param top
     * @returns {int}
     */
    calcParabola: function (workId, top) {
        var self = this;
        var alpha = self.alphaList[workId];
        var a = alpha[0];
        var b = alpha[1];
        var c = alpha[2] - top;
        var delta = b*b - 4*a*c;
        var x1 = (-b + Math.sqrt(delta)) / (2 * a);
        var x2 = (-b - Math.sqrt(delta)) / (2 * a);
        var p1 = self.pointsOfParabola[workId][0];
        var p3 = self.pointsOfParabola[workId][2];
        var span = 2;
        var minLeft = $("#work-" + (workId + 1)).find(".planet").width() / 2 - self.rocket.width()/2;

        var cx = -(b / (2*a));
        //debugger
        if(x1 < minLeft){
            return x2;
        }
        if(x2 < minLeft){
            return x1;
        }
        if(p1[0] > p3[0]){//from left-down to right-up
            if(p3[0] - span <= x1 && x1 <= p1[0] + span){
                return x1;
            }else{
                return x2;
            }
        }else{
            if((p1[0] - span <= x1 && x1 <= p3[0] + span)){
                return x1;
            }else{
                return x2;
            }
        }
    },

    /**
     * 初始化直线方程
     */
    initLine: function(){
        var self = this;
        var trophy = $("div.trophy-layout");
        trophy.each(function (i, elem) {
            elem = $(elem);
            var from = elem.next("div.work-layout");
            var p1 = {
                x: parseFloat(elem.attr("b-left")),
                y: parseFloat(elem.attr("b-top"))
            };
            var p2 = {};
            if(from.length > 0){
                p2.x = parseFloat(from.attr("b-left")),
                    p2.y = parseFloat(from.attr("b-top"))
            }else{
                p2.x = parseFloat(self.rocket.offset().left);
                p2.y = parseFloat(elem.offset().top + elem.height());
            }
            self.pointsOfLine.push([p1, p2]);
        });
        self.pointsOfLine.reverse();
    },


    /**
     * 当火箭飞过trophy-layout的时候，通过直线方程计算left
     * @param trophyId
     * @param top
     * @returns {*}
     */
    calcLine: function(trophyId, top){
        var self = this;
        var p1 = self.pointsOfLine[trophyId][0];
        var p2 = self.pointsOfLine[trophyId][1];
        var left = Matrix.linearFunc(top, p1.x, p1.y, p2.x, p2.y);
        return left;
    }

};