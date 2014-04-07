function getCookie(name) {
    if (! document.cookie) return null;
    var cookie = document.cookie;
    var startPos = cookie.indexOf(name + '=');
    if (startPos == -1) return null;
    var endPos = cookie.indexOf(';', startPos);
    return cookie.substring(startPos, ~endPos ? endPos : undefined).split('=')[1];
}

function onCreateSuccess(data) {
//
}

function createUser() {
    $('#btnCreate').button('loading');
    var data = {
        "username": $('#cUsername').val(),
        "password": $('#cPassword').val(),
        "vcs": $('#cVcs').val(),
        "xda": $('#cXda').val(),
        "first_name": $('#cFirstName').val(),
        "last_name": $('#cLastName').val()
    };
    console.log(data);
    $.ajaxSetup({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'))
        },
        type: 'POST',
        url: '/create_user/',
        'dataType': 'json',
        data: data,
        success: function (data) {
            data = JSON.parse(JSON.stringify(data));
            // send alert saying auth issues
            if (data['result'] == 0) {
                location.reload();
            }
            console.log(data);
            $('#btnCreate').button('reset');
        },
        error: function (data) {
            // send alert saying error with server
            $('#btnCreate').button('reset');
        }
    });
    $.ajax();

    return false;
}

function createKeyPress(e) {
    if (e.keyCode == 13) {
        $('#btnCreate').click()
    }
}

function createClearPass() {
    $('#cPassword').val('');
}

function checkPassword() {
    if ($('#cPassword') == $('#cPasswordConf')) {
        $('#cIncorrect').addClass('hidden');
        $('#cCorrect').removeClass('hidden');
    } else {
        $('#cCorrect').addClass('hidden');
        $('#cincorrect').removeClass('hidden');
    }
}