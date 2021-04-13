var modelData = {
    regions: [
        {region: "Московская область", code: "50", counterClients: 63},
        {region: "Ростовская область", code: "61", counterClients: 24},
        {region: "Краснодарский край", code: "23", counterClients: 7},
        {region: "Ленинградская область", code: "47", counterClients: 10},
        {region: "Орловская область", code: "57", counterClients: 2},
        {region: "Рязанская область", code: "62", counterClients: 2},
        {region: "Карелия Республика", code: "10", counterClients: 1},
        {region: "Курская область", code: "46", counterClients: 1},
        {region: "Нижегородская область", code: "52", counterClients: 1},
        {region: "Красноярский край", code: "24", counterClients: 1},
        {region: "Челябинская область", code: "74", counterClients: 3},
        {region: "Татарстан (Татарстан) Республика ", code: "16", counterClients: 2},
        {region: "Башкортостан Республика", code: "2", counterClients: 2},
        {region: "Волгоградская область", code: "34", counterClients: 1},
        {region: "Смоленская область", code: "67", counterClients: 2},
        {region: "Ярославская область", code: "76", counterClients: 1},
        {region: "Свердловская область", code: "66", counterClients: 3},
        {region: "Кемеровская область", code: "42", counterClients: 2},
        {region: "Самарская область", code: "63", counterClients: 1},
        {region: "Новосибирская область", code: "54", counterClients: 5},
        {region: "Владимирская область", code: "33", counterClients: 1},
        {region: "Воронежская область", code: "36", counterClients: 1},
        {region: "Алтай Республика", code: "4", counterClients: 1},
        {region: "Омская область", code: "55", counterClients: 1},
        {region: "Амурская область", code: "28", counterClients: 1},
        {region: "Пермский край", code: "59", counterClients: 2},
        {region: "Саратовская область", code: "64", counterClients: 2},
        {region: "Удмуртская Республика", code: "18", counterClients: 1},
        {region: "Чувашская Республика - Чувашия", code: "21", counterClients: 1},
        {region: "Приморский край", code: "25", counterClients: 1},
        {region: "Новгородская область", code: "53", counterClients: 1},
        {region: "Белгородская область", code: "31", counterClients: 1},
        {region: "Дагестан Республика", code: "5", counterClients: 1},
        {region: "Архангельская область", code: "29", counterClients: 1},
        {region: "Ставропольский край", code: "26", counterClients: 1},
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
