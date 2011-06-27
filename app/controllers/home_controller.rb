class HomeController < ApplicationController

  def index
    if UserQueue.count==0
      UserQueue.create
    end
    @queue = UserQueue.last
    @songs = @queue.songs.reverse
  end

  def add_to_queue
    queue = UserQueue.last
    queue.songs << Song.create(params[:video])
    queue.reload
    render :json => queue.songs.last
  end
  
end
