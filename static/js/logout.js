function getCookie(name) {
    if (! document.cookie) return null;
    var cookie = document.cookie;
    var startPos = cookie.indexOf(name + '=');
    if (startPos == -1) return null;
    var endPos = cookie.indexOf(';', startPos);
    return cookie.substring(startPos, ~endPos ? endPos : undefined).split('=')[1];
}

function logout() {
    $.ajaxSetup({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'))
        },
        type: 'POST',
        url: '/logout/',
        data: { 'next_page': '/'},
        success: function(data) {
            console.log(data);
        },
        error: function(data) {
            // send alert saying error with server
            console.log(data);
        }
    });
    $.ajax().done(function(data) {
        console.log(data);
    });
}