/**
 * Created by wangjiewen on 14-12-23.
 */
var Main = {
    init: function(){
        //初始化
        //window.scrollTo(0,document.body.scrollHeight);
        var h = $(document).height();
        var h1 = document.body.scrollHeight;
        $('body').stop().scrollTo(h1, 0, {
            onAfter: function(){
                //debugger;
                $("#bg-cloud").scrollingParallax({
                    staticSpeed: .45,
                    staticScrollLimit : false
                });
                $('#bg-star').scrollingParallax({
                    staticSpeed : .8,
                    staticScrollLimit : false
                });

                Rocket.init();
                Rock.init();
                Planet.init();
                Animate.init();
            }
        });

        //a 标签在新窗口打开
        $("a").attr({"target":"_blank"});

    }
};

//$(document).ready(function(){
//    var h = $(document).height();
//    var h1 = document.body.scrollHeight;
//    debugger;
//});
//window.onload = function () {
//    var h = $(document).height();
//    var h1 = document.body.scrollHeight;
//    debugger;
//    //window.scrollTo(0,h);
//};
$("body").load(function () {
    debugger
});

function debug(msg){
    console.log(msg)
}
