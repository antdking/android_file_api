function fetch_data(location){
    var client = new XMLHttpRequest();
    client.open('GET', location, false);
    client.setRequestHeader("Content-Type", 'application/json');
    client.send(null);
    return JSON.parse(client.responseText);
}

onmessage = function(event) {
    var data = event.data;
    var id = data['id'];
    var location = data['location'];
    var target = data['target'];
    var is_device = data['device'];
    var badge = data['badge'];
    var items = fetch_data(location);
    for (var i=0; i < items.length; i++) {
        var sidebar = '<a href="#"';
        sidebar += 'class="list-group-item btn ' + id + '"';
        var amount = fetch_data(location + items[i]['id'] + '/count/?q=' + badge)['total_' + badge];
        if (is_device) {
            var extra = fetch_data(location + items[i]['id']);
            sidebar += 'rel="hover-pop" data-content="' + extra['manufacturer'] + ' ' + extra['full_name'] + '"';
            sidebar += 'data-original-title title'
        }
        sidebar += '>';
        sidebar += items[i][target];
        sidebar += '<span class="badge">' + amount + '</span>';
        sidebar += '</a>';
        self.postMessage(sidebar);
    }
}