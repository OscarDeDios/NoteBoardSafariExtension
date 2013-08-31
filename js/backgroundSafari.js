crearMenus();
safari.extension.addContentScriptFromURL(safari.extension.baseURI + 'js/injectContextMenu.js');
// We will do this when click in the icon
/********************************************************************************************************/
/*            CLICK ICON EXTENSION LISTENER 	we inject the code here							                            */
/********************************************************************************************************/
safari.application.addEventListener("command", startNoteBoard, false);

function startNoteBoard(event)
{
	if (event.command == 'start-noteboard')
	{
		if (localStorage["id_usuario"] == undefined)
		{
			abreLogin();
			// if (event.target.popover == undefined)
			// {
			// 	var myPop = safari.extension.createPopover("popupLogin", safari.extension.baseURI + "login.html", 900, 650);
			// 	event.target.popover=myPop;
			// }
			// event.target.showPopover()
		}
		else
		{
			openTab("http://noteboardapp.com/board.php")
		}
	}
	else trataContextMenu(event.command);
}

var loginTab = 0;
function abreLogin()
{
	openTab(safari.extension.baseURI + "login.html")
	//crearMenus();

	listenMessageBackground('loged', function(request,sender){
		var datos = request.loged;
		localStorage["id_usuario"] = datos.id_usuario;
		localStorage["password"] = datos.password;
		localStorage["nick"] = datos.nick;
		localStorage["token"] = datos.token;
		closeLogin();
		openTab("http://noteboardapp.com/loginPageFire.php");
	});

	listenMessageBackground('registered', function(request,sender){
		var datos = request.registered;
		localStorage["id_usuario"] = datos.id_usuario;
		localStorage["password"] = datos.password;
		localStorage["nick"] = datos.nick;
		localStorage["token"] = datos.token;
		closeLogin();
		openTab("http://noteboardapp.com/loginPageFireReg.php");
	});

	listenMessageBackground('loginFace', function(request,sender){
		safari.application.addEventListener("navigate", onFacebookLogin, true);
		loginTab = sender;
	});


}



//LISTEN MESSAGES
safari.application.addEventListener("navigate", tabsHandler, true);
function tabsHandler(event)
{
	safari.extension.addContentScriptFromURL(safari.extension.baseURI + 'js/injectContextMenu.js');
	var url = safari.application.activeBrowserWindow.activeTab.url;
	switch (url)
	{
		case "http://noteboardapp.com/board.php":     // PAGINA PRINCIPAL
			//inject jquery y listeningFirefox.js
			//escuchar logout
			listenMessageBackground('logout', function(request,sender){
				logout();
			});
			listenMessageBackground('cambioTablones', function(request,sender){
	            localStorage["listaTablones"] = request.cambioTablones;
	            crearMenus();
			});
			break;

		case "http://noteboardapp.com/loginPageFire.php":     // login
            // worker = tab.attach({
            //     contentScriptFile:  [data.url("jquery/jquery.js"),
            //                          data.url("varios.js"),
            //                          data.url("listeningLogin.js")
            //                         ]
            // });
            var log = {
                id_usuario : localStorage["id_usuario"],
                nick :  localStorage["nick"],
                password:  localStorage["password"],
                token :  localStorage["token"]
            }
            if (localStorage["id_fb"] != undefined)
                sendMessageToInjectCode(0,{"loginFb" : log});
            else
                sendMessageToInjectCode(0,{"datosLogin" : log});
			break;
		case "http://noteboardapp.com/loginPageFireReg.php":     // Registro
            // worker = tab.attach({
            //     contentScriptFile:  [data.url("jquery/jquery.js"),
            //                          data.url("varios.js"),
            //                          data.url("listeningLoginReg.js")
            //                         ]
            // });
            var log = {
                id_usuario : localStorage["id_usuario"],
                nick :  localStorage["nick"],
                password:  localStorage["password"],
                token :  localStorage["token"]
            }
            if (localStorage["id_fb"] != undefined)
                sendMessageToInjectCode(0,{"loginFbReg" : log});
            else
                sendMessageToInjectCode(0,{"datosLoginReg" : log});
			break;
		case "http://noteboardapp.com/loginPage.php":     // Registro
            // si llego a esta página es que se ha hecho logout o ha caducado la sesión.
            logout();
			break;
	}

}

