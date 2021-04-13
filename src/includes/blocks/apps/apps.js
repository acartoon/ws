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