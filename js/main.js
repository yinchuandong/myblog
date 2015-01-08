/**
 * Created by wangjiewen on 14-12-23.
 */

$(function(){
    window.scrollTo(0,document.body.scrollHeight);

    //$("body").queryLoader2({backgroundColor:'#FFF', barColor:'#ff0000'});

    $("#bg-cloud").scrollingParallax({
        staticSpeed: .45,
        staticScrollLimit : false
    });
    $('#bg-star').scrollingParallax({
        staticSpeed : .8,
        staticScrollLimit : false
    });


//    Matrix.init();

    setTimeout(function(){
        Rock.init();
        Rocket.init();
        Animate.init();
        $(window).scroll(function(e){
            Rocket.move(e);

        });
    }, 1000);

});


function debug(msg){
    console.log(msg)
}