var token;
var expires;
function onFacebookLogin(event)
{
	var windows = event.currentTarget.browserWindows;
	for (var i=0;i<windows.length;i++)
		for (var j=0;j<windows[i].tabs.length;j++)
			if (windows[i].tabs[j].url != undefined && (windows[i].tabs[j].url.indexOf('www.facebook.com/connect/login_success.html') > -1 || windows[i].tabs[j].title.indexOf('www.facebook.com/connect/login_success.html') > -1))
			{
				if (windows[i].tabs[j].url.indexOf('www.facebook.com/connect/login_success.html') > -1)
					var facebookUrl = windows[i].tabs[j].url;
				else
					var facebookUrl = windows[i].tabs[j].title;
				break;
			}

	if (facebookUrl != undefined)
	{
		console.log('url facebooklogin: ' + facebookUrl);
		if (facebookUrl.indexOf('#access_token') > -1)
		{
			token = facebookUrl.substring(facebookUrl.indexOf('#access_token=') + 14, facebookUrl.indexOf('&expires'));
			if (facebookUrl.indexOf('&base_domain') > -1)
				expires = facebookUrl.substring(facebookUrl.indexOf('&expires_in=') + 12, facebookUrl.indexOf('&base_domain'));
			else
				expires = facebookUrl.substring(facebookUrl.indexOf('&expires_in=') + 12);

			var graphUrl = "https://graph.facebook.com/me?access_token=" + token;
            $.ajax({
				url: graphUrl,
				dataType: "json",
				cache: false,
				error: function(objeto, quepaso, otroobj){
						// error function
						alert('error' + quepaso);
				},
				success: function(answer){
					console.log('llamada a facebook: '+ JSON.stringify(answer));
    		      	var facebookData = answer;
            	    loginFb(facebookData,token);
					}
				});
            safari.application.removeEventListener("open", onFacebookLogin, true);
			loginTab = 0;
            event.target.browserWindow.activeTab.close();
		}
		else
		{
			sendMessageToInjectCode(loginTab, {anwerLogin: "Error"});
		}
		//chrome.tabs.remove(tabid);
	}
}




function loginFb(facebookData,token)
{
  var url = 'http://noteboardapp.com/api/loginFb.php';
  var param = 'nick=' + encodeURIComponent(facebookData.name);
  param += '&fbId=' + encodeURIComponent(facebookData.id);
  param += '&fbToken=' + encodeURIComponent(token);


$.ajax({
    type: "POST",
    url: url,
    cache: false,
    data: param,
    success: function(answer){
        if (answer[0]!= '<')
        {
            var resp = JSON.parse(answer);
            if (resp.isSuccess)
            {
                  localStorage["id_usuario"] = resp.id_usuario;
                  localStorage["token"] = resp.token;
                  localStorage["id_fb"]  = facebookData.id;
                  localStorage["password"] = 'fbLogin';
                  localStorage["nick"] = resp.nick;

                closeLogin();
             	if (resp.nuevoReg) openTab("http://noteboardapp.com/loginPageFireReg.php");
                else openTab("http://noteboardapp.com/loginPageFire.php");

            }
        }
          //else document.getElementById('capaContenedora').innerHTML = resp.error;
        },
    error: function(objeto, quepaso, otroobj){
        console.log(quepaso);
          document.getElementById('capaContenedora').innerHTML = "ERROR " + quepaso;
        },
  });


}



function logout()
{
	localStorage.removeItem("id_usuario");
	localStorage.removeItem("password");
	localStorage.removeItem("nick");
	localStorage.removeItem("token");
	localStorage.removeItem("listaTablones");
	localStorage.removeItem("id_fb");
	crearMenus();
}




/********************************************************************************************************/
/*            CONTEXT MENUS
/********************************************************************************************************/

