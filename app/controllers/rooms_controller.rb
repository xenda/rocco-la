class RoomsController < InheritedResources::Base

  def current
    unless current_room.no_songs_remaining?
      current_room.songs.first
      play_to = Time.now - current_room.started_at #+ 5.seconds
      render_current_song(play_to)
    else
      render_default_song
    end
  end

  def next
    logger.info current_room.current_song
    new_one = current_room.load_next_song(@current_time)
    play_to = 0
    play_to = Time.now - current_room.started_at unless new_one
    render_current_song(play_to)
  end

  def change_song
    new_one = current_room.change_song
    @play_to = 0
    render_current_song
  end

  def add_to_queue
    song = current_room.songs.build(params[:video])
    song.save
    
    Pusher["#{Rails.env}_global_room"].trigger('playlist:add_to_queue', {:_id => song._id, :title => song.title, :youtube_id => song.youtube_id })
    
    song.save
    #@user_queue.songs.save
    current_room.reload
    render :json => current_room.songs.last
  end
  
  def render_current_song(play_to)
    render :json => {
                    :video_id => current_room.songs.first.youtube_id, 
                    :play_to => play_to, 
                    :title => current_room.current_title
                    }
  end
  
  def render_default_song
    render :json => {
                    :video_id => "57tK6aQS_H0", 
                    :play_to => 0, 
                    :title => "Easter Eggs"
                    }
  end

end
