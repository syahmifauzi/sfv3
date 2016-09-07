function goBack() {
  window.history.back();
}
function goForward() {
  window.history.forward();
}


$(document).ready(function() {

  $(window).scroll(function() {
    onScroll();
  });


  // Active Nav on Scroll
  function onScroll() {
    var scrollPos = $(document).scrollTop(),
        links      = $('.nav-wrapper-left ul li a');

    $(links).each(function () {
      var currLink   = $(this),
          refElement = $(currLink.attr("href")),
          refElePos  = refElement.position().top;

      if (refElePos <= scrollPos && refElePos + refElement.height() > scrollPos) {
          $(links).removeClass('active').removeAttr('class');
            currLink.addClass('active');
      }
    });
  }


  // Smooth Scroll Up Down
  smoothScroll(400);
  function smoothScroll (duration) {
    $('a[href^="#"]').on('click', function(event) {

      var target = $( $(this).attr('href') );

      if (target.length) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top + 5 // add extra length
        }, duration);
      }
    });
  }


  // LazyloadJS
  $('img.product-img').show().lazyload({
    effect: "fadeIn",
    // effectspeed: 600
  });


  // off canvas on-off
  $('#offCanvasToggler').on('click', function() {
    $('#header .header-wrapper-mobile').add('#sf-content').add('#wideToggler').toggleClass('active');
    $('#offCanvasToggler').toggleClass('is-open');
  });
  $('#wideToggler').add('.header-wrapper-mobile ul li a').on('click', function() {
    $('#header .header-wrapper-mobile').add('#sf-content').add('#wideToggler').removeClass('active');
    $('#offCanvasToggler').removeClass('is-open');
  });


});