var info;
function crearMenus()
{
	safari.application.removeEventListener("contextmenu", handleContextMenu, true);
	safari.application.addEventListener("contextmenu", handleContextMenu, true);

	function handleContextMenu(event)
	{
		if (localStorage["id_usuario"] == undefined)
		{
			if (idiomaEsp())
				event.contextMenu.appendContextMenuItem("logToClip", "Login para guardar en Tablon de Notas");
			else
				event.contextMenu.appendContextMenuItem("logToClip", "Login to save to Note Board");
		}
		else
		{
			if (idiomaEsp())
			{
				var lit1 = 'NB Guarda Imagen en ';
				var lit2 = 'NB Guarda Link en ';
				var lit3 = 'NB Guarda Pagina en ';
				var lit4 = 'NB Guarda Seleccion en ';
			}
			else
			{
				var lit1 = 'NB Save Image in ';
				var lit2 = 'NB Save Link in ';
				var lit3 = 'NB Save Page in ';
				var lit4 = 'NB Save Selection in ';
			}

			var listaTablones = localStorage["listaTablones"].split(',');
			for (var i=0;i<listaTablones.length;i++)
			{
				switch (event.userInfo.tagName)
				{
					case "image":  event.contextMenu.appendContextMenuItem("save-imag"+[i+1], lit1 + listaTablones[i]);
							info = {srcUrl : event.userInfo.url};break;
					case "link":  	event.contextMenu.appendContextMenuItem("save-link"+[i+1], lit2 + listaTablones[i]);
							info = {linkUrl : event.userInfo.url};break;
					case "page":  	event.contextMenu.appendContextMenuItem("save-page"+[i+1], lit3 + listaTablones[i]);
							info = {pageUrl : event.userInfo.url};break;
					case "selection":  	event.contextMenu.appendContextMenuItem("save-sele"+[i+1], lit4 + listaTablones[i]);
							info = {selec : event.userInfo.selec};break;
				}
			}
		}
	}
}
function trataContextMenu(command)
{
	switch (command.substr(0,9))
	{
		case "logToCLip": abreLogin();break;
		case "save-imag": var link = safari.application.activeBrowserWindow.activeTab.url + '<img src="' + info.srcUrl + '" width="100%" \/>';
       	var nota = guardaPostit(link,command.substr(9));
       	break;
		case "save-link": var link = '<a href="' + info.linkUrl + '">' + info.linkUrl + '</a>';
       	var nota = guardaPostit(link,command.substr(9));
       	break;
		case "save-page": var link = '<a href="' + info.pageUrl + '">' + info.pageUrl + '</a>';
       	var nota = guardaPostit(link,command.substr(9));
       	break;
		case "save-sele":
       	var nota = guardaPostit(info.selec,command.substr(9));
       	break;
	}
}



function guardaPostit(textoAnun,numTablon){

	if (!isNumber(numTablon)) numTablon = 1;

    var f = new Date();
    if (navigator.language == 'es')
        var fecha = f.getDate() + '/' + (f.getMonth() +1) +  '/' + f.getFullYear();
    else
        var fecha = (f.getMonth() +1) + '/' + f.getDate() + '/' + f.getFullYear();

    var nota = {
        tipoA: 1+Math.floor(Math.random()*7),
        X: 20+Math.floor(Math.random()*100),
        Y: 50+Math.floor(Math.random()*100),
        postit: textoAnun,
        width: 250,
        height: 0,
        fecha: fecha,
        tablon: numTablon
    }
    var param = 'id_usuario=' +  localStorage["id_usuario"];
    param += '&token=' +  localStorage["token"];
    param += '&nota=' + encodeURIComponent(JSON.stringify(nota));
  //  param += '&sid=' + localStorage["sid"];


	$.ajax({
	    type: "POST",
	    url: 'http://noteboardapp.com/api/createNote.php',
	    cache: false,
	    data: param,
	    success: function(answer){
	             var resp = JSON.parse(answer);
	             if (resp.isSuccess)
	             {
	                nota.treeId = resp.idNota;
	                sendMessageToNoteBoard({clip: nota});
	             }
	             else console.log('OK ' + resp.error);
	          }
    });
    return nota;

  }