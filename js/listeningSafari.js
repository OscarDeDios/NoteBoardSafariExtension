listenMessage('clip', function(args) {

  nota = args.clip
  for (var i=0;i<localStorage["totalPost"];i++)
  {
    if (localStorage["treeId" + i] == nota.treeId) return;
  }
  var numPost = localStorage["totalPost"];
  localStorage["tipoA"+numPost] = nota.tipoA;
  localStorage["X"+numPost] = nota.X;
  localStorage["Y"+numPost] = nota.Y;
  localStorage["postit"+numPost] = nota.postit;
  localStorage["width"+numPost] = nota.width;
  localStorage["height"+numPost] = nota.height;
  localStorage["fecha"+numPost] = nota.fecha;
  localStorage["tablon"+numPost] = nota.tablon;
  localStorage["treeId" + numPost] = nota.treeId;
  localStorage["totalPost"]++;

  if (((localStorage["tablon"+numPost] == undefined || localStorage["tablon"+numPost] == "undefined") && localStorage["tablonActual"] == 1) ||
    localStorage["tablon"+numPost] == localStorage["tablonActual"]) //4.0
  {
    if (localStorage["tablonActual"] == 1)
    {
      clickSafari('#tablon2');
      clickSafari('#tablon1');
    }
    else
    {
      var tabAct = localStorage["tablonActual"];
      clickSafari('#tablon1');
      clickSafari('#tablon'+tabAct);
    }
  }
})
if (navigator.language != 'es' && navigator.language != 'es-ES')
    $('#botonPost').before('<div id="logout" class="button" >Logout</div>');
else
  $('#botonPost').before('<div id="logout" class="button" >Desconectar</div>');

$('#logout').on('click',function(){
    sendMessageToBackground({'logout':'logout'});
    window.open('salir.php', '_self')
});

var interval = setInterval (function(){
    listaTablones = [];
    $('.tabLabel').each(function(){listaTablones.push($(this).text())});
    auxStr = listaTablones.toString();
    listaTablones2 = [];
    $('.tabPaneles2').each(function(){listaTablones2.push($(this).text())});
    auxStr2 = listaTablones2.toString();
    if (listaStr != auxStr)
    {
       sendMessageToBackground({'cambioTablones':auxStr});
    }
    if (listaStr2 != auxStr2)
    {
       sendMessageToBackground({'cambioTablones':auxStr2});
    }
    listaStr = auxStr;
    listaStr2 = auxStr2;
}, 5000);
var listaTablones = new Array();
var listaStr = '';
var listaTablones2 = new Array();
var listaStr2 = '';



