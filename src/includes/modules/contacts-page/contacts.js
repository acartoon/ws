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
