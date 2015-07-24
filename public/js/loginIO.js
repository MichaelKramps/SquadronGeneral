    $(document).ready(function(){
        var socket = io.connect();
        $("#login").submit(function(e){
            e.preventDefault();
            $("#loginMessages").empty();
            socket.emit("login", {email: $("#loginEmail").val(), password: $("#loginPassword").val(), token: $("#loginToken").val()});
        });
        $("#register").submit(function(e){
            e.preventDefault();
            $("#registerMessages").empty();
            socket.emit("register", {email: $("#registerEmail").val(), username: $("#registerUsername").val(), password: $("#registerPassword").val(), verify: $("#registerVerify").val(), token: $("#registerToken").val()});
        });
        socket.on("registerMessage", function(errors){
            $.each(errors, function(i, error){
                $("#registerMessages").append("<li>" + error + "</li>");
            });
        });
        socket.on("registerSuccess", function(){
            $("#registerEmail").val("");
            $("#registerUsername").val("");
            $("#registerPassword").val("");
            $("#registerVerify").val("");
        });
        socket.on("loginMessage", function(errors){
            $.each(errors, function(i, error){
                $("#loginMessages").append("<li>" + error + "</li>");
            });
        });
        socket.on("loginSuccess", function(id){
            document.cookie = "player=" + id;
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 UTC";
            window.location = "/";
        });
    });