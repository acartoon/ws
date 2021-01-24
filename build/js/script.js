/*******
 *
 * переключает класс overflow у body
 *
 * *******/

function onOverflow() {
    $('body').toggleClass('overflow')
}

var dataType = {
    TEL: 'tel',
    EMAIL: 'email',
    TEXT: 'text'
}

/*******
 *
 * функция принимает 2 параметра
 * form - форма
 * params - объект с настройками для проверки
 * поля валидируются по атрибутам required и params.attr

 * тип поля проверяется по атрибуту params.attr
 * класс ошибки поля params.errorClass
 * поле для ошибки атрибут params.attrError
 *
 * *******/


function validateForm(form) {
    var validate = {
        errorClass: 'form-input--error',
        input: null,
        attr: 'data-type',
        attrError: 'data-field-error',
        arrayInput: [],
        errors: {
            TEXT: 'Введите Ваше имя',
            TEL: 'Введите корректный номер',
            DEFAULT: 'Заполните поле',
            EMAIL: 'Неверный формат почты',
        },
        form: form,
        isSubmitForm: function () {
            var that = this;
            var isValid = true;
            this.input.each(function () {
                var $this = $(this);
                isValid = isValid && that.isValidValue($this);
            });

            return isValid;
        },

        checkAllError: function() {
            var that = this;
            this.input.each(function () {
                var $this = $(this);
                var parent = $this.parent();
                that.checkError($this, parent);
            });
        },

        checkError: function(input, parent) {
            var typeData = input.attr(this.attr);

            switch (this.isValidValue(input)) {
                case true:
                    this.hideError(parent);
                    break;
                case false:
                    this.showError(parent, typeData);
            }
        },

        hideError: function (parent) {
            parent.removeClass(this.errorClass);
        },

        showError: function(parent, typeData) {
            var errorTextContainer = parent.find('[' + this.attrError + ']');
            var errorText;

            switch (typeData) {
                case dataType.TEL:
                    errorText = this.errors.TEL;
                    break;
                case dataType.TEXT:
                    errorText = this.errors.TEXT;
                    break
                case dataType.EMAIL:
                    errorText = this.errors.EMAIL;
                    break
            };
            errorTextContainer.text(errorText);
            parent.addClass(this.errorClass);
        },

        watch: function (input, parent) {
            var that = this;
            input.on('blur', function () {
                var value = $(this).val();
                if(value == '') return;
                that.checkError($(this), parent);
            });
            input.on('input', function () {
                that.hideError(parent);
            });
        },

        addMaskTel: function() {
            this.formTel = form.find('input[' + this.attr + '="tel"]').inputmask({
                mask: "8 (999) 999 99 99",
                placeholder: "_",
                showMaskOnHover: false
            });
        },
        addMaskEmail: function () {
            this.formEmail = form.find('input[' + this.attr + '="email"]');
            this.formEmail.inputmask('email', {
                // mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
                placeholder: "",
            });
        },
        isValidEmail(address) {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            return reg.test(address) == true;
        },

        isValidValue: function (input) {
            var value;
            var typeData = input.attr(this.attr);

            var isValid = false;
            switch (typeData) {
                case 'tel':
                    value = input.inputmask('unmaskedvalue');
                    isValid = (value.length == 10);
                    break;
                case 'text':
                    value = input.val();
                    isValid = (value !== '');
                    break;
                case 'email':
                    value = input.val();
                    isValid = this.isValidEmail(value);
                    break;
            };

            return isValid;

        },

        init: function () {
            var that = this;
            this.input = this.form.find('input['+ this.attr +'][required]');

            this.addMaskTel();
            this.addMaskEmail();

            this.input.each(function () {
                var input = {};
                input.input = $(this);
                input.parent = $(this).parent();
                input.type = $(this).attr(that.attr);
                that.arrayInput.push(input);
                that.watch(input.input, input.parent);
            });
        }
    }

    return validate;
};

/**
* отправляет аякс запрос
* @param {params} параметры запроса
*
* */

function onSendAjax(params) {
    $.ajax({
        type: params.type,
        url: params.url,
        dataType: params.url,
        data: params.data,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
         // при интеграции нужно перенести сюда функцию из complete
         //    params.onSuccess(data);
        },
        error: function (data) {
            // params.onError();
        },
        complete: function () {
            params.onSuccess();
        }
    });
}

/**
 * закрывает попап
 * */

function closePopup() {
    $.magnificPopup.close();
    onOverflow();
}

function onBtnCloseClick() {
    closePopup();
    $('#id-success-form').off('click', '.js-modal-close', onBtnCloseClick);
}

/**
 * открывает magnificPopup
 * @param {params} параметры попапа
 *
 * */

function onOpenPopup(params) {
    $.magnificPopup.open({
        items: {
            src: params.src
        },
        callbacks: {
            open: function () {
                params.closePopup();
            },
        },
        type: params.type,
        closeBtnInside: params.showCloseBtn,
        showCloseBtn: params.showCloseBtn
    });

}

/**
 * открывает попап успешной отправки формы
 * */

function openSuccessFormPopup() {
    onOpenPopup({
        src: '#id-success-form',
        type: 'inline',
        closeBtnInside: true,
        showCloseBtn: true,
        closePopup: function () {
            $('#id-success-form').on('click', '.js-modal-close', onBtnCloseClick);
        },
    });

}

