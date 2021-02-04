//открытие модальных окон

$('[data-toggle="modal"]').on('click', function (evt) {
    evt.preventDefault();
    var modal = $(this).attr('data-target');
    onOpenPopup({
        src: '#' + modal,
        type: 'inline',
        closeBtnInside: true,
        showCloseBtn: true,
        closePopup: function () {
            $('#id-success-form').on('click', '.js-modal-close', onBtnCloseClick);
            $('#id-error-form').on('click', '.js-modal-close', onBtnCloseClick);
        },
    });

})