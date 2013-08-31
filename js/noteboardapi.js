  var posCompartidas = new Array();

  function inicializaLocalStorage()
  {
    for (var i=0;i<localStorage["totalPost"];i++) {
      if (localStorage["userComp" + i] != undefined) guardaPosCompartido(i);
      localStorage.removeItem('postit' + i);
      localStorage.removeItem("tablon" + i);
      localStorage.removeItem("tipoA" + i);
      localStorage.removeItem("X" + i);
      localStorage.removeItem("Y" + i);
      localStorage.removeItem("width" + i);
      localStorage.removeItem("height" + i);
      localStorage.removeItem("treeId" + i);
      localStorage.removeItem("fecha" + i);
      localStorage.removeItem("updated" + i);
      // 4.0
      localStorage.removeItem("userComp" + i);
      localStorage.removeItem("nickComp" + i);
    }
    localStorage["totalPost"] = 0;
  }

function login(callback)
{
  //var url = 'http://www.noteboardapp.com/api/login.php';
  var param = 'nick=' + encodeURIComponent(document.getElementById('nick').value);
  param += '&pass=' + md5(document.getElementById('pwd').value);
  param += '&sid=' + localStorage["sid"];

  $.ajax({
    type: "POST",
    url: 'http://www.noteboardapp.com/api/login2.php',
    data: param,
    cache: false,
    success: function(answer){
          var resp = JSON.parse(answer);
          if (resp.isSuccess)
          {
                localStorage["password"] = document.getElementById('pwd').value;
                localStorage["id_usuario"] = resp.id_usuario;
                localStorage["token"] = resp.token;
                localStorage["sincroLogin"] = true;
                localStorage["nick"] = resp.nick;
                localStorage["sincro"] = false;
                localStorage["confirmado"] = resp.confirmado;
                if (callback) callback();
                else
                {
                  $('#capaContenedora').text("logged");
                  document.getElementById('logoutForm').style.display='block';
                  document.getElementById('loginForm').style.display='none';
                }
          }
          else $('#capaContenedora').text(resp.error);
        },
    error: function(objeto, quepaso, otroobj){
        console.log(quepaso);
          $('#capaContenedora').text("ERROR " + quepaso);
        },
  });
}

