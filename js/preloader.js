/**
 * Created by yinchuandong on 15/1/8.
 */
(function () {
    //图片预加载
    var PreLoader = {
        imgList: [],
        loadedNums: 0,

        init: function(){
            var self = this;
            self.selectAllImg();
            self.loadImg();
            //debugger
        },

        loadImg: function () {
            var self = this;
            var len = self.imgList.length;
            self.onPrepared(len);
            for(var i = 0; i < len; i++){
                var url = self.imgList[i];
                var img = new Image();
                img.src = url;
                if(img.complete){
                    self.loadedNums ++;
                    self.onLoading(self.loadedNums, len);
                    if(self.loadedNums >= len){
                        self.onComplete(len);
                    }
                    console.log(1);
                    return;
                }
                img.onload = function () {
                    self.loadedNums ++;
                    self.onLoading(self.loadedNums, len);
                    if(self.loadedNums >= len){
                        self.onComplete(len);
                    }
                    console.log(2);
                }
            }
        },
        //图片准备好加载
        onPrepared: function(sum){

        },
        //加载中
        onLoading: function (i, sum) {

        },
        //加载完成
        onComplete: function(len){

        },

        selectAllImg: function () {
            var self = this;
            $("body").find("*:not(script)").each(function () {
                self.getImg(this);
            });
        },

        //从节点中提取图片
        getImg: function(element){
            var self = this;
            var url = "";

            if ($(element).css("background-image") != "none") {
                url = $(element).css("background-image");
            } else if (typeof($(element).attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img") {
                url = $(element).attr("src");
            }

            if (url.indexOf("gradient") == -1) {
                url = url.replace(/url\(\"/g, "");
                url = url.replace(/url\(/g, "");
                url = url.replace(/\"\)/g, "");
                url = url.replace(/\)/g, "");

                var urls = url.split(", ");

                for (var i = 0; i < urls.length; i++) {
                    if (urls[i].length > 0) {
                        var extra = "";
                        if ($.browser.msie && $.browser.version < 9) {
                            extra = "?" + Math.floor(Math.random() * 3000);
                        }
                        if($.inArray(urls[i] + extra, self.imgList) == -1){
                            self.imgList.push(urls[i] + extra);
                        }
                    }
                }
            }
        }
    };

    $(document.ready(function(){PreLoader.init()});

})();