/**
 * открывает попап неуспешной отправки формы
 * */

function openErrorFormPopup() {
    onOpenPopup({
        src: '#id-error-form',
        type: 'inline',
        closeBtnInside: true,
        showCloseBtn: true,
        closePopup: function () {
            onBtnCloseClick();
        },
    })

}

/**
 * функция инициализации валидации, отправки формы с обратными уведомлениями
 *
 * @param {formClass} класс формы
 * @param {params} параметры отправки запроса
 *
 * */
function onInitForm(formClass, params) {
    var form = $(formClass);
    var validate = validateForm(form);
    validate.init();

    form.on('click', 'button[type="submit"]', function (evt) {
        evt.preventDefault();
        validate.checkAllError();

        if(!validate.isSubmitForm()) return;

        var paramsAjax = {
            type: 'POST',
            url: params.url,
            dataType: 'json',
            data: form.serializeArray(),
            // при открытии попапов
            onSuccess: function () {
                openSuccessFormPopup();
                form[0].reset();
                onOverflow();
            },
            onError: function () {
                openErrorFormPopup();
                form[0].reset();
                onOverflow();
            },
        }

        onSendAjax(paramsAjax);
    });
}
// side-nav

$(document).ready(function(){

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
});
var mainNav = $('.main-nav');


$('.burger').on('click', function () {
   $(this).toggleClass('open');
    mainNav.toggleClass('show');
    onOverflow();
});
// инициализация карты на странице контакты
// ****************************************

// MAP
if ($('#map').length) {
    var initMap = function () {

        var styles = [
            {
                featureType: "all",
                stylers: [
                    {lightness: -5},
                    {saturation: -180}
                ]
            }
        ];

        var coordsCenter,
            zoomIndex = 17;
        //координаты точки
        // var coordsPoint = new google.maps.LatLng(47.23884047334204,39.689946322623854);
        var coordsPoint = new google.maps.LatLng(47.274529, 39.687058);
        //координаты центра
        // if (device.mobile() || device.tablet() || $(window).width() <= 1024) {
        if ($(window).width() <= 1024) {
            // coordsCenter = new google.maps.LatLng(47.2745294,39.689946322623854);
            coordsCenter = new google.maps.LatLng(47.274529, 39.687058);
        } else {
            // coordsCenter = new google.maps.LatLng(47.23961170751326,39.69302310318248);
            coordsCenter = new google.maps.LatLng(47.274529, 39.687058);
        }

        function toggleDrag() {
            // if (device.mobile() || device.tablet()) {
            //     return false;
            // }
            return true;
        }

        var mapProp = {
            center: coordsCenter,
            addres: coordsPoint,
            zoom: zoomIndex,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: styles,
            scrollwheel: false,
            panControl: false,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            overviewMapControl: false,
            draggable: toggleDrag()
        };


        var map = new google.maps.Map(document.getElementById("map"), mapProp);

        //added
        var marker = new google.maps.Marker({

            // Определяем позицию маркера
            position: {lat: 47.274529, lng: 39.687058},

            // Указываем на какой карте он должен появиться.
            map: map,

            // Пишем название маркера - появится если навести на него курсор и немного подождать
            // title: 'Work Solutions',

            // Укажем свою иконку для маркера
            icon: 'i/marker.png'
        });

        // Создаем наполнение для информационного окна
        var contentString = "<div class=\"map-pin\">\n" +
            "                <div class=\"map-pin__in\">\n" +
            "                  <div class=\"map-pin__time\">9:00 — 18:00</div>\n" +
            "                  <div class=\"map-pin__text\">по рабочим дням</div><a class=\"map-pin__link\" href=\"mailto:info@wssupport.ru\">info@wssupport.ru</a><a class=\"map-pin__link\" href=\"tel:88633226025\">8 (863) 322-60-25</a>\n" +
            "                </div>\n" +
            "              </div>";

        // Создаем информационное окно
        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 400
        });

        infowindow.open(map, marker);
    };

    google.maps.event.addDomListener(window, 'load', initMap);


    var resizeTimer;

    $(window).on('resize', function (e) {

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {

            initMap();

        }, 250);

    });

}

// функция отправки формы на странице кейсов
onInitForm('.js-form-cases', {
    url: '',
});

// функция отправки формы на странице кейсов
onInitForm('.js-form-contacts', {
    url: '',
});



// функция отправки формы на странице кейсов
onInitForm('.js-form-partners', {
    url: '',
});

// функция отправки формы на странице кейсов
onInitForm('.js-form-questions', {
    url: '',
});

$("#dropzone").dropzone({
    url: "post",
    maxFiles: 4,
    maxFilesize: 256,
    chunkSize: false,
    addRemoveLinks: true,
    acceptedFiles: 'image/*',
    previewTemplate: document.querySelector('#dropzone-template-container').innerHTML,
    previewsContainer: '.dropzone-block__files',
    createImageThumbnails: false,
});
// удалить при интеграции
// как пример для активного элемента списка

$('.site-nav__link').on('click', function () {
    $(this).toggleClass('site-nav__link--active');
})
