$(function() {

  $('#video_search').submit(function(event){
    event.preventDefault();
    var query = $('#query').val();

    $.getJSON('http://gdata.youtube.com/feeds/videos?alt=json-in-script&max-results=10&q='+query+'&category=Music&callback=?', function(data){
      $('#results').html('');
      $(data.feed.entry).each(function(index, item){
        var title = item.title.$t;
        var id = item.id.$t.replace('http://gdata.youtube.com/feeds/videos/', '');
        var thumbnail = item.media$group.media$thumbnail[3].url;
        $('#results').append('<li><a href="#add_to_queue" class="add_to_queue" id="video_'+id+'"><img src="'+thumbnail+'" />'+title+'</a></li>');
      });
    });
  });

  $('.add_to_queue').live('click', function(event){
    event.preventDefault();
    var video = {video: {
                  youtube_id: $(this).attr('id').replace('video_', ''),
                  title: $(this).text()}
                }
    $.ajax({
      url: '/add_to_queue',
      data: video,
      type: 'POST',
      success: function(data){
        if(data){
          $('#queue').prepend('<li>'+data.title+'</li>');
        }
      }
    });
  });

});
