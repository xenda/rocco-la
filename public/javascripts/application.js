var queue_scrollpane_element;
var queue_scrollpane_api;

ytplayer = ""
function onytplayerStateChange(newState) {document.getElementById('status').innerHTML = newState;}

var INITIALIZED  = -1 
var FINISHED     = 0 
var PLAYING      = 1 
var STOPPED      = 2 
var BUFFERING    = 3 
var ON_QUEUE     = 5 
var INVALID      =  2
var NOT_FOUND    = 100
var NOT_ALLOWED  = 101
var NOT_ALLOWED2 = 150

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
      return "Reproduciendo"
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

function errorStatus(state){
  
  switch(state)
  {
    case INVALID:
      return "ID de Video inválido"
      break;
    case NOT_FOUND:
      return "No se encontró el video"
      break;
    case NOT_ALLOWED:
      return "No se permite reproducir el video"
      break;
    case NOT_ALLOWED2:
      return "No se permite reproducir el video"
      break;
  }
  
}

function videoStatusUpdate(state) {
   yt_status("Estado: " + playerStatus(state));
   if (state == FINISHED){
     loadNextVideo();
   }
   
   
}
function onPlayerError(event){
  yt_status("Error: " + errorStatus(event.data));
}

function onPlayerStateChange(event){
     yt_status("Estado: " + playerStatus(event.data));
     if (event.data == YT.PlayerState.ENDED){
       loadNextVideo();
     }
     
     if (event.data == STOPPED){
       resumeVideo();
     }
     
  
}

function yt_status(message){
  $("#status #message").html(message);
}

function updateTimes(current,total){
  current_seconds = current;         
  current_minutes = Math.floor(current_seconds/60);  
  current_seconds = Math.round(current_seconds % 60);

  if (current_seconds < 10)
    { current_zero_seconds = "0"}
  else
    { current_zero_seconds = ""}


  total_seconds = total;                            
  total_minutes = Math.floor(total_seconds/60);  
  total_seconds = Math.round(total_seconds % 60);

  if (total_seconds < 10)
    { total_zero_seconds = "0"}
  else
    { total_zero_seconds = ""}
  
  $("#status #current").html(current_minutes + ":" + current_zero_seconds + current_seconds);
  $("#status #total_duration").html(total_minutes + ":" + total_zero_seconds + total_seconds);  
  
}

function checkFinished(){
  
  
  current = player.getCurrentTime()
  total = player.getDuration()
  
  if (current > 5 && total > 5) {    
    if (current == total){
        loadNextVideo();
      }
  }
  
}

function update_status(){
  if (Modernizr.postmessage)
  {
    if (player)
      updateTimes(player.getCurrentTime(),player.getDuration())
      checkFinished();
  }
  else
  {  ytplayer = document.getElementById("vidplayer");
    updateTimes(ytplayer.getCurrentTime(),ytplayer.getDuration())
  }
  setTimeout(update_status,1000);  
}

function onYouTubePlayerReady(playerId) {
  ytplayer = document.getElementById(playerId);
  ytplayer.addEventListener('onStateChange', 'videoStatusUpdate');
  loadCurrentVideo();
  setTimeout(update_status,1000);
}

function onPlayerReady(event) {
  loadCurrentVideo();
  setTimeout(update_status,1000);
}


$(function() {

  setupSpinners();
  setupVideo();

  queue_scrollpane_element = $('#queue').jScrollPane();
  queue_scrollpane_api = queue_scrollpane_element.data('jsp');
 
 
  $("a#down").click(function(){
    
    if (player){
      if (player.getVolume() >= 0){
        player.setVolume(player.getVolume() - 10);
      }
    }
    return false;
    
  });
  
  $("a#up").click(function(){

    if (player){
      if (player.getVolume() <= 100){
        player.setVolume(player.getVolume() + 10);
      }
    }
    return false;
    
  });
 
});


function setupSpinners(){
  
  $(".spinner").bind("ajaxSend", function(){
    $(this).show();
  }).bind("ajaxComplete", function(){
    $(this).hide();
  });
  
}

function removeLastItem(){
  
  if ($("#queue li").size() > 1){
     $('#queue li:last').remove();
  }
  
  
}

function loadVideo(videoId,startSeconds){
  if (Modernizr.postmessage){
    if (player){
      player.loadVideoById(videoId, parseInt(startSeconds));
      removeLastItem();
      markLastAsActive();
      updateTimes(player.getCurrentTime(),player.getDuration())      
    }
    
    
  }
  else
  {
    if (ytplayer) {
      ytplayer.loadVideoById(videoId, parseInt(startSeconds));
      markLastAsActive();
      updateTimes(ytplayer.getCurrentTime(),ytplayer.getDuration())
    }
  }
}

function resumeVideo(){
  if (player)
    player.playVideo();
}

function loadCurrentVideo(){
  
  $.getJSON('/songs/current.json', function(data){
    loadVideo(data['video_id'],data['play_to']);
    updateTitle(data['title']);
    markLastAsActive();
  });
}

function updateTitle(title){
  
  $("#song_title").html(title);
  
}

function loadNextVideo(){
  
  $.getJSON('/songs/next.json', function(data){
    markLastAsActive();
  });
}

function markLastAsActive(){
  $("#queue li:last").addClass("current_video");
  $("#queue li:last a").remove();
}

function setupVideo(){
  
  if (Modernizr.postmessage){
    setupIframe();
  }
  else
  {  
    var params = { allowScriptAccess: "always" };
    var atts = { id: "vidplayer" };
    swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=vidplayer", 
                       "vidplayer", "620", "356", "8", null, {}, params, atts);
  }
}


function setupIframe(){
  var tag = document.createElement('script');
   tag.src = "http://www.youtube.com/player_api";
   var firstScriptTag = document.getElementsByTagName('script')[0];
   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);  
}

var player;
var done = false;
function onYouTubePlayerAPIReady() {
  player = new YT.Player('vidplayer', {
    height: '356',
    width: '600',
    // videoId: 'JW5meKfy3fY',
    videoId: '0',
    playerVars: {controls : 0, disablekb: 1,enablejsapi:1, iv_load_policy:3,modestbranding:1,rel:0, showinfo:0},
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
  loadCurrentVideo();
}
