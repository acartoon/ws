//инициализация открытия модальных окон
$('[data-toggle="modal"]').on('click', function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var modal = $(this).attr('data-target');
    // debugger
    onOpenPopup({
        src: '#' + modal,
        type: 'inline',
        closeBtnInside: true,
        showCloseBtn: true,
        closePopup: function () {
            $('.modal').on('click', '.js-modal-close', onBtnCloseClick);
        },
    });
})

//инициализация селектов
initSelect2();