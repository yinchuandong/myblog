/**
 * Created by wangjiewen on 14-12-23.
 */

//火箭
var Rocket = {
    windowHeight: 0,
    windowWidth: 0,
    docHeight: 0,
    rocket: null,
    posList: [], //火箭的驻停点, 通过三个点来确定唯一的抛物线
    alphaList: [], //抛物线方程的[a,b,c]系数
    isRunning: false,
    isActivated: false,
    rTop: 0, //火箭起始位置的top
    lastPos: {}, //上一次的位置

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
        self.initPos();
        self.buildParabola();
    },

    /**
     * 初始化火箭的运动轨迹
     */
    initPos: function(){
        var self = this;
        var jLayout = $(".work-layout .planet");

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
            var a = parseInt(Math.random()*100000) % 2;
            switch (direct){
                case 'left' :
                    p2.x = offset.left + pW;
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
                'b-top': p1.y,
                'b-type': 'work'
            });
            self.posList.push(arr)
        });
        self.posList.reverse();
    },

    /**
     * 创建抛物线方程
     */
    buildParabola: function () {
        var self = this;
        var len = self.posList.length;
        for(var i = 0; i < len; i++){
            var points = self.posList[i];
            var mat = Matrix.buildAugMatrix(points, 3);
            var alpha = Matrix.solve(mat);
            self.alphaList.push(alpha);
        }
        var left = self.calculate(0, 18000);
        var last = self.lastPos;
//        debugger
    },

    /**
     * 根据top计算当前的left,再对结果进行筛选
     * @param workId
     * @param top
     * @returns {int}
     */
    calculate: function (workId, top) {
        var self = this;
        var alpha = self.alphaList[workId];
        var a = alpha[0];
        var b = alpha[1];
        var c = alpha[2] - top;
        var delta = b*b - 4*a*c;
        var x1 = (-b + Math.sqrt(delta)) / (2 * a);
        var x2 = (-b - Math.sqrt(delta)) / (2 * a);
        var left = 0;
        var p1 = self.posList[workId][0];
        var p3 = self.posList[workId][2];
        var span = 2;
        if(p1.x > p3.x){//from left-down to right-up
            if(p3.x - span <= x1 && x1 <= p1.x + span){
                return x1;
            }else{
                return x2;
            }
        }else{
            if(p1.x - span <= x1 && x1 <= p3.x + span){
                return x1;
            }else{
                return x2;
            }
        }
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
        var left = self.calculate(0, window.pageYOffset + top);
        self.rocket.css({
            left: left,
            top: top
        });


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
};


















