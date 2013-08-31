     $(document).ready(function() {
     	$('#nick').focus();
		$("#titulo").text(getMessage("extName"));
		if (navigator.language != 'es' && navigator.language != 'es-ES')
		{
			//$('#formUser h2').html('Login <a href="http://www.noteboardapp.com">www.noteboardapp.com</a><br> to synchronize');
			$("#labUser").html('Nick or Mail');
			$("#signupLabel").html('Nick');
			$("#confirmPass").html('Repeat Password');
			document.getElementById("buttonReg").value ='   Sign up';
			$("#lostPwd").text('forgot the password?');
			$("#fb-button span").text('Log in with Facebook');
		}
		$('#mensLogin').html(getMessage("confSincro3"));
		document.getElementById("nick").value = "";
		document.getElementById("pwd").value = "";
		$('#formUser').on("submit",function(){
			loginUsuario(callback);
			return false;

		});
		$('#formUserReg').on("submit",function(){
			registraUsuario();
			return false;
		});
		$('#buttonReg').on('click',function(){
			$('#formUser').slideUp(400,function(){$('#formUserReg').slideDown()});
		});
		$('#logBot').on('click',function(){
			$('#formUserReg').slideUp(400,function(){$('#formUser').slideDown()});
		});
		$('#lostPwd').on('click',enviaPassword);

	    $('#fb-login').on("click",function(){
	        $('#black_overlay').show();
	        loginFacebook();
	    });


	});





function callback()
{
	//sincronizaLogin(true,false);

	//$('document').trigger('loged');
	if (navigator.language == 'es' || navigator.language == 'ca' || navigator.language == 'es-ES')	$('#capaContenedora').text("Login Correcto");
	else $('#capaContenedora').text("Login OK");
	var loged = {
		id_usuario : localStorage["id_usuario"],
		password : localStorage["password"],
		nick : localStorage["nick"],
		token : localStorage["token"],
	}
	sendMessageToBackground({loged:loged});
	window.close();
}

