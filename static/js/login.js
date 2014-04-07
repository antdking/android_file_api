function getCookie(name) {
    if (! document.cookie) return null;
    var cookie = document.cookie;
    var startPos = cookie.indexOf(name + '=');
    if (startPos == -1) return null;
    var endPos = cookie.indexOf(';', startPos);
    return cookie.substring(startPos, ~endPos ? endPos : undefined).split('=')[1];
}

function onLoginSuccess(data) {
//
}

function login() {
    var action = $('#loginForm').attr('action');
    $('#btnLogin').button('loading');
    var data = {
        "username": $('#lUsername').val(),
        "password": $('#lPassword').val()
    };
    console.log(data);
    $.ajaxSetup({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'))
        },
        type: 'POST',
        url: '/login/',
        'dataType': 'json',
        data: data,
        success: function (data) {
            data = JSON.parse(JSON.stringify(data));
            // send alert saying auth issues
            if (data['result'] == 0) {
                location.reload();
            }
            console.log(data);
            $('#btnLogin').button('reset');
        },
        error: function (data) {
            // send alert saying error with server
            $('#btnLogin').button('reset');
        }
    });
    $.ajax();

    return false;
}

function loginKeyPress(e) {
    if (e.keyCode == 13) {
        $('#btnLogin').click()
    }
}

function loginClearPass() {
    $('#lPassword').val('');
}