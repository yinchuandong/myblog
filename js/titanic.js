var submarine;
var oldScroll = 0;
var waypoints = [0, 650, 1650, 2050, 2650, 9999];
var currentZone = 0;
var zone;
var pos;
var wasDown = true;


function anim() {
  // determine percentage of page that has been scrolled down
  var offset = $(document).scrollTop();
  var windowHeight = $(window).height();
  var docHeight = $(document).height(); 
  
  // on smaller screens we need to offset the submarine's fixed container so it only shows when scrolled down
  if(offset < ((560 + 83) - (windowHeight - 100))) {
    $('#submarine-container').css('top', -offset * 0.54 + 'px');    
  }
  
  // reset the pinned submarine
  $('#submarine').css('top', 560 + 'px');
  
  // calculate the position (in relation to the content)
  pos = parseInt($('#submarine').css('top')) + parseInt($('#submarine-container').css('top')) + offset;
  
  // calculate the position (in relation to the midground / water)
  var waterpos = parseInt($('#submarine').css('top')) + parseInt($('#submarine-container').css('top')) - parseInt($('#bg-midground').css('top'));
  
  // pin the submarine when scrolled all the way down
  if(pos >= 3900) {
    var spos = 3900 - parseInt($('#submarine-container').css('top')) - offset
    $('#submarine').css('top', spos + 'px');
    return;
  }
    
  // calculate the sine path
  submarine.adjustSubmarineHorizontal(pos);
  
  // adjust the water level
  submarine.updateWaterLevel(waterpos, {prop : 'top'});

  // check direction
  isDown = pos > oldScroll;
  var dif = pos - oldScroll;
  oldScroll = pos;
  
  // turn around the submarine when changing direction
  if(wasDown != isDown && pos<3150) {
    submarine.turnDir((submarine.dir == "left") ? "right" : "left");
  }
  wasDown = isDown;

  // when moving show bubbles (they fade out automatically)
  if((dif > 1 || dif < -1) && pos > (1300)) {
    submarine.showBubbles();
  }
  
  // check what zone we are in
  for(var i = currentZone - 1; i < waypoints.length; i++) {
    if(offset < waypoints[i]) {
      zone = i;
      break;
    }
  }
  
  // if changed zone take action
  if(currentZone != zone) {
    currentZone = zone;
    var m = (isDown) ? waypoints[currentZone - 1] : waypoints[currentZone];
    switch(m) {
      case 0:
        submarine.turnDir('right');
        break;
      case 650:
        submarine.turnDir('left');

        break;
      case 1650:
        submarine.turnDir('right');
        break;
      case 2050:
        submarine.turnLights(((isDown) ? "on" : "off"));
        break;
      case 2650:
        submarine.turnDir('left');
        break;
    }   
  }

  
}




$(function() {
 
  
  // submarine
  submarine = $.submarine({ el:'#submarine'});


  // add parallax layers
  $('#bg-foreground').scrollingParallax({ staticSpeed : .54 });    
  
  $('#bg-midground').scrollingParallax({
    staticSpeed : .54,   
    disableIE6Animation : false
  });  
  
  $('#bg-background').scrollingParallax({
    staticSpeed : .45,   
    disableIE6Animation : false
  });  
 
 
  // add scrollorama layers  
  var scrollorama = $.scrollorama({
    enablePin : false,
    blocks : '.scrollblock'
  });
  
  scrollorama.animate('#fish1', {
    duration : 1800,
    property : 'left',
    start : -200,
    end : 960
  });
  scrollorama.animate('#fish1a', {
    duration : 3500,
    property : 'left',
    start : -300,
    end : 950
  });  
  scrollorama.animate('#fish1b', {
    duration : 1800,
    property : 'left',
    start : -300,
    end : 900
  });
  
  
  scrollorama.animate('#fish5', {
    duration : 1800,
    property : 'left',
    start : 800,
    end : 400
  });  
  scrollorama.animate('#fish5', {
    duration : 1800,
    property : 'top',
    start : 570,
    end : 300
  });
  
  
  scrollorama.animate('#fish2', {
    duration : 1000,
    property : 'left',
    start : 850,
    end : 450
  });  
  scrollorama.animate('#fish3', {
    duration : 700,
    property : 'left',
    start : 650,
    end : 530
  });
  scrollorama.animate('#fish3', {
    duration : 700,
    property : 'top',
    start : -80,
    end : 40
  });
  scrollorama.animate('#fish4', {
    duration : 800,
    property : 'left',
    start : 270,
    end : 700
  });
  scrollorama.animate('#fish-large1', {
    duration : 2000,
    property : 'left',
    start : 700,
    end : 0
  });
  
  scrollorama.animate('#fish-large2', {
    duration : 3000,
    property : 'left',
    start : 0,
    end : 1000
  });
  
  scrollorama.animate('#fish-large2', {
    duration : 3000,
    property : 'top',
    start : 600,
    end : -200
  });
  
  // add a smooth mousewheel
  $('body').mousewheel(function(event, delta) {    
    $.scrollTo.window().queue([]).stop();
    if (delta < 0) {
      $('body').stop().scrollTo('+=100', 500);
    } else
      $('body').stop().scrollTo('-=100', 500);

    return false;
  });
  
  // add a scroll reaction    
  $(window).scroll(anim); 
  anim();
  
  // add the slideshow carousel
  $('.slideshow-container').anythingSlider({   
    resizeContents      : true,     
    autoPlay            : false,    
    buildArrows         : true,     
    buildNavigation     : false,
    easing              : "easeOutExpo"
  });
   
  
  // add colorbox (video and form)
  $(".open-form").colorbox({iframe:true, width:"610px", height:"810px"});
  $(".country-nl .open-form").colorbox({iframe:true, width:"610px", height:"780px"});
  $(".youtube-colorbox").colorbox({iframe:true, innerWidth:495, innerHeight:364, 
    onOpen: function(){$("#cboxOverlay, #colorbox").addClass("colorbox-youtube");},
    onClosed:function(){$("#cboxOverlay, #colorbox").removeClass("colorbox-youtube");}});
  $(".extra-info").colorbox({iframe:true, innerWidth:890, innerHeight:335, 
    onOpen: function(){$("#cboxOverlay, #colorbox").addClass("colorbox-youtube");},
    onClosed:function(){$("#cboxOverlay, #colorbox").removeClass("colorbox-youtube");}});
  
  $(".open-form").attr("href",  $(".open-form").attr("href") + '?jr=' + new Date().getTime() );
  $(".open-form").click(function(){
    var old_href = $(".open-form").attr("href");
    var n = old_href.indexOf('?');
    old_href = old_href.substring(0, n != -1 ? n : s.length);
    $(".open-form").attr("href",  old_href + '?jr=' + new Date().getTime() );
  });
  
  // add a quick nav next arrow
  $(".nextArrow").click(function(e){      
    var link = $(e.currentTarget).attr("href");
    $.scrollTo.window().queue([]).stop();
    $('body').stop().scrollTo($(link), 1500, {easing:'easeOutQuad'});
    
    e.preventDefault();
    e.stopPropagation();
  });
  
  

  // add some audio swf  
  var fo = new SWFObject("img/audio.swf", "audio", "0", "0", "8.0.15", "#ffffff", false); 
  fo.addParam("quality", "low")
  fo.write("audio");

  
});