function logoutUsuario()
{
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("sincroLogin");
    localStorage.removeItem("nick");
    localStorage.removeItem("confirmado");
    localStorage["sincro"] = false;
    document.getElementById('logoutForm').style.display='none';
    document.getElementById('loginForm').style.display='block';
}

 function grabaNotaLogin(numPost)
  {

    if (numPost < 1000)
    {
      if (localStorage["tablon"+numPost] == "undefined" ||
          localStorage["tablon"+numPost] == undefined) localStorage["tablon"+numPost] = 1;
          var nota = {
            tipoA: localStorage["tipoA"+numPost],
            X: localStorage["X"+numPost],
            Y: localStorage["Y"+numPost],
            postit: localStorage["postit"+numPost],
            width: localStorage["width"+numPost],
            height: localStorage["height"+numPost],
            fecha: localStorage["fecha"+numPost],
            tablon: localStorage["tablon"+numPost]
          }
    }
    else
    {
      var tabString = "";
      for (var i=1;i<=localStorage["numTablones"];i++) tabString += localStorage['tab' + i + 'Label'] + '||' ;
        if (tabString == "") tabString = "undefined||undefined||undefined||undefined||undefined||";
      var nota = {
        tipoA: 9,
        X: 0,
        Y: 0,
        postit: tabString,
        width: 0,
        height: 0,
        fecha: '',
        tablon: 0
      }
    }

    var param = 'id_usuario=' + localStorage["id_usuario"];
    param += '&token=' + localStorage["token"];
    param += '&nota=' + encodeURIComponent(JSON.stringify(nota));
    param += '&sid=' + localStorage["sid"];

    $.ajax({
      type: "POST",
      url: 'http://www.noteboardapp.com/api/createNote.php',
      data: param,
      cache: false,
      success: function(answer){
            var resp = JSON.parse(answer);
            if (resp.isSuccess)
            {
              localStorage["treeId" + numPost] = resp.idNota;
              console.log("treeId" + localStorage["treeId" + numPost]);

              // si estamos en registro nos vamos a la web
              if (numPost == 1000 && document.URL.indexOf('options3') > 0)
              {
                  chrome.tabs.create({url:'http://www.noteboardapp.com/paypalPage2.php'});
                  window.close();
              }
            }
            else console.log('OK ' + resp.error);
          },
      error: function(objeto, quepaso, otroobj){
          console.log(quepaso);
            $('#capaContenedora').text("ERROR " + quepaso);
          },
    });
  }

 function updateNotaLoginMemo(numPost)
 {
    if (numPost < 1000) localStorage["updated" + numPost] = 'true';
    else updateNotaLogin(numPost);
 }

 function updateNotaLogin(numPost)
  {
    if (localStorage["tablon"+numPost] == "undefined" ||
        localStorage["tablon"+numPost] == undefined) localStorage["tablon"+numPost] = 1;
    if (numPost < 1000)
    {
      var nota = {
        tipoA: localStorage["tipoA"+numPost],
        X: localStorage["X"+numPost],
        Y: localStorage["Y"+numPost],
        postit: localStorage["postit"+numPost],
        width: localStorage["width"+numPost],
        height: localStorage["height"+numPost],
        fecha: localStorage["fecha"+numPost],
        tablon: localStorage["tablon"+numPost]
      }
    }
    else
    {
      var tabString = "";
      for (var i=1;i<=localStorage["numTablones"];i++) tabString += localStorage['tab' + i + 'Label'] + '||' ;
      if (tabString == "") tabString = "undefined||undefined||undefined||undefined||undefined||";
      var nota = {
        tipoA: 9,
        X: 0,
        Y: 0,
        postit: tabString,
        width: 0,
        height: 0,
        fecha: '',
        tablon: 0
      }
    }

    var param = 'id_usuario=' + localStorage["id_usuario"];
    param += '&token=' + localStorage["token"];
    param += '&id_nota=' + localStorage["treeId" + numPost];
    param += '&nota=' + encodeURIComponent(JSON.stringify(nota));
    param += '&sid=' + localStorage["sid"];

    $.ajax({
      type: "POST",
      url: 'http://www.noteboardapp.com/api/updateNote.php',
      data: param,
      cache: false,
      success: function(answer){
            var resp = JSON.parse(answer);
            if (resp.isSuccess)
            {
              console.log('OK ' + resp.idNota);
            }
            else console.log('OK ' + resp.error);
          },
      error: function(objeto, quepaso, otroobj){
          console.log(quepaso);
            $('#capaContenedora').text("ERROR " + quepaso);
          },
    });
  }

function deleteNoteLogin(numPost)
{
    var param = 'id_usuario=' + localStorage["id_usuario"];
    param += '&token=' + localStorage["token"];
    param += '&id_nota=' + localStorage["treeId" + numPost];
    param += '&sid=' + localStorage["sid"];

    $.ajax({
      type: "POST",
      url: 'http://www.noteboardapp.com/api/deleteNote.php',
      data: param,
      cache: false,
      success: function(answer){
            var resp = JSON.parse(answer);
            if (resp.isSuccess)
            {
              console.log('OK ' + resp.idNota);
            }
            else console.log('OK ' + resp.error);
          },
      error: function(objeto, quepaso, otroobj){
          console.log(quepaso);
            $('#capaContenedora').text("ERROR " + quepaso);
          },
      });
}


/*********************************************************************************************/
/***************************** LECTURA DE TODAS LAS NOTAS  ***********************************/
/*********************************************************************************************/


  function sincronizaLogin(addNotes,showNotes,compartir)
  {
    var url = 'http://www.noteboardapp.com/api/getNotes.php';
    url += '?id_usuario=' + localStorage["id_usuario"];
    url += '&token=' + localStorage["token"];

  $.ajax({
    type: "GET",
    url: url,
    cache: false,
    success: function(answer){
          var resp = JSON.parse(answer);
          if (resp.isSuccess)
          {
            localStorage["sid"] = resp.sid;
            localStorage["confirmado"] = resp.confirmado;

            if (resp.invitaciones != undefined)
              recibeInvitaciones(resp.invitaciones);
            else
              localStorage.removeItem("invitaciones");

            if (resp.invEnviadas != undefined)
              recibeInvEnviadas(resp.invEnviadas);
            else
              localStorage.removeItem("invEnviadas");

            if (resp.comparticiones != undefined)
              recibeComparticiones(resp.comparticiones);
            else
              localStorage.removeItem("comparticiones");
            if (addNotes) cargaNotasAdd(resp,showNotes,compartir);                 // se añaden a las actuales de memoria
            else {
              inicializaLocalStorage();
              cargaNotas(resp,showNotes,compartir);   // proceso background
            }
          }
        },
    error: function(objeto, quepaso, otroobj){
        console.log(quepaso);
        },
  });
}

