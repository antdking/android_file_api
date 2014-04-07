function fetch_data(location){
    var client = new XMLHttpRequest();
    client.open('GET', location, false);
    client.setRequestHeader("Content-Type", 'application/json');
    client.send(null);
    return JSON.parse(client.responseText);
}

function build_data(location, use_device) {
    var sub_data = [];
    var pks = fetch_data(location);
    for (var i=0; i < pks.length; i++) {
        sub_data[i] = [];
        var main = fetch_data(location + pks[i]["id"] + "/");
        var developer = fetch_data('/api/developers/' + main["developer"] + '/?limited=y')['username'];
        if (use_device) {
            var device = fetch_data('/api/devices/' + main["device"] + '/?limited=y')['code_name'];
        }
        console.log(main['url']);
        sub_data[i]["url"] = main["url"];
        sub_data[i]["name"] = main["name"];
        sub_data[i]["date"] = main["date"];
        sub_data[i]["developer"] = developer;
        if (use_device) {
            sub_data[i]["device"] = device;
        }
    }
    return sub_data;

}

onmessage = function(event) {
    var data = event.data;
    var id = data['id'];
    var location = data['location'];
    var use_device = data['device'];
    if (typeof(main_data) === "undefined") {
        var main_data = [];
    }
    if (typeof(main_data[id]) === "undefined") {
        main_data[id] = build_data(location, use_device);
    }
    for (var i=0; i < main_data[id].length; i++) {
        var table = '<tr class="clickableRow hide ' + id + '" href="' + main_data[id][i]['url'] + '">';
        table += '<td>' + main_data[id][i]['name'] + '</td>';
        table += '<td>' + main_data[id][i]["developer"] + '</td>';
        if (use_device) {
            table += '<td>' + main_data[id][i]["device"] + '</td>';
        }
        table += '<td>' + main_data[id][i]['url'] + '</td>';
        table += '<td>' + main_data[id][i]['date'] + '</td>';
        table += '</tr>';
        self.postMessage(table);
    }
    self.close();
}