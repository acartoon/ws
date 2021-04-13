// слайдер для навигации на slick slider
function initSlickSideNav() {
    $('[data-slider="side-nav"]').slick({
        variableWidth: true,
        arrows: false,
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 1023,
                settings: "unslick",
            }
        ]
    });
}


function initSwiperSlideNav(container) {
    var swiper = new Swiper(container, {
        slidesPerView: 'auto',
        navigation: {
            nextEl: '.slider-btn-nav--next',
            prevEl: '.slider-btn-nav--prev',
        }

    });
}

function renderSlider() {
    var  sideNav = $('[data-slider="side-nav"]');
    var windowWidth = $(window).width();
    var swiper = false;
    if(sideNav.length && windowWidth < 1024) {
        initSwiperSlideNav(sideNav[0])
    } else {
        if(!swiper) return;
        swiper.destroy();
    }

}

$(document).ready(function(){
    renderSlider();
});

$(window).resize(function () {

})