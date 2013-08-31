listenMessage('datosLogin', function(message) {
   if (document.URL.indexOf('loginPageFire.php') > -1)
   {
        var param = 'nick=' + encodeURIComponent(message.datosLogin.nick);
        param += '&password=' + md5(message.datosLogin.password);
        param += '&rememberme=true';

        $.ajax({
            type: "POST",
            url: 'conectarUsuario2.php',
            data: param,
            timeout: 20000,
            cache: false,
            success: function(answer){
                    if ($.trim(answer) != 'OK')  console.log(answer);
                    else document.location.href="board.php";
                },
            error: function(objeto, quepaso, otroobj){
                console.log(quepaso);
                },
        });
    }
});

// listenMessage('loginFb', function(message) {
//    if (document.URL.indexOf('loginPageFire.php') > -1)
//    {
//                     $('#fb-login').click();
//         // var interval = setInterval (function(){
//         //     if (document.getElementById('fb-login'))
//         //     {
//         //         clearInterval(interval);
//         //         $('#fb-login').click();
//         //     }
//         // }, 500);
//     }
// });

    safari.self.addEventListener("message",function (theMessageEvent) {
        if(theMessageEvent.name === 'loginFb') {
            clickSafari('#fb-login');
        }
    },false);

