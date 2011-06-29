var search_list = [];

$(function() {
  
  // Enable pusher logging - don't include this in production
    Pusher.log = function(message) {
      if (window.console && window.console.log) window.console.log(message);
    };

    // Flash fallback logging - don't include this in production
    WEB_SOCKET_DEBUG = true;

    var pusher = new Pusher('d80ab8b828a435a50beb');
    var channel = pusher.subscribe(room);
    
    channel.bind('playlist:add_to_queue', function(data) {
      $('#queue').prepend('<li id="song_'+data["youtube_id"]+'">'+data['title']+'<small><a class="remove_from_playlist" href="#" id="'+data["_id"]+'">Remove</a></small></li>');
      queue_scrollpane_api.reinitialise();
    });
    
    
    channel.bind('playlist:remove_from_queue', function(data) {
      $('#song_'+data["youtube_id"]).remove();
    });    
    
    channel.bind('playlist:play_next', function(data) {
      loadVideo(data['video_id'],data['play_to']);
      updateTitle(data['title']);
    });
    

    
    
    

  $('#video_search').submit(function(event){
    event.preventDefault();
    var query = $('#query').val();

    $.getJSON('http://gdata.youtube.com/feeds/videos?alt=json-in-script&max-results=10&format=5&q='+query+'&category=Music&callback=?', function(data){
      $('#results').html('');
      $(data.feed.entry).each(function(index, item){
        // console.log(data);
        var title = item.title.$t;
        var id = item.id.$t.replace('http://gdata.youtube.com/feeds/videos/', '');
        var thumbnail = item.media$group.media$thumbnail[3].url;
        var duration = item.media$group.yt$duration.seconds;
        $('#results').append('<li><a href="#add_to_queue" class="add_to_queue" id="video_'+id+'"><img src="'+thumbnail+'" />'+title+'</a><small id="duration_'+id+'" style="display:none;">'+duration+'</small></li>');
      });
    });
  });

  $('.add_to_queue').live('click', function(event){
    event.preventDefault();
    var id = $(this).attr('id').replace('video_', '');
    var video = {video: {
                  youtube_id: id,
                  title: $(this).text(),
                  duration: $('#duration_'+id).text()}
                }
    $.ajax({
      url: '/add_to_queue',
      data: video,
      type: 'POST',
      success: function(data){
        if(data){
          // console.log(data);
          // $('#queue').prepend('<li id="song_'+data._id+'">'+data.title+'<small><a class="remove_from_playlist" href="#" id="'+data._id+'">Remove</a></small></li>');
        }
      }
    });
  });

  $('.remove_from_playlist').live('click', function(event){
    event.preventDefault();
    var id = $(this).attr('id');
    var song_id = $(this).parent().parent().attr('id');
    $.ajax({
      url: '/songs/'+id+'.json',
      type: 'DELETE',
      success: function(data){
        if(data){
          // console.log('song_'+id);
          // $('#'+song_id).remove();
        }
      }
    });
  });

});
