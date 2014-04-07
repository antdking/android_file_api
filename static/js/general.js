/*
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){
                   return pair[1];
               }
       }
       return(false);
}
*/

function fetch_data(url){
    var client = new XMLHttpRequest();
    client.open('GET', url, false);
    client.setRequestHeader("Content-Type", 'application/json');
    client.send(null);
    console.log(client.responseText);
    return JSON.parse(client.responseText);
}

function sidebar_builder(data) {
    var id = data["id"], use_device = data["use_device"];
    var main_data = {},
        info = {
            "developers": {
                "url": "/api/developers/",
                "target": "username",
                "class": id + "_dev",
                "id": "collapse-" + id + "-dev"
            },
            "devices": {
                "url": "/api/devices/",
                "target": "code_name",
                "class": id + "_device",
                "id": "collapse-" + id + "-device"
            },
            "session": "androManSideData",
            "badge": id + "s",
            "use_device": use_device,
            "id": id
        },
        fetch = function(callback) {
            var sub_data = {};
            var badge = info.badge;
            var use_device = info.use_device;
            var developers = fetch_data(info.developers.url);
            var limit = developers.length;
            var devLimit = limit;
            sub_data["dev"] = {};
            if(use_device) {
                var devices = fetch_data(info.devices.url);
                var deviceLimit = devices.length;
                limit = Math.max(devLimit, deviceLimit);
                sub_data["device"] = {};
            }
            var i = 0, busy = false;
            var download = setInterval(function() {
                if(!busy) {
                    busy = true;
                    if(i < devLimit) {
                        sub_data["dev"][i] = {};
                        sub_data["dev"][i]["id"] = developers[i]["id"];
                        sub_data["dev"][i]["target"] = developers[i][info.developers.target];
                        sub_data["dev"][i]["amount"] = fetch_data(info.developers.url + developers[i]['id'] + '/count/?q=' + badge)['total_' + badge];
                    }
                    if (use_device && i < deviceLimit) {
                        sub_data["device"][i] = {};
                        sub_data["device"][i]["id"] = devices[i]["id"];
                        sub_data["device"][i]["target"] = devices[i][info.devices.target];
                        sub_data["device"][i]["amount"] = fetch_data(info.devices.url + devices[i]['id'] + '/count/?q=' + badge)['total_' + badge];
                        sub_data["device"][i]["extra"] = fetch_data(info.devices.url + devices[i]['id']);
                    }
                    if(++i == limit) {
                        clearInterval(download);
                        callback(sub_data);
                    }
                    busy = false;
                }
            }, 50);

        },
        fresh_build = function() {
            var callbackFnc = function(data) {
                main_data[info.id] = data;
                sessionStorage.setItem(info.session, JSON.stringify(main_data));
                build_sidebars();
            };
            fetch(callbackFnc);
        },
        build_sidebars = function() {
            var use_device = info.use_device;
            var dev_data = main_data[info.id]["dev"];
            var limit = Object.keys(dev_data).length;
            var devLimit = limit;
            if(use_device) {
                var device_data = main_data[info.id]["device"];
                var deviceLimit = Object.keys(device_data).length;
                limit = Math.max(devLimit, deviceLimit);
            }
            var i = 0, busy = false;
            var sidebar = '<a href="#" class="list-group-item btn active">All</a>';
            $(".list-group-item").remove();
            $("#" + info.developers.id).append(sidebar);
            $("." + info.developers.class).removeClass(info.developers.class).hide().fadeIn(500);
            if(use_device) {
                $("#" + info.devices.id).append(sidebar);
                $("." + info.devices.class).removeClass(info.devices.class).hide().fadeIn(800);
            }
            var builder = setInterval(function() {
                if(!busy) {
                    busy = true;
                    if(i<devLimit){
                        sidebar = '<a href="#" class="list-group-item btn ';
                        sidebar += dev_data[i]["id"] + '">' + dev_data[i]["target"];
                        sidebar += '<span class="badge">' + dev_data[i]["amount"] + '</span>';
                        sidebar += '</a>';
                        $("#" + info.developers.id).append(sidebar);
                        $("." + info.developers.class).removeClass(info.developers.class).hide().fadeIn(500);
                    }
                    if (use_device && i < deviceLimit) {
                        sidebar = '<a href="#" class="list-group-item btn ';
                        sidebar += 'rel="hover-pop" data-content="' + device_data[i]["extra"]['manufacturer'] + ' ' + device_data[i]["extra"]['full_name'] + '"';
                        sidebar += 'data-original-title title';
                        sidebar += device_data[i]["id"] + '">' + device_data[i]["target"];
                        sidebar += '<span class="badge">' + device_data[i]["amount"] + '</span>';
                        sidebar += '</a>';
                        $("#" + info.devices.id).append(sidebar);
                        $("." + info.devices.class).removeClass(info.devices.class).hide().fadeIn(800);
                    }
                    i++;
                    if(i==limit){
                        clearInterval(builder);
                    }
                    busy = false;
                }

            }, 50);
        },
        init = function() {
            var temp = sessionStorage.getItem(info.session);
            if (temp) {
                main_data = JSON.parse(temp);
            }
            if (typeof(main_data[info.id]) === "undefined") {
                fresh_build();
            } else {
                build_sidebars();
            }
        };
    init();
}

function build_table_data(location, use_device) {
    var sub_data = [];
    var pks = fetch_data(location);
    for (var i=0; i < pks.length; i++) {
        sub_data[i] = [];
        var main = fetch_data(location + pks[i]["id"] + "/");
        var developer = fetch_data('/api/developers/' + main["developer"] + '/?limited=y')['username'];
        if (use_device) {
            var device = fetch_data('/api/devices/' + main["device"] + '/?limited=y')['code_name'];
        }
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

function table_builder(data){
    var id = data['id'];
    var location = data['location'];
    var use_device = data['device'];
    var dom_table = data['table'];
    var main_data = sessionStorage.getItem("androMan_main_data");
    console.log(main_data);
    if (!main_data) {
        main_data = {};
    } else {
        main_data = JSON.parse(main_data);
    }
    if (typeof(main_data[id]) === "undefined") {
        main_data[id] = build_table_data(location, use_device);
        sessionStorage.setItem("androMan_main_data", JSON.stringify(main_data));
    }
    console.log(sessionStorage.getItem("androMan_main_data"));

    var i = 0, limit = main_data[id].length, busy = false;
    var processor = setInterval(function() {
        if(!busy) {
            busy = true;
            var table = '<tr class="clickableRow hide ' + id + '" href="' + main_data[id][i]['url'] + '"><td>' + main_data[id][i]['name'] + '</td><td>' + main_data[id][i]["developer"] + '</td>';
            if (use_device) {
                table += '<td>' + main_data[id][i]["device"] + '</td>';
            }
            table += '<td>' + main_data[id][i]['url'] + '</td><td>' + main_data[id][i]['date'] + '</td></tr>';
            $(dom_table).append(table);
            $('.' + id).removeClass(id).removeClass('hide').hide().show('fast');

            if(++i == limit) {
                clearInterval(processor);
            }
            busy = false;
        }
    }, 50);
}