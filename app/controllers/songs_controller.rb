class SongsController < InheritedResources::Base
  
  respond_to :json
  
  def current
    user_queue = UserQueue.last
    unless user_queue.songs.empty?
      current_time = Time.now
      unless user_queue.current_song 
        user_queue.current_song = user_queue.songs.last.youtube_id
        user_queue.started_at = current_time 
        user_queue.save
      end
      play_to = current_time - user_queue.started_at
      video_id = user_queue.current_song
      render :json => {:video_id => video_id, :play_to => play_to, :title => ""}
    else
      render :json => {:video_id => "57tK6aQS_H0", :play_to => 0, :title => ""}
    end
  end
  
end