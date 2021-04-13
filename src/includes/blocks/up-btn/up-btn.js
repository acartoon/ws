function initUpBtn() {
    var upBtn = $('.js-up-btn');
    if(upBtn.lengt) return;

    upBtn.on('click', function () {
        $("body,html").stop().animate({
            scrollTop: 0
        }, 800);
        upBtn.css('opacity', '0');
    });

    $(window).on('scroll', function () {
        if ($(window).scrollTop() > $(window).height()) {
            upBtn.css('opacity', '1');
        } else {
            upBtn.css('opacity', '0');
        }
    });

}

initUpBtn();