function cargaNotas(notas,showNotes,compartir)
{

$.each(notas,function(index,value) {
  if (notas[index].postit != undefined)
  {
    if (notas[index].tipoA != '9')
    {
      var numPost = localStorage["totalPost"];
      localStorage["tipoA"+numPost] = notas[index].tipoA;
      localStorage["X"+numPost] = notas[index].X;
      localStorage["Y"+numPost] = notas[index].Y;
      localStorage["postit"+numPost] = notas[index].postit;
      localStorage["width"+numPost] = notas[index].width;
      localStorage["height"+numPost] = notas[index].height;
      localStorage["fecha"+numPost] = notas[index].fecha;
      localStorage["treeId" + numPost] = notas[index].id_nota;
      localStorage["tablon"+numPost] = notas[index].tablon;

  // 4.0 ini
      if (notas[index].permisos != undefined) //nota compartida
      {
        if (notas[index].permisos == 'RW')
        {
          localStorage["userComp"+numPost] = notas[index].userComp;
        }
        else localStorage["userComp"+numPost] = 'R';
        localStorage["nickComp"+numPost] = notas[index].nickComp;
        recuperaPosCompartido(numPost);
      }
  // 4.0 fin

      localStorage["totalPost"] ++;
    }
    else
    {
        localStorage["treeId1000"] = notas[index].id_nota;
        var tablones = notas[index].postit.split('||');
        localStorage["numTablones"] = tablones.length-1;
        for (var j=0;j<localStorage["numTablones"];j++)
        {
          localStorage['tab' + (j+1) + 'Label'] = tablones[j];
          if (localStorage["fondo"+(j+1)] == undefined || localStorage["fondo"+(j+1)] == "undefined") localStorage["fondo"+(j+1)] = 0;
        }
    }
  }
});
  if (showNotes) sendMessage({mensBack: "muestraNotas"});
  if (compartir) muestraNotasAlCompartir();

  if (localStorage["totalPost"] > 0) {cambiaIcono();cambiaContador();}  //4.0
  if (parseInt(localStorage["tablonActual"]) >  parseInt(localStorage["numTablones"])) localStorage["tablonActual"] = localStorage["numTablones"];
}



function cargaNotasAdd(notas,showNotes)
{
 var numPrevios = localStorage["totalPost"];
 var existeList = new Array();
 var existeTablones = false;
 for(var j=0;j<numPrevios;j++) existeList[j] = false;

$.each(notas,function(index,value) {

  if (notas[index].postit != undefined)
  {
    if (notas[index].tipoA != '9')
    {
          var existe = false;
          for(var j=0;j<numPrevios;j++) // mirar si ya tenemos el post
          {
              if (localStorage["postit"+j] == notas[index].postit)
              {
                existeList[j] = true;
                existe = true;
                //localStorage["treeId"+j] = notas[index].id_nota;    //Siempre se guarda el id de la tabla por si acaso tiene el id de los marcadores anteriores.
              }
          }
          if (!existe)  // el postit no está en memoria
          {
              var numPost = localStorage["totalPost"];
              localStorage["tipoA"+numPost] = notas[index].tipoA;
              localStorage["X"+numPost] = notas[index].X;
              localStorage["Y"+numPost] = notas[index].Y;
              localStorage["postit"+numPost] = notas[index].postit;
              localStorage["width"+numPost] = notas[index].width;
              localStorage["height"+numPost] = notas[index].height;
              localStorage["fecha"+numPost] = notas[index].fecha;
              localStorage["tablon"+numPost] = notas[index].tablon;
              localStorage["treeId" + numPost] = notas[index].id_nota;
  // 4.0 ini
              if (notas[index].permisos != undefined) //nota compartida
              {
                if (notas[index].permisos == 'RW')
                {
                  localStorage["userComp"+numPost] = notas[index].userComp;
                }
                else localStorage["userComp"+numPost] = 'R';
                localStorage["nickComp"+numPost] = notas[index].nickComp;
                recuperaPosCompartido(numPost);
              }
  // 4.0 fin
              localStorage["totalPost"] ++;
              if (showNotes) muestraPostit(numPost);
          }
    }
    else
    {
          localStorage["treeId1000"] = notas[index].id_nota;
          var tablones = notas[index].postit.split('||');
          var numTablones = tablones.length-1;

          for (var j=0;j< numTablones;j++)
          {
            localStorage['tab' + (j+1) + 'Label'] = tablones[j] ;
            if (localStorage["fondo"+(j+1)] == undefined || localStorage["fondo"+(j+1)] == "undefined") localStorage["fondo"+(j+1)] = 0;
            if (document.getElementById('tablonAdd') && (j+1) > 5 && !document.getElementById('tablon'+(j+1))) addBoardNum((j+1));
          }
          if (numTablones > localStorage["numTablones"]) localStorage["numTablones"] = numTablones;
          existeTablones = true;
    }
  }
});
  if (localStorage["totalPost"] > 0) {cambiaIcono();cambiaContador();}  //4.0
  for(var i=0;i<numPrevios;i++) if (!existeList[i]) grabaNotaLogin(i);
  if (!existeTablones) grabaNotaLogin(1000);
  else updateNotaLoginMemo(1000);

  if (tabCompartido(localStorage["tablonActual"]))
    trataTablonComp();
  else
    inicializaFriendsBot();
  if (showNotes) refrescaPantalla();
}

