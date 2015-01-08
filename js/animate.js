/**
 * Created by wangjiewen on 14-12-25.
 */

/**
 * 修改数组的原型方法，实现数组的插入
 * @param index
 * @param item
 */
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

var Animate = {
    isRunning: false,
    posList: [],
    timer: null,
    curIndex: 0,

    init: function () {
        window.scrollTo(0,document.body.scrollHeight);

        var self = this;
        var jLayout = $('#master-layout').find('div.sky');
        jLayout.each(function(i, elem){
            elem = $(elem);
            var bTop = parseFloat(elem.attr("b-top"));
            self.posList.push(bTop);
        });
        self.posList.reverse();
        self.posList.insert(0, window.pageYOffset + Rocket.rTop);
        self.posList.push($("#about-future").find("div.about-future-box").offset().top);
        self.bindEvent();
    },

    bindEvent: function(){
        var self = this;
        //控制鼠标滚轮
        $("body").mousewheel(function (e, delta) {
            e.preventDefault();
            if(self.isRunning){
                return;
            }
            //debugger
            if (delta < 0) {
                if(self.curIndex > 0){
                    self.curIndex --;
                    self.doMove(self.curIndex);
                }
            } else {
                if(self.curIndex < self.posList.length - 1){
                    self.curIndex ++;
                    self.doMove(self.curIndex);
                }
            }
        });
    },

    doMove: function(index){
        var self = this;
        self.isRunning = true;
        var bTop = self.posList[index];
        $('body').stop().scrollTo(bTop - $(window).height() / 2, 3000,{
            onAfter: function(){
                self.isRunning = false;
            }
        });
    },

    autoPlay: function(){
        var self = this;
        self.timer = setTimeout(function(){
            var bTop = self.posList[self.curIndex];
            $('body').stop().scrollTo(bTop - $(window).height() / 2, 2000,{
                onAfter: function(){
                    self.curIndex += 1;
                    if(self.curIndex >= self.posList.length){
                        clearTimeout(self.timer);
                        return;
                    }
                    self.goUp();
                }
            });

        }, 4000);
    }
};