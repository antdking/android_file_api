function fetch_data(location){
    var client = new XMLHttpRequest();
    client.open('GET', location, false);
    client.setRequestHeader("Content-Type", 'application/json');
    client.send(null);
    return JSON.parse(client.responseText);
}