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
   if (state == FINISHED){
     loadNextVideo();
     if ($("#queue li").size > 1){
        $('#queue li:last').remove();
     } 

   }
   
   
}
function onPlayerStateChange(event){
     yt_status("Estado: " + playerStatus(event.data));
     if (event.data == FINISHED){
       loadNextVideo();
       if ($("#queue li").size > 1){
          $('#queue li:last').remove();
       } 

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

function update_status(){
  if (Modernizr.postmessage)
  {
    if (player)
      updateTimes(player.getCurrentTime(),player.getDuration())
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
 
});


function setupSpinners(){
  
  $(".spinner").bind("ajaxSend", function(){
    $(this).show();
  }).bind("ajaxComplete", function(){
    $(this).hide();
  });
  
}

function loadVideo(videoId,startSeconds){
  if (Modernizr.postmessage){
    if (player){
      player.loadVideoById(videoId, parseInt(startSeconds));
      updateTimes(player.getCurrentTime(),player.getDuration())      
    }
    
    
  }
  else
  {
    if (ytplayer) {
      ytplayer.loadVideoById(videoId, parseInt(startSeconds));
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
  });
}

function loadNextVideo(){
  
  $.getJSON('/songs/next.json', function(data){
    loadVideo(data['video_id'],data['play_to']);
  });
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
function onYouTubePlayerAPIReady() {
  player = new YT.Player('vidplayer', {
    height: '356',
    width: '600',
    // videoId: 'JW5meKfy3fY',
    videoId: '0',
    playerVars: {controls : 0, disablekb: 1,enablejsapi:1, iv_load_policy:3,modestbranding:1,rel:0, showinfo:0},
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  loadCurrentVideo();
}