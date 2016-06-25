var ws = new  WebSocket('ws://' + document.location.host + '/__remote_control');

['prev', 'playpause', 'next'].forEach(function (control) {
    document.getElementById(control).addEventListener('click', function(event) {
        event.preventDefault();
        ws.send(control);
    });
});
