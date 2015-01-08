(function($) {

  $.submarine = function(options) {

    // VARIABLES
    var submarine = this;
    var currentInd = 0;
    var destinationInd = 0;
    var waterLevel = 610;
    var currentWaterPos = 0;

    var defaults = {};
    submarine.settings = $.extend({}, defaults, options);

    // CONSTRUCTOR
    function init() {
      $('#submarine').css('top', 560 + 'px');
      submarine.adjustSubmarineHorizontal(560);      
      submarine.turnLights("off");
      submarine.turnDir("right");  
      submarine.floatMyBoat();     
    }

    // PUBLIC METHODS    
    submarine.floatMyBoat = function(){  
      if(parseInt($('#submarine').css('marginTop')) > 0){
        $('#submarine').animate ({marginTop:'-10px'}, {duration:1500, easing:'easeInOutQuad', step:function(){submarine.updateWaterLevel(currentWaterPos, {prop:'top'})}, complete:function(){submarine.floatMyBoat()}});
      }
      else{
        $('#submarine').animate ({marginTop:'10px'}, {duration:1500, easing:'easeInOutQuad', step:function(){submarine.updateWaterLevel(currentWaterPos, {prop:'top'})}, complete:function(){submarine.floatMyBoat()}});
      }
    }
    
    submarine.turnDir = function(dir){  
      this.dir = dir;
      if(dir == "right") {
        $('#submarine').addClass('right');
      }
      else{
        $('#submarine').removeClass('right');
      }      
    } 
    
    submarine.turnLights = function(dir){  
      this.lights = dir;
      if(dir == "on") {
        $('#submarine #submarine-lights').stop().animate({opacity:1}, {duration:900, easing:'easeInElastic'});
      }
      else{
        $('#submarine #submarine-lights').stop().animate({opacity:0}, {duration:800, easing:'easeOutQuad'});
      }
    } 
    
    submarine.adjustSubmarineHorizontal = function(top){    
      var section_height = 1000;
      var horizontal_center = 475 - (131 / 2);
      var maximum_offset = 300;
      var initial_top = 500;
      
      // position after xx; just go straight down
      if(top>3150) {top=3150;}
      
      var degrees = ((top - initial_top) / (section_height / 2)) * (Math.PI/2);
      var left = horizontal_center + Math.sin(degrees) * maximum_offset;

      $('#submarine').css('left', left+"px");
    }

    
    submarine.updateWaterLevel = function(currentTop, fx){ 
      if(fx.prop == "top") {        
        currentWaterPos = currentTop;
        var h = waterLevel - currentTop - parseInt($('#submarine').css('marginTop'));        
        h = (h<0) ? 0 : (h>84) ? 84 : h;        
        $('#submarine-object-above').css('height', h + 'px');
      }
    }
        
    submarine.showBubbles = function(){
      //stop floating animation for performance
      $('#submarine').stop();
      
      //show bubbles and animate them back out, also restart the floating
      $('#bubbles').stop(true,false).animate({opacity:1},200,'easeOutExpo').animate({opacity:0},{duration:400,easing:'easeOutQuint',complete: function(){submarine.floatMyBoat()}});

      
    }        

    // INIT
    init();

    return submarine;
  }

})(jQuery);