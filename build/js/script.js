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
        isValidEmail: function(address) {
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
    $('#id-error-form').off('click', '.js-modal-close', onBtnCloseClick);
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

                if(params.closePopup) {
                    params.closePopup();
                }
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
//
// function changeUrl(link) {
//     history.pushState(null, null, link);
// }
var mainNav = $('.main-nav');


$('.burger').on('click', function () {
   $(this).toggleClass('open');
    mainNav.toggleClass('show');
    onOverflow();
});
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
function getCoord(e) {
    console.log(e.pageX)
    var canv = $('#ticket-canvas');
    var offset = canv.offset();

    var x = e.pageX || e.touches[0].pageX;
    var y = e.pageY || e.touches[0].pageY;


    return {
        x: -(offset.left - x),
        y: -(offset.top - y)
    };
}

function _renderCanvasTicket() {
    var container = $('#ticket-container');
    var canv = $('#ticket-canvas');
    var _canv = $('#ticket-canvas')[0];
    var ctx = _canv.getContext('2d');
    var lastPoint;
    ctx.fillStyle = 'transparent';
    // задала размеры канваса
    _canv.width = container.width();
    _canv.height = container.height();
    var smallScreen = window.outerWidth < 480;
    var brushOffsetX = smallScreen ? -Math.floor((392 - (window.outerWidth - 84)) / 2) : 0;
    var heightImg = smallScreen ? 112 : 88;
    var image = new Image();
    // image.src = 'data:image/jpeg;base64,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';
    image.src = 'data:image/png;base64,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';
    image.onload = function() {
        ctx.drawImage(image, brushOffsetX, 0, 392, heightImg);
    };

    var brush = new Image();
    brush.src = 'data:image/png;base64,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';


    var isMouseDown = false;

    ctx.lineWidth = 5 * 2;

    function distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    function angleBetween(point1, point2) {
        return Math.atan2( point2.x - point1.x, point2.y - point1.y );
    }

    function onMousedown(e) {
        isMouseDown = true;
        lastPoint = getCoord(e);
    }

    function onMouseup() {
        isMouseDown = false;
        ctx.beginPath();
    }
    function mousemove(e) {
        if(!isMouseDown) return;

        e.preventDefault();

        var currentPoint = getCoord(e);
        var  dist = distanceBetween(lastPoint, currentPoint);
        var  angle = angleBetween(lastPoint, currentPoint);
        var x;
        var y;

        for (var i = 0; i < dist; i++) {
            x = lastPoint.x + (Math.sin(angle) * i) - 25;
            y = lastPoint.y + (Math.cos(angle) * i) - 25;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.drawImage(brush, x, y);
        }
        lastPoint = currentPoint;

        $('#ticketLink').removeClass('hidden-default')

    }

    canv.on('mousedown', onMousedown);
    canv.on('touchstart', onMousedown);

    canv.on('mouseup', onMouseup);
    canv.on('touchend', onMouseup);

    canv.on('mousemove', mousemove);
    canv.on('touchmove', mousemove);

}

_renderCanvasTicket();

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
            // icon: 'i/marker.png'
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

if($("#dropzone").length) {
    initDropzone({
        el: $("#dropzone"),
        maxFiles: false,
        maxFilesize: 256,
        previewTemplate: $('#dropzone-template-container').html(),
        previewsContainer: '.dropzone-block__files'

    })
}

// функция отправки формы на странице кейсов
onInitForm('.js-form-authorization', {
    url: '',
});

// функция отправки формы на странице кейсов
onInitForm('.js-form-callback', {
    url: '',
});

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

// удалить при интеграции
// как пример для активного элемента списка

$('.site-nav__link').on('click', function () {
    $(this).toggleClass('site-nav__link--active');
})
function initDropzone(params) {
    params.el.dropzone({
        url: "post",
        maxFiles: params.maxFiles,
        maxFilesize: params.maxFilesize,
        chunkSize: false,
        addRemoveLinks: true,
        acceptedFiles: 'image/*',
        previewTemplate: params.previewTemplate,
        previewsContainer: params.previewsContainer,
        createImageThumbnails: false,
    });

    // $("#dropzone").dropzone({
    //     url: "post",
    //     maxFiles: 4,
    //     maxFilesize: 256,
    //     chunkSize: false,
    //     addRemoveLinks: true,
    //     acceptedFiles: 'image/*',
    //     previewTemplate: document.querySelector('#dropzone-template-container').innerHTML,
    //     previewsContainer: '.dropzone-block__files',
    //     createImageThumbnails: false,
    // });
}

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