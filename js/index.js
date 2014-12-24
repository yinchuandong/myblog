/**
 * Created by wangjiewen on 14-12-23.
 */

var Index = {
    bodyHeight: 0,
    cloudY: 0,
    starY: 0,
    windowY: 0,
    sRate: {win:6, star: 5, cloud: 6}, //不同背景的增量
    bgStar: null,
    bgCloud: null,
    init: function(){
        var self = this;
        self.bodyHeight = window.pageYOffset;
        self.windowY = self.bodyHeight;
        self.bgStar = $("#bg-star");
        self.bgCloud = $("#bg-cloud");
        self.checkUserAgent();

//        $(".about-me-box").scrollTo( {top:'110px',left:'290px'}, 800 );
    },

    checkUserAgent: function(){
        var self = this;
        var isMac = function() {
            return /macintosh|mac os x/i.test(navigator.userAgent);
        }();

        if(!isMac){
            var multi = 10;
            self.sRate.win *= multi;
            self.sRate.star *= multi;
            self.sRate.cloud *= multi;
        }
    },

    handleScrollEvent: function (e) {
//        e.preventDefault();
        var self = this;
        var delta = (e.wheelDelta > 0) ? -1 : 1;

        var newWinY = self.windowY + delta * self.sRate.win;
        if(newWinY > self.bodyHeight){
            newWinY = self.bodyHeight;
            return;
        }
        if(newWinY < 0){
            newWinY = 0;
            return;
        }
        self.windowY = newWinY;
        window.scrollTo(0, self.windowY);
//        $(window).scrollTo(window.pageXOffset);
//        $(window).scrollTo(self.windowY, 5);
//        $(".about-me-box").scrollTo( {top:'110px',left:'290px'}, 800 );


        self.starY += delta * self.sRate.star;
        self.bgStar.css({bottom: self.starY});
//        self.bgStar.scrollTo("-=100", 500);
//        debugger

        self.cloudY += delta * self.sRate.cloud;
//        self.bgCloud.css({bottom: self.cloudY})

    },

    bgStarScroll: function (y) {
        var self = this;
        self.bgStar.css({bottom: (window.pageYOffset - y * 0.8)});
    }
}

var StarLayout = {
    bgStar: null,
    init: function () {
        var self = this;
        self.bgStar = $("#bg-star");
    },

    scrollTo: function(y){

    }
}