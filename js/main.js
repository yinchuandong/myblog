/**
 * Created by wangjiewen on 14-12-23.
 */

$(function(){
    window.scrollTo(0,document.body.scrollHeight);


    $("#bg-cloud").scrollingParallax({
        staticSpeed: .45,
        staticScrollLimit : false
    });
    $('#bg-star').scrollingParallax({
        staticSpeed : .8,
        staticScrollLimit : false
    });

    //控制鼠标滚轮
    var lastTime = 0;
    $("body").mousewheel(function (e, delta) {
        e.preventDefault();
        var curTime = (new Date()).getTime();
        if(curTime - lastTime < 200){
            return;
        }else{
            lastTime = curTime;
        }
        $.scrollTo.window().queue([]).stop();
        if (delta < 0) {
            $('body').stop().scrollTo('+=200', 500);
        } else {
            $('body').stop().scrollTo('-=200', 500);
        }
    });

    Matrix.init();

//    setTimeout(function(){
//        Rocket.init();
//        Rock.init();
//        Animate.init();
//        $(window).scroll(function(e){
//            Rocket.move(e);
//
//        });
//    }, 1000);

});


function debug(msg){
    console.log(msg)
}
