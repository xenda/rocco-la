class RoomController < InheritedResources::Base

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



end