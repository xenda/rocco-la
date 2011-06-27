var ytplayer;
function onytplayerStateChange(newState) {document.getElementById('status').innerHTML = newState;}

var INITIALIZED = -1 
var FINISHED    = 0 
var PLAYING     = 1 
var STOPPED     = 2 
var BUFFERING   = 3 
var ON_QUEUE    = 5 

function playerStatus(state){
  switch(state)
  {
    case INITIALIZED:
      return "Sin iniciar"
      break;
    case FINISHED:
      return "Finalizado"
      break;
    case PLAYING:
      return "En ejecución"
      break;
    case STOPPED:
      return "Detenido"
      break;
    case BUFFERING:
      return "Cargando datos"
      break;
    case ON_QUEUE:
      return "En cola"
      break;
  }
  
}

function videoStatusUpdate(state) {
   yt_status("Estado: " + playerStatus(state));
}

function yt_status(message){
  $("#status").html(message);
}
// 
// function onYouTubePlayerReady(playerId) {
//   player = document.getElementById(playerId);
//   player.addEventListener("onStateChange", "videoStatusUpdate");
// }

function onYouTubePlayerReady(playerId) {
ytplayer = document.getElementById(playerId);
ytplayer.addEventListener('onStateChange', 'videoStatusUpdate');
}



$(function() {

  loadVideo();

 
});


function loadVideo(){
  var params = { allowScriptAccess: "always" };
  var atts = { id: "vidplayer" };
  swfobject.embedSWF("http://www.youtube.com/v/57tK6aQS_H0?enablejsapi=1&playerapiid=vidplayer", 
                     "vidplayer", "620", "356", "8", null, {}, params, atts);

}

