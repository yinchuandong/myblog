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
    posList: [], //保存layout的top
    layoutList: [], //保存layout对象
    timer: null,
    curIndex: 0,

    init: function () {

        var self = this;
        var jLayout = $('#master-layout').find('div.sky');
        jLayout.each(function(i, elem){
            elem = $(elem);
            var bTop = parseInt(elem.attr("b-top"));
            var bLeft = parseInt(elem.attr("b-left"));
            self.posList.push({
                top:bTop, left: bLeft
            });
            self.layoutList.push(elem);
        });
        self.posList.reverse();
        self.layoutList.reverse();

        //将about-me 和 about-future 添加到动画列表中
        var jFuture = $("#about-future");
        self.posList.insert(0, {
            left: Rocket.rocket.offset().left,
            top: window.pageYOffset + Rocket.rTop
        });
        self.posList.push({
            left: Rocket.rocket.offset().left,
            top: jFuture.find("div.about-future-box").offset().top
        });

        self.layoutList.insert(0, $("#about-me"));
        self.layoutList.push(jFuture);
        self.bindEvent();
    },

    /**
     * 绑定鼠标滚轮事件和滚动条事件
     */
    bindEvent: function(){
        var self = this;
        //控制鼠标滚轮
        $("body").mousewheel(function (e, delta) {
            e.preventDefault();

            //判断火箭是否被激活
            if(!Rocket.isActivated && !Rocket.isRunning){
                Rocket.launch();
                return;
            }

            if(self.isRunning || !Rocket.isActivated){
                return;
            }
            //debugger
            if (delta < 0) {
                //向下运动
                if(self.curIndex > 0){
                    self.hideBox(self.curIndex);
                    self.curIndex --;
                    self.doMove(self.curIndex, -1);
                }
            } else {
                //向上运动
                if(self.curIndex < self.posList.length - 1){
                    self.hideBox(self.curIndex);
                    self.curIndex ++;
                    self.doMove(self.curIndex, 1);
                }
            }
        });

        //绑定滚动条事件
        $(window).scroll(function(e){
            e.preventDefault();
            e.stopPropagation();
            Rocket.move(e);
        });
    },

    /**
     * body对滚动条的滚动
     * @param index
     * @param {int} dir 向上+1, 向下-1
     */
    doMove: function(index, dir){
        var self = this;
        self.isRunning = true;
        var newP = self.posList[index];
        var bTop = newP.top;
        $('body').stop().scrollTo(bTop - $(window).height() / 2, 2000,{
            onAfter: function(){
                self.showBox(index);
                self.isRunning = false;
            }
        });

        var oldP = self.posList[index - dir];
        Rocket.rocket.animate({
            left: newP.left
        },{
            easing: 'easeInOutQuad',
            duration: 2000
        });

    },

    /**
     * 隐藏信息简介的box
     * @param index
     */
    hideBox: function (index) {
        var self = this;
        var layout = self.layoutList[index];
        var box = layout.find("div.box");
        if(box.length > 0){
            box.fadeOut();
        }
    },

    /**
     * 显示信息简介的box
     * @param index
     */
    showBox: function(index){
        var self = this;
        var layout = self.layoutList[index];
        var box = layout.find("div.box");
        if(box.length > 0){
            box.fadeIn();
        }
    },

    /**
     * 自动播放
     */
    autoPlay: function(){
        var self = this;
        self.timer = setTimeout(function(){
            var bTop = self.posList[self.curIndex].top;
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