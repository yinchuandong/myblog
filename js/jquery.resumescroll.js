/*
	Ada Blog
	Copyright 2014 03 15 by Ada Wang/汪洁文
*/

(function($){
	var scrollArray = [];
	var len = 0;
	var opts = null;
	$.fn.resumescroll = function(options){
		opts = $.extend({}, $.fn.resumescroll.defaults, options);
		this.each(function(index, val) {
			var oscroll = {
				count: 0,
				count2:0,
				deg1: 0,
				deg2: 0,
				t1: null,
				t2: null,
				textBox: $(val).find(".lit-ball"),
				percent: parseInt($(val).attr("percent")),
				num: parseInt( $(val).find(".lit-ball").text()),
				ball1: $(val).find(".ball1"),
				ball2: $(val).find(".ball2"),
				interval:70,
				interval2:20,
				moveReg: function(){
					var _this = this;
					if(this.num>=this.percent){
						return false;
					}
					this.num = 0;
					this.deg1 = parseInt(this.percent/50*180);
					if(this.deg1>=180){
						this.deg1 = 180;
						this.deg2 =  parseInt((this.percent - 50) / 50 * 180);
					}
					clearTimeout(_this.t1);
					clearTimeout(_this.t2);
					$(val).css({
						"-webkit-transform":"scale(1, 1)",
						"-webkit-transition":"all 0.5s ease-in",
						"-moz-transform":"scale(1, 1)",
						"-moz-transition":"all 0.5s ease-in",
						"-o-transform":"scale(1, 1)",
						"-o-transition":"all 0.5s ease-in",
						"-ms-transform":"scale(1, 1)",
						"-ms-transition":"all 0.5s ease-in",
						"transform":"scale(1, 1)",
						"transition":"all 0.5s ease-in"
					});
					//linear,ease,ease-in,ease-out,ease-in-out,cubic-bezier(n,n,n,n)
					// 在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值。
					// 规定以相同速度开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）。
					// debug(getComputedStyle(ball2,false)['-webkit-transform']);
					// 这个脑残东西返回的是一个矩阵，等有空搞定它。
					// this.t1 = setInterval(function(){_this.start1()},20);
				},
				start1: function(){
					var _this = this;
					this.count = this.count + 7.2;
					this.num = this.num + 2;
					this.interval=this.interval-2;
					clearTimeout(_this.t1);
					if(this.count>=this.deg1-7.2){
						clearTimeout(_this.t1);
						this.ball2.css({
							"-webkit-transform":"rotate(" + this.deg1 + "deg)",
							"-o-transform":"rotate(" + this.deg1 + "deg)",
							"-moz-transform":"rotate(" + this.deg1 + "deg)",
							"-moz-transform":"rotate(" + this.deg1 + "deg)",
							"transform":"rotate(" + this.deg1 + "deg)"
						});
						//this.textBox.text(this.percent+"%");
						if(this.deg2!=0){
							this.textBox.text(this.num+"%");
							this.start2();
							this.t2 = setInterval(function(){_this.start2()},20);
						}else{
							debugger
							this.textBox.text(this.percent+"%");
							opts.onComplete();
						}
						return false;
					};
					this.textBox.text(this.num+"%");
					this.ball2.css("transform","rotate(" + this.count + "deg)");
					this.ball2.css("-o-transform","rotate(" + this.count + "deg)");
					this.ball2.css("-moz-transform","rotate(" + this.count + "deg)");
					this.ball2.css("-webkit-transform","rotate(" + this.count + "deg)");
					this.t1 = setTimeout(function(){_this.start1()},_this.interval);
				},
				start2: function(){
					var _this = this;
					this.count2 = this.count2 + 3.6;
					this.num = this.num +1;
					// this.interval2=this.interval2-1;
					clearTimeout(_this.t2);
					if(this.count2>=this.deg2-7.2){
						clearTimeout(_this.t2);
						this.ball1.css("transform","rotate(" + this.deg2 + "deg)");
						this.ball1.css("-webkit-transform","rotate(" + this.deg2 + "deg)");
						this.ball1.css("-o-transform","rotate(" + this.deg2 + "deg)");
						this.ball1.css("-moz-transform","rotate(" + this.deg2 + "deg)");
						this.textBox.text(this.percent+"%");
						//this.textBox.text(this.num+"%");
						debugger
						//回调函数
						opts.onComplete();
						return false;
					};
					this.textBox.text(this.num+"%");
					this.ball1.css("transform","rotate(" + this.count2 + "deg)");
					this.ball1.css("-o-transform","rotate(" + this.count2 + "deg)");
					this.ball1.css("-moz-transform","rotate(" + this.count2 + "deg)");
					this.ball1.css("-webkit-transform","rotate(" + this.count2 + "deg)");
					this.t2 = setTimeout(function(){_this.start2()},_this.interval2);
				},
				stopMove: function(){
					var _this = this;
					clearTimeout(_this.t1);
					clearTimeout(_this.t2);
				}
			};

			var scrollDiv = null;
			if ($(val).attr("scroll-index") !== undefined) {
				var scrollIndex = $(val).attr("scroll-index");
				scrollDiv = scrollArray[scrollIndex];
			}else{
				$(val).attr("scroll-index",len);
				scrollDiv = oscroll;
				scrollArray.push(oscroll);
				len ++;
			}

			switch(opts.state)
			{
				case 'start':
					scrollDiv.percent = parseInt($(val).attr("percent"));
					scrollDiv.moveReg();
					scrollDiv.start1();
					break;
				case 'stop':
					scrollDiv.stopMove();
					break;
				case 'moveBack':
					scrollDiv.moveBack();
					break;
			}
			return this;
		});

	};
	$.fn.resumescroll.defaults = {
		state: "start",
		onComplete: function(){

		}
	}

})(jQuery);

