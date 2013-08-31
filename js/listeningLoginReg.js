listenMessage('datosLoginReg', function(message) {
   if (document.URL.indexOf('loginPageFireReg.php') > -1)
   {
        var param = 'nick=' + encodeURIComponent(message.datosLoginReg.nick);
        param += '&password=' + md5(message.datosLoginReg.password);
        param += '&rememberme=true';

        $.ajax({
            type: "POST",
            url: 'conectarUsuario2.php',
            data: param,
            timeout: 20000,
            cache: false,
            success: function(answer){
                    if ($.trim(answer) != 'OK')   console.log(answer);
                    else document.location.href="paypalPage3.php";
                },
            error: function(objeto, quepaso, otroobj){
                console.log(quepaso);
                },
        });
    }
});

listenMessage('loginFbReg', function(message) {
   if (document.URL.indexOf('loginPageFireReg.php') > -1)
   {
        var interval = setInterval (function(){
            if (document.getElementById('fb-login'))
            {
                clearInterval(interval);
                $('#fb-login').click();
            }
        }, 500);
    }
});


