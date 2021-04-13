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
