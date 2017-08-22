$(function() {
  var timeout = null,
      logo = $('.navbar#top'),
      content = $('#page-content'),
      scrollToTop = $('#scroll-to-top'),
      className = 'scrolled-top';

  var scrolledTop = function () {
    if (!timeout) {
      timeout = setTimeout(function () {
        clearTimeout(timeout);
        timeout = null;
        if ($(window).scrollTop() > 0) {
          logo.removeClass(className);
          content.removeClass(className);
          scrollToTop.removeClass(className);
        }
        else {
          logo.addClass(className);
          content.addClass(className);
          scrollToTop.addClass(className);
        }
      }, 100);
    }
  };

  // Lancement de la fonction au chargement de la page
  scrolledTop();

  // Redimensionnement du logo lors du scroll
  // La fonction s'exécute 100ms après la détection du scroll
  $(window).scroll(scrolledTop);


  // Scroll to position
  $('#ranking-by-field-of-study').on('click', function(e) {
    $('html,body').animate({
        scrollTop: $(".rankings").offset().top - 300},
        'slow');

    $(".ranking").addClass("highlighted").delay(800).queue(function(next){
        $(this).removeClass("highlighted");
        next();
    });

    e.preventDefault();
  });

  // Scroll to top
  $('#scroll-to-top').on('click', function(e) {
    $('html,body').animate({
        scrollTop: 0},
        'slow');
  });

  // Search : Clic sur la loupe déclenche le focus sur l'input
  $('form.search-form').on('click', function() {
    $(this).find('input').focus();
  });
});
