class HomeController < ApplicationController

  def index
    @songs = current_room.songs
  end

  def add_to_queue
    queue = UserQueue.last
    song = Song.create(params[:video])
    song.position = queue.songs ? queue.songs.size + 1 : 1
    song.save
    
    Pusher["#{Rails.env}_global_room"].trigger('playlist:add_to_queue', {:_id => song._id, :title => song.title, :youtube_id => song.youtube_id })
    
    queue.songs << song
    queue.reload
    render :json => queue.songs.last
  end
  
end
