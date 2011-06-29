class SongsController < InheritedResources::Base
  
  before_filter :set_current_queue
  respond_to :json
    
  def current
    unless @user_queue.no_songs_remaining?
      @user_queue.load_next_song(@current_time)
      play_to = Time.now - @user_queue.started_at #+ 5.seconds
      render_current_song(play_to)
    else
      render_default_song
    end
  end
  
  def next
    logger.info @user_queue.current_song
    new_one = @user_queue.load_next_song(@current_time)
    play_to = 0
    play_to = Time.now - @user_queue.started_at unless new_one
    render_current_song(play_to)
  end

  def change_song
    new_one = @user_queue.change_song
    @play_to = 0
    render_current_song
  end


  def destroy
    destroy!{|success,failure|
      success.json { 
        Pusher["#{Rails.env}_global_room"].trigger('playlist:remove_from_queue', {:id => @song._id, :youtube_id => @song.youtube_id})
        render :json => true 
      }
      failure.json { render :json => false }
    }
  end
  
  private
  
  def set_current_queue
    @user_queue = UserQueue.last    
  end
  
  def render_current_song(play_to)
    render :json => {
                    :video_id => @user_queue.current_song, 
                    :play_to => play_to, 
                    :title => @user_queue.current_title
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
