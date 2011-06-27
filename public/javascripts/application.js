ytplayer = ""
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
  $("#status #message").html(message);
}

function updateTimes(current,total){
  current_seconds = current;         
  current_minutes = Math.floor(current_seconds/60);  
  current_seconds = Math.round(current_seconds % 60);

  total_seconds = total;                            
  total_minutes = Math.floor(total_seconds/60);  
  total_seconds = Math.round(total_seconds % 60);
  
  $("#status #current").html(current_minutes + ":" + current_seconds);
  $("#status #total_duration").html(total_minutes + ":" + total_seconds);  
  
}

function update_status(){
  ytplayer = document.getElementById("vidplayer");
  updateTimes(ytplayer.getCurrentTime(),ytplayer.getDuration())
  setTimeout(update_status,1000);  
}

function onYouTubePlayerReady(playerId) {
  ytplayer = document.getElementById(playerId);
  ytplayer.addEventListener('onStateChange', 'videoStatusUpdate');
  loadCurrentVideo();
  setTimeout(update_status,1000);
}



$(function() {

  setupVideo();
 
});


function loadVideo(videoId,startSeconds){
  if (ytplayer) {
    ytplayer.loadVideoById(videoId, parseInt(startSeconds));
    updateTimes(ytplayer.getCurrentTime(),ytplayer.getDuration())
    // ytplayer.playVideo();
    
  }
}

function loadCurrentVideo(){
  
  $.getJSON('/songs/current.json', function(data){
    loadVideo(data['video_id'],data['play_to']);
  });
}


function setupVideo(){
  var params = { allowScriptAccess: "always" };
  var atts = { id: "vidplayer" };
  swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=vidplayer", 
                     "vidplayer", "620", "356", "8", null, {}, params, atts);

}