var primerIntento = false;
function grabaModificaciones()
{
  var listaNotas = new Array();
  var algunCambio = false;
  var numCambios = 0;

  for (var i=0;i<localStorage["totalPost"];i++)
  {
    if (localStorage["updated" + i] == "true")
    {
      algunCambio = true;
      if (localStorage["tablon"+i] == "undefined" ||
          localStorage["tablon"+i] == undefined) localStorage["tablon"+i] = 1;

      // 4.0 ini
        if (localStorage["userComp"+i] == undefined ||  localStorage["userComp"+i] == 'R')
          var usuario = localStorage["id_usuario"];
        else
          var usuario = localStorage["userComp"+i];
      // 4.0 fin

      var nota = {
        id_nota: localStorage["treeId" + i],
        tipoA: localStorage["tipoA"+i],
        X: localStorage["X"+i],
        Y: localStorage["Y"+i],
        postit: localStorage["postit"+i],
        width: localStorage["width"+i],
        height: localStorage["height"+i],
        fecha: localStorage["fecha"+i],
        tablon: localStorage["tablon"+i],
  // 4.0 ini
        usuario: usuario
  // 4.0 fin
      }
      localStorage["updated" + i] = "false";
      listaNotas[numCambios] = nota;
      numCambios++;
    }
  }
  if (algunCambio)
  {
    var param = 'id_usuario=' + localStorage["id_usuario"];
    param += '&token=' + localStorage["token"];
    param += '&listaNotas=' + encodeURIComponent(JSON.stringify(listaNotas));
    param += '&sid=' + localStorage["sid"];

    primerIntento = true;
    llamadaUpdate(param);
  }
}

function llamadaUpdate(param)
{
    $.ajax({
      type: "POST",
      url: 'http://www.noteboardapp.com/api/updateListNotes4.php',
      data: param,
      cache: false,
      async: false,
      success: function(answer){
            var resp = JSON.parse(answer);
            if (!resp.isSuccess)
                console.log('Error:  ' + resp.error);
      },
      error: function(objeto, quepaso, otroobj){
          console.log(objeto);
          console.log('Error UpdateList');
          if (primerIntento)
          {
            console.log('Intento otra vez...');
            primerIntento = false;
            llamadaUpdate(param);
          }
          else console.log('No quedan intentos, mala suerte');
      },
    });
}

function muestraAvisoReg()
{
    var mens = getMessage("avisoReg");

    $( "#dialog-confirm" ).attr('title',getMessage("extName"));
    $( "#dialog-confirm" ).html(mens);
    if (navigator.language == 'es')
      $("#dialog-confirm").dialog({
        resizable: false,
        width: 400,
        modal: true,
        buttons: {
          "Hacerse Premium": function() {
            window.open('http://www.noteboardapp.com/paypalPage.php?idUsuario=' + localStorage["id_usuario"],'_newtab');
          },
          "Cancelar": function() {
            $( this ).dialog( "close" );
          }
        }
      });
    else
    {
      $("#dialog-confirm").dialog({
      resizable: false,
      width: 400,
      modal: true,
      buttons: {
        "Join Premium": function() {
          window.open('http://www.noteboardapp.com/paypalPage.php?idUsuario=' + localStorage["id_usuario"],'_newtab');
        },
        "Cancel": function() {
          $( this ).dialog( "close" );
        }
      }
    });
  }

}