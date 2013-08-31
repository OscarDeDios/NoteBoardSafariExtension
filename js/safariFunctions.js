// Safari functions

function openTab(url)
{
	var tabs = safari.application.activeBrowserWindow.tabs;
	for (var i=0;i<tabs.length;i++)
	{
		if (tabs[i].url == url)
		{
			tabs[i].activate();
			return;
		}
	}
	safari.application.activeBrowserWindow.openTab().url = url;
}

function closeLogin()
{
	var tabs = safari.application.activeBrowserWindow.tabs;
	for (var i=0;i<tabs.length;i++)
	{
		if (tabs[i].url == safari.extension.baseURI + 'login.html' ||
			tabs[i].url == safari.extension.baseURI + 'login.html#')
		{
			tabs[i].close();
			return;
		}
	}
}

function clickSafari(element)
{
    var a = $(element)[0];
    var evObj = document.createEvent('MouseEvents');
    evObj.initMouseEvent('click', true, true, window);
    a.dispatchEvent(evObj);
}
function getUrl(url)
{
	return safari.extension.baseURI + url;
}

function sendMessageToBackground(message)
{
	for (var property in message)
	{
		safari.self.tab.dispatchMessage(property,message[property]);
	}
}

function sendMessageToInjectCode(tab,message)
{
	for (var property in message)
	{
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(property,message[property]);
	}
}

function sendMessageToNoteBoard(message)
{
	var win = safari.application.browserWindows;
	for (var i=0;i<win.length;i++)
	{
		var tabs = win[i].tabs;
		for (var j=0;j<tabs.length;j++)
		{
			if (tabs[j].url.indexOf('noteboardapp.com/board.php') > -1)
			{
				for (var property in message)
				{
					tabs[j].page.dispatchMessage(property,message[property]);
				}
			}
		}
	}
}

function listenMessage(requestType,callback)
{
	safari.self.addEventListener("message",function (theMessageEvent) {
	    if(theMessageEvent.name === requestType) {
	    	var request = new Object();
	    	request[theMessageEvent.name] = theMessageEvent.message;
	       callback(request);
	    }
	},false);
}

function listenMessageBackground(requestType,callback)
{

	safari.application.addEventListener("message",function(theMessageEvent){
	    if(theMessageEvent.name === requestType) {
	    	var url = safari.application.activeBrowserWindow.activeTab.url;
	    	var request = new Object();
	    	request[theMessageEvent.name] = theMessageEvent.message;
	       callback(request,url);
	    }
	},false);
}



var literalesEsp = {
	"extName" : {
		"message": "Tablon de Notas",
		"description": "Nombre extension"
	},
	"tablon" : {
		"message": "Tablón ",
		"description": "Cambio de tablon"
	},
	"cambF" : {
		"message": "Fuente",
		"description": "Cambio de fuente"
	},
	"cambFondo" : {
		"message": "Fondo",
		"description": "Cambio de fondo"
	},
	"nuevoPost" : {
		"message": "Nueva Nota",
		"description": "Nuevo Post it"
	},
	"aceptar" : {
		"message": "Aceptar",
		"description": "Boton aceptar"
	},
	"borrar" : {
		"message": "Borrar",
		"description": "Boton borrar"
	},
	"cancelar" : {
		"message": "Cancelar",
		"description": "Boton cancelar"
	},
	"confirmar" : {
		"message": "Seguro que quieres borrar la nota?",
		"description": "Mensaje confirmacion"
	},
	"confirmarTab" : {
		"message": "Seguro que quieres borrar el tablón? El tablón no está vacio, se borrarán todas sus notas.",
		"description": "Mensaje confirmacion"
	},
	"titu" : {
		"message": "Tamano",
		"description": "Tamano panel"
	},
	"sincroMens" : {
		"message": "Sincronizar",
		"description": "Sincronizar"
	},
	"sincronizingMens" : {
		"message": "Sinc.",
		"description": "Sincronize"
	},
	"sincronizingMensMarc" : {
		"message": "Sinc. Marcadores",
		"description": "Sincronize"
	},
	"opcionesSinc" : {
		"message": "Opciones de Sincronización",
		"description": "Opciones de Sincronizacion"
	},
	"guardaSeleccion" : {
		"message": "Guarda selección en Tablón de Notas",
		"description": "guardaSeleccion"
	},
	"guardaLink" : {
		"message": "Guarda link en Tablón de Notas",
		"description": "guardaLink"
	},
	"guardaPage" : {
		"message": "Guarda url de la página en Tablón de Notas",
		"description": "guardaPage"
	},
	"guardaImagen" : {
		"message": "Guarda imagen en Tablón de Notas",
		"description": "guardaImage"
	},
	"mensEdit" : {
		"message": "Doble click para editar",
		"description": "mensEdit"
	},
	"vacio" : {
		"message": "Nota vacia",
		"description": "Nota vacia"
	},
	"avisoReg" : {
		"message": "No puedes sincronizar más de 25 notas con un usuario de prueba. Esta nota no se recuperará en futuras sesiones.<br> Hazte usuario premium para poder tener las notas que quieras.",
		"description": "Aviso Registro"
	},
	"demo" : {
		"message": "Estas usando la demo, los cambios no se guardaran.",
		"description": "Aviso Registro"
	},
	"labelAdd" : {
		"message": "Nuevo Tablón",
		"description": "add board"
	},
	"Compartir" : {
		"message": "Compartir",
		"description": "Compartir"
	},
"defaultFont" : {
	"message": "Fuente por defecto",
	"description": "Default Font"
},
"increase" : {
	"message": "Aumenta tamaño de fuente por defecto",
	"description": "Increase default size font"
},
"decrease" : {
	"message": "Reduce tamaño de fuente por defecto",
	"description": "Decrease default size font"
},
"invitaciones" : {
	"message": "Invitaciones",
	"description": "Invitaciones Pendientes"
},
"invitacionesPend" : {
	"message": "Invitaciones pendientes",
	"description": "Invitaciones Pendientes"
},
"compartidoCon" : {
	"message": "Tablón compartido con:",
	"description": "Tablón compartido con:"
},
"flechaMuestra" : {
	"message": "Muestra tablones",
	"description": "Muestra tablones"
},
"flechaOculta" : {
	"message": "Oculta tablones",
	"description": "Oculta tablones"
},
"compartir" : {
	"message": "Compartir tablón",
	"description": "Compartir tablón"
},
"friendsBot" : {
	"message": "Usuarios que comparten este tablón",
	"description": "Usuarios que comparten este tablón"
},
"hayQueLoguearse" : {
	"message": "Para poder compartir un tablón hay que estar sincronizando las notas. Haz login o registrate por favor.",
	"description": "Hay que Loguearse jodio"
},
"user" : {
	"message": "Usuario",
	"description": "User"
},
"permisos" : {
	"message": "Permisos",
	"description": "Permisos"
},
"anular" : {
	"message": "Anular Invitación",
	"description": "anular"
},
"anularBot" : {
	"message": "Anular",
	"description": "anular"
},
"RW" : {
	"message": "L/E",
	"description": "permisos"
},
"R" : {
	"message": "L",
	"description": "permisos"
},
"escLec" : {
	"message": "Escritura y lectura",
	"description": "Escritura y lectura"
},
"lec" : {
	"message": "Lectura",
	"description": "Escritura y lectura"
},
"elijeDestino" : {
	"message": "Elige tablón para compartir: ",
	"description": "Elije Destino"
},
"rechazar" : {
	"message": "Rechazar",
	"description": "Rechazar"
},
"invitacionesBot" : {
	"message": "Invitaciones Recibidas",
	"description": "Invitaciones"
},
"maxBot" : {
	"message": "Salir del tablón",
	"description": "Invitaciones"
},
"minBot" : {
	"message": "Ejecutar como popup en siguiente ejecución",
	"description": "Invitaciones"
},
"mensaje" : {
	"message": "Mensaje",
	"description": "Mensaje"
},
"borraCompartir" : {
	"message": "Dejar de compartir con este usuario",
	"description": "borraCompartir"
},
"confirmarCompartirTab" : {
	"message": "Seguro que quieres dejar de compartir el tablón con este usuario?",
	"description": "Mensaje confirmacion"
},
"botonBorrar" : {
	"message": "Borrar Nota",
},
"botonEdit" : {
	"message": "Editar Nota",
},
"ayudaNuevaNota" : {
	"message": "También puedes crear notas haciendo doble click en el lugar del tablón donde la quieras.",
},
"ayudaEditarNota" : {
	"message": "También puedes editar notas haciendo doble click en el contenido de la nota a editar.",
},
"confSincro3" : {
	"message": "Para usar esta extensión necesitas registrate <b>GRATIS</b> en <a href='http://www.noteboardapp.com' target='_blank'>www.noteboardapp.com</a> así podrás acceder a tus notas desde cualquier navegador (incluido móviles) y también desde la aplicación android de <a href='https://play.google.com/store/apps/details?id=com.oscardr.tablonnotas' target='_blank'>Google Play</a>.<br>Si quieres probar la aplicación antes de registrarte haz click en <a href='http://noteboardapp.com/board.php?user=demo'><img id='demoImg' src='imagenes/demo.gif' width='35px'/></a><br><br>",
	"description": "Mensaje confirmacion para sincronizar"
}
}





var literalesIng = {
"extName" : {
	"message": "Notes Board",
	"description": "Nombre extension"
},
"cambF" : {
	"message": "Font",
	"description": "Font change"
},
"cambFondo" : {
	"message": "Background",
	"description": "Cambio de fondo"
},
"tablon" : {
	"message": "Board ",
	"description": "Cambio de tablon"
},
"nuevoPost" : {
	"message": "New Note",
	"description": "New Post it"
},
"aceptar" : {
	"message": "Accept",
	"description": "Boton aceptar"
},
"cancelar" : {
	"message": "Cancel",
	"description": "Boton cancelar"
},
"borrar" : {
	"message": "Clear",
	"description": "Boton borrar"
},
"confirmar" : {
	"message": "Are you sure you want to delete the note?",
	"description": "Mensaje confirmacion"
},
"confirmarTab" : {
"message": "Are you sure you want to delete the Board? The board is not empty, will erase all your notes.",
"description": "Mensaje confirmacion"
},
"titu" : {
	"message": "Size",
	"description": "Tamano panel"
},
"sincroMens" : {
	"message": "synchronize",
	"description": "Synchronize"
},
"sincronizingMens" : {
	"message": "Sync.",
	"description": "Synchronizing"
},
"sincronizingMensMarc" : {
	"message": "Sinc. Bookmarks",
	"description": "Sincronize"
},
"opcionesSinc" : {
	"message": "Synchronization Options",
	"description": "Opciones de Sincronizacion"
},
"guardaSeleccion" : {
	"message": "Save selection in Board Notes",
	"description": "guardaSeleccion"
},
"guardaLink" : {
	"message": "Save link in Board Notes",
	"description": "guardaLink"
},
"guardaPage" : {
	"message": "Save page url in Board Notes",
	"description": "guardaPage"
},
"guardaImagen" : {
	"message": "Save image in Board Notes",
	"description": "guardaImage"
},
"mensEdit" : {
	"message": "Double click to edit",
	"description": "mensEdit"
},
"vacio" : {
	"message": "Empty Note",
	"description": "Nota vacia"
},
"avisoReg" : {
	"message": "You can not synchronize more than 25 notes with a demo user.<br>This note will not be recovered in future sessions. Join premium to have any notes you want.",
	"description": "Aviso Registro"
},
"demo" : {
	"message": "You are using the demo, changes won't be saved.",
	"description": "Aviso Registro"
},
"labelAdd" : {
	"message": "Add Board",
	"description": "add board"
},
"Compartir" : {
		"message": "Share",
		"description": "Compartir"
	},
"defaultFont" : {
	"message": "Default Font",
	"description": "Default Font"
},
"increase" : {
	"message": "Increase default size font",
	"description": "Increase default size font"
},
"decrease" : {
	"message": "Decrease default size font",
	"description": "Decrease default size font"
},
"invitaciones" : {
	"message": "Invitations",
	"description": "Invitaciones Pendientes"
},
"invitacionesPend" : {
	"message": "Pending invitations",
	"description": "Invitaciones Pendientes"
},
"compartidoCon" : {
	"message": "Sharing board with:",
	"description": "Tablón compartido con:"
},
"flechaMuestra" : {
	"message": "Show boards",
	"description": "Muestra tablones"
},
"flechaOculta" : {
	"message": "Hide boards",
	"description": "Oculta tablones"
},
"compartir" : {
	"message": "Share Board",
	"description": "Compartir tablón"
},
"friendsBot" : {
	"message": "Users who share this board",
	"description": "Compartir tablón"
},
"hayQueLoguearse" : {
	"message": "To share a board you must be using synchronized notes. Please, login or register.",
	"description": "Hay que Loguearse jodio"
},
"user" : {
	"message": "User",
	"description": "User"
},
"permisos" : {
	"message": "Permission",
	"description": "Permisos"
},
"anular" : {
	"message": "Cancel Invitation",
	"description": "anular"
},
"anularBot" : {
	"message": "Cancel",
	"description": "anular"
},
"RW" : {
	"message": "R/W",
	"description": "permisos"
},
"R" : {
	"message": "R",
	"description": "permisos"
},
"escLec" : {
	"message": "Read and Write",
	"description": "Escritura y lectura"
},
"lec" : {
	"message": "Read",
	"description": "Escritura y lectura"
},
"elijeDestino" : {
	"message": "Choose board to share: ",
	"description": "Elije Destino"
},
"rechazar" : {
	"message": "Refuse",
	"description": "Rechazar"
},
"invitacionesBot" : {
	"message": "Invitations received",
	"description": "Invitaciones"
},
"maxBot" : {
	"message": "Come back to home",
	"description": "Invitaciones"
},
"minBot" : {
	"message": "Run as a popup in next execution",
	"description": "Invitaciones"
},
"mensaje" : {
	"message": "Message",
	"description": "Mensaje"
},
"borraCompartir" : {
	"message": "Stop sharing this user",
	"description": "borraCompartir"
},
"confirmarCompartirTab" : {
	"message": "Sure you want to stop sharing the board with this user?",
	"description": "Mensaje confirmacion"
},
"botonBorrar" : {
	"message": "Delete Note",
},
"botonEdit" : {
	"message": "Edit Note",
},
"ayudaNuevaNota" : {
	"message": "You can also create notes by double clicking on the place where you want.",
},
"ayudaEditarNota" : {
	"message": "You can also edit notes by double clicking on the contents of the note to edit.",
},
"confSincro3" : {
	"message": "To use this extension you need to register for <b>FREE</b> in <a href='http://www.noteboardapp.com' target='_blank'>www.noteboardapp.com</a> so you can access your notes from any browser (including mobile) and also from the android application to <a href='https://play.google.com/store/apps/details?id=com.oscardr.tablonnotas' target='_blank'>Google Play</a>.<br>If you want to test the application before registering click <a href='http://noteboardapp.com/board.php?user=demo'><img id='demoImg' src='imagenes/demo.gif' width='35px'/></a><br><br>",
	"description": "Mensaje confirmacion para sincronizar"
}
}

function getMessage(mens)
{
	try
	{
	if (idiomaEsp())
		return literalesEsp[mens].message;
	else
		return literalesIng[mens].message;
	}
	catch(err){
		return "";
	}
}

function idiomaEsp()
{
  return (navigator.language == 'es' || navigator.language == 'ca' || navigator.language == 'es-419' || navigator.language == 'es-ES')
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}