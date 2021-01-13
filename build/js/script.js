var paramsValidate = {
    errorClass: 'form-input--error',
    attr: 'data-type',
    attrError: 'data-field-error',
    errors: {
        TEXT: 'Введите Ваше имя',
        TEL: 'Введите корректный номер',
        DEFAULT: 'Заполните поле',
        EMAIL: 'Неверный формат почты',
    },
}

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


function validateForm(form, params) {
    console.log(params)
    var validate = {
        errorClass: params.errorClass,
        input: null,
        attr: params.attr,
        attrError: params.attrError,
        arrayInput: [],
        errors: params.errors,
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
            params.onSuccess(data);
        },
        error: function (data) {
            params.onError();
        },
        complete: function () {
            params.onSuccess();
        }
    });
}

/**
 * закрывает попап
 * */

function onClosePopup() {
    $.magnificPopup.close();
    onOverflow();
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
            close: function () {
                params.removeListener();
            }
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
            $('#id-success-form').on('click', '.js-modal-close', onClosePopup);
        },
        removeListener() {
            $('#id-success-form').off('click', '.js-modal-close', onClosePopup);
        }
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
            $('#id-error-form').on('click', '.js-modal-close', onClosePopup);
        },
        removeListener() {
            $('#id-error-form').off('click', '.js-modal-close', onClosePopup);
        }
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
    var validate = validateForm(form, paramsValidate);
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
var mainNav = $('.main-nav');


$('.burger').on('click', function () {
   $(this).toggleClass('open');
    mainNav.toggleClass('show');
    onOverflow();
});
// функция отправки формы на странице кейсов
onInitForm('.js-form-cases', {
    url: '',
});


// удалить при интеграции
// как пример для активного элемента списка

$('.site-nav__link').on('click', function () {
    $(this).toggleClass('site-nav__link--active');
})
