/**
 * Created by wangjiewen on 14-12-23.
 */

window.onload = function(){
    Index.init();
    window.scrollTo(0,document.body.scrollHeight);

    var y = window.pageYOffset;
    var scrollFunc = function (e) {
        e.preventDefault();
        var delta = (e.wheelDelta > 0) ? -1 : 1;
        delta = delta * 8;
        window.scrollTo(0, y += delta);
    }
    /*注册事件*/
    if(document.addEventListener){
        document.addEventListener('DOMMouseScroll',scrollFunc,false);
    }//W3C
    document.onmousewheel=scrollFunc;//IE/Opera/Chrome
//    console.log(window)


}
