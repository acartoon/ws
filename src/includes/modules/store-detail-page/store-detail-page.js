function openModalSelectProject() {
    $('[data-toggle="modal-add-case"]').on('click', function (evt) {
        $.magnificPopup.close();
        evt.preventDefault();
        evt.stopPropagation();

        onOpenPopup({
            src: '#select-project',
            type: 'inline',
            closeBtnInside: true,
            showCloseBtn: true,
            closePopup: function () {
                $('.modal').on('click', '.js-modal-close', onBtnCloseClick);
            },
            afterClose: function () {
                $('.select-block').removeClass('select-block--error');
            },
        });
    })
}

function submitFormSelectProject(evt) {
    evt.preventDefault();
    var selectedOption = $('.js-form-select-project option:selected').attr('val');

    // удаляю ошибку при выборе проекта
    $('[data-select]').on("select2:select", function (e) {
        $('.select-block').removeClass('select-block--error');
    });

    if(selectedOption == 'placeholder') {
        $('.select-block').addClass('select-block--error');
    } else {

        $('.select-block').removeClass('select-block--error');
        var form = $('.js-form-select-project');

        var paramsAjax = {
            type: 'POST',
            url: '',
            dataType: 'json',
            data: form.serializeArray(),
            // при открытии попапов
            onSuccess: function () {
                onOpenPopup({
                    src: '#success-select-case',
                    type: 'inline',
                    closeBtnInside: true,
                    showCloseBtn: true,
                    closePopup: function () {
                        onBtnCloseClick();
                    },
                })

                form[0].reset();
                onOverflowMob();
            },
            onError: function () {
                openErrorFormPopup();
                form[0].reset();
                onOverflowMob();
            },
        }

        onSendAjax(paramsAjax);
    }
}

openModalSelectProject();

$('.js-form-select-project button[type="submit"]').on('click', submitFormSelectProject);
