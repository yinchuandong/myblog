/**
 * Created by wangjiewen on 14-12-23.
 */
var Main = {
    init: function(){
        //初始化
        window.scrollTo(0,document.body.scrollHeight);
        var t1 = document.body.scrollHeight;
        var t2 = $(document).height();
        $("#bg-cloud").scrollingParallax({
            staticSpeed: .45,
            staticScrollLimit : false
        });
        $('#bg-star').scrollingParallax({
            staticSpeed : .8,
            staticScrollLimit : false
        });


        Rock.init();
        Planet.init();
        Rocket.init();
        Animate.init();
    }
};

window.onload = function () {
    window.scrollTo(0,document.body.scrollHeight);
};

function debug(msg){
    console.log(msg)
}
