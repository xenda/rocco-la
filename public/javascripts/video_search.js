$('#video_search').submit(function(event){
  event.preventDefault();
  var query = $('#query').val();

  $.getJSON('http://gdata.youtube.com/feeds/videos?alt=json-in-script&max-results=10&q='+query+'&category=Music&callback=?', function(data){
    $(data.feed.entry).each(function(index, item){
      var title = item.title.$t;
      var id = item.id.$t.replace('http://gdata.youtube.com/feeds/videos/', '');
      $('#results').append('<li><a href="#add_to_queue" class="add_to_queue" id="video_'+id+'">'+title+'</a></li>');
    });
  });
});
