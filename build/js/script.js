/*******
 *
 * переключает класс overflow у body
 *
 * *******/

function onOverflow() {
    $('body').toggleClass('overflow')
}

function onOverflowMob() {
    $('body').toggleClass('overflow-mob')
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

        addResizeTextArea: function() {
            var textarea = form.find('[' + this.attr + '="textarea"]');
            autosize(textarea);
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
            this.addResizeTextArea();

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
                onOverflowMob();
                if(params.closePopup) {
                    params.closePopup();
                }
            },
            beforeClose: function () {
                onOverflowMob();
            },
            afterClose: function () {
                if(params.afterClose) {
                    params.afterClose();
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
 * @param {formClass} класс формы
 * @param {params} параметры отправки запроса
 *
 * */
function onInitForm(formClass, params) {
    var form = $(formClass);
    if (!form.length) return;

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
                onOverflowMob();
            },
            onError: function () {
                openErrorFormPopup();
                form[0].reset();
                onOverflowMob();
            },
        }

        onSendAjax(paramsAjax);
    });
}

/**
 * плавный скролл до блока
 * принимает id блока до которого нужен скролл
* */
function scrollTo(id) {
    var block = $('#' + id);
    var scrollTop = block.offset().top;

    $('html, body').animate({
        scrollTop: scrollTop
    }, 500);
}

$(document).on('click', '[data-scroll]',function () {
    var idBlock = $(this).attr('data-scroll');
    scrollTo(idBlock)
})


/**
 * init select2
 * */
function initSelect2() {
    var block = $('[data-select]');
    block.select2({
        dropdownParent: $('.select-block'),
        minimumResultsForSearch: -1,
        placeholder: 'Выберете проект',
        width: '100%',
    });
}
$(function () {
    initQrCode();
    function initQrCode() {
        var $qrcode = $('.js-qr');
        if (!$qrcode.length) {
            return;
        }
        $qrcode.each(function () {
            var url = $(this).attr('href');

            $(this).find('.app__qr').qrcode({
                width: 122,
                height: 122,
                text: url
            })
        });
    }
});
var modelData = {
    regions: [
        {region: "���������� �������", code: "50", counterClients: 63},
        {region: "���������� �������", code: "61", counterClients: 24},
        {region: "������������� ����", code: "23", counterClients: 7},
        {region: "������������� �������", code: "47", counterClients: 10},
        {region: "��������� �������", code: "57", counterClients: 2},
        {region: "��������� �������", code: "62", counterClients: 2},
        {region: "������� ����������", code: "10", counterClients: 1},
        {region: "������� �������", code: "46", counterClients: 1},
        {region: "������������� �������", code: "52", counterClients: 1},
        {region: "������������ ����", code: "24", counterClients: 1},
        {region: "����������� �������", code: "74", counterClients: 3},
        {region: "��������� (���������) ���������� ", code: "16", counterClients: 2},
        {region: "������������ ����������", code: "2", counterClients: 2},
        {region: "������������� �������", code: "34", counterClients: 1},
        {region: "���������� �������", code: "67", counterClients: 2},
        {region: "����������� �������", code: "76", counterClients: 1},
        {region: "������������ �������", code: "66", counterClients: 3},
        {region: "����������� �������", code: "42", counterClients: 2},
        {region: "��������� �������", code: "63", counterClients: 1},
        {region: "������������� �������", code: "54", counterClients: 5},
        {region: "������������ �������", code: "33", counterClients: 1},
        {region: "����������� �������", code: "36", counterClients: 1},
        {region: "����� ����������", code: "4", counterClients: 1},
        {region: "������ �������", code: "55", counterClients: 1},
        {region: "�������� �������", code: "28", counterClients: 1},
        {region: "�������� ����", code: "59", counterClients: 2},
        {region: "����������� �������", code: "64", counterClients: 2},
        {region: "���������� ����������", code: "18", counterClients: 1},
        {region: "��������� ���������� - �������", code: "21", counterClients: 1},
        {region: "���������� ����", code: "25", counterClients: 1},
        {region: "������������ �������", code: "53", counterClients: 1},
        {region: "������������ �������", code: "31", counterClients: 1},
        {region: "�������� ����������", code: "5", counterClients: 1},
        {region: "������������� �������", code: "29", counterClients: 1},
        {region: "�������������� ����", code: "26", counterClients: 1},
    ]
}



function renderRegions(modelData) {
    console.log(modelData)
    var objectData = modelData;
    var key;
    for(var keyData in objectData) {
        key = keyData;
    }

    objectData[keyData].forEach(function(objectRegion, index) {
        if(objectRegion.counterClients !== undefined) {
            if(parseInt(objectRegion.counterClients) > 1) {
                const elem = $(".region_" + objectRegion.code.toString());
                elem.children('.svg__circle-big').addClass("visible");
            }
            const elem = $(".region_" + objectRegion.code.toString());
            elem.children('.svg__circle-small').addClass("visible");
        }
    });
}

renderRegions(modelData)

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
function getCoord(e) {
    var canv = $('#ticket-canvas');
    var offset = canv.offset();

    var x = e.pageX || e.touches[0].pageX;
    var y = e.pageY || e.touches[0].pageY;


    return {
        x: -(offset.left - x),
        y: -(offset.top - y)
    };
}

function renderCanvasTicket() {
    var container = $('#ticket-container');
    var canv = $('#ticket-canvas');
    var _canv = $('#ticket-canvas')[0];
    var ctx = _canv.getContext('2d');
    var imageBack = new Image();
    var imageLogo = new Image();
    imageBack.src = 'data:image/png;base64,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';
    imageBack.onload = function() {
        ctx.drawImage(imageBack, brushOffsetX, 0, 392, heightImg);
    };
    imageLogo.src = 'data:image/png;base64,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';
    imageLogo.onload = function() {
        ctx.drawImage(imageLogo, leftLogo, topLogo, 58, 53);
    };

    var lastPoint,
        smallScreen,
        brushOffsetX,
        heightImg,
        leftLogo,
        topLogo;
    var coords = [];

    function render() {
        _canv.width = container.width();
        _canv.height = container.height();
        smallScreen = $(window).width() < 480;
        brushOffsetX = smallScreen ? -Math.floor((392 - ($(window).width() - 84)) / 2) : 0;
        heightImg = smallScreen ? 112 : 88;
        console.log(heightImg)
        leftLogo = (container.width() / 2) - 29;
        topLogo = (container.height() / 2) - 26.5;
        ctx.drawImage(imageBack, brushOffsetX, 0, 392, heightImg);
        ctx.drawImage(imageLogo, leftLogo, topLogo, 58, 53);

    }

    ctx.fillStyle = 'transparent';
    render();

    var brush = new Image();
    brush.src = 'data:image/png;base64,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';

    var isMouseDown = false;

    ctx.lineWidth = 5 * 2;

    function distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    $(window).resize(function () {
        render();

        // сохранение очищения
        function saveClear() {
            coords.forEach(function (item) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.drawImage(brush, item.x, item.y);
            })
        }

        saveClear();
    })

    function angleBetween(point1, point2) {
        return Math.atan2( point2.x - point1.x, point2.y - point1.y );
    }

    function onMousedown(e) {
        isMouseDown = true;
        lastPoint = getCoord(e);
        $('.ticket__content-in')[0].onselectstart = function () {
            $(this).css('cursor', 'default');
            $('.ticket__content-in a').css('cursor', 'default');
            return false;
        };
    }

    function onMouseup() {
        console.log(coords)
        isMouseDown = false;
        ctx.beginPath();
        $('.ticket__content-in').attr('style', false);
        $('.ticket__content-in a').attr('style', false);
        $('.ticket__content-in')[0].onselectstart = function () {
            return true;
        };
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
            coords.push({x:x, y:y});
            ctx.drawImage(brush, x, y);
        }
        lastPoint = currentPoint;

        $('#ticketLink').removeClass('hidden-default')
    }


    canv.on('mousedown', onMousedown);
    canv.on('touchstart', onMousedown);

    canv.on('mouseup', onMouseup);
    $(document).on('mouseup', onMouseup);
    canv.on('touchend', onMouseup);

    canv.on('mousemove', mousemove);
    canv.on('touchmove', mousemove);

}

if($('canvas#ticket-canvas').length) {
    renderCanvasTicket();
}




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
var mainNav = $('.main-nav');


$('.burger').on('click', function () {
   $(this).toggleClass('open');
    mainNav.toggleClass('show');
    onOverflow();
});
// функция отправки формы на странице блога
onInitForm('.js-form-blog', {
    url: '',
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
            // icon: 'i/marker.png'
        });

        // Создаем наполнение для информационного окна
        var contentString = "<div class=\"map-pin\">\n" +
            "                <div class=\"map-pin__in\">\n" +
            "                  <div class=\"map-pin__time\">9:00 — 18:00</div>\n" +
            "                  <div class=\"map-pin__text\">по рабочим дням</div>" +
            "                   <a class=\"map-pin__link\" href=\"tel:88633226025\">8 (863) 322-60-25</a>\n" +
            "                   <a class=\"map-pin__link\" href=\"mailto:info@wssupport.ru\">info@wssupport.ru</a>" +
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

// удалить при интеграции
// как пример для активного элемента списка

$('.site-nav__link').on('click', function () {
    $(this).toggleClass('site-nav__link--active');
})
// функция отправки формы на странице кейсов
onInitForm('.js-form-authorization', {
    url: '',
});

// функция отправки формы на странице кейсов
onInitForm('.js-form-cases', {
    url: '',
});

// функция отправки формы на странице кейсов
onInitForm('.js-form-callback', {
    url: '',
});

// функция отправки формы на странице кейсов
onInitForm('.js-form-contacts', {
    url: '',
});



// функция отправки формы на странице кейсов
onInitForm('.js-form-questions', {
    url: '',
});

// функция отправки формы на странице кейсов
onInitForm('.js-form-new-case', {
    url: '',
});


// функция отправки формы на странице кейсов
onInitForm('.js-form-partners', {
    url: '',
});

// функция отправки формы на странице кейсов
onInitForm('.js-form-sale', {
    url: '',
});

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