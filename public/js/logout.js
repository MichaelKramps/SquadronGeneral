$(document).ready(function(){
        var socket = io.connect();
        $("#logout").click(function(){
            socket.emit("logout");
        });
        socket.on("logout", function(){
            document.cookie = "player=loggedOut";
            window.location = "/";
        });
    });