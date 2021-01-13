var mainNav = $('.main-nav');


$('.burger').on('click', function () {
   $(this).toggleClass('open');
    mainNav.toggleClass('show');
    onOverflow();
});