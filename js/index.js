/**
 * Created by wangjiewen on 14-12-23.
 */

var Rocket = {

    rocket: null,
    isRunning: false,
    rTop: 0,

    init: function(){
        var self = this;
        self.rocket = $('#rocket');
        self.rTop = parseInt(self.rocket.css('top'));
//        self.launch();
    },

    move: function(e){
        var self = this;
        if(self.isRunning){
            return;
        }
//        self.isRunning = true;
        console.log('step')
        var offset = $(document).scrollTop();
        var windowHeight = $(window).height();
        var docHeight = $(document).height();
        var top = window.pageYOffset + windowHeight/2;

        self.rocket.css({top: top})


    },
    
    launch: function () {
        var self = this;
        var windowHeight = $(window).height();
        var top = window.pageYOffset + windowHeight/2;
        self.rocket.stop().animate({top: top}, {
            duration: 1500,
            easing: 'easeInQuad',
            step: function(){
//                console.log('step')
            },
            complete: function() {
                self.isRunning = false;
            }
        });
    }
}