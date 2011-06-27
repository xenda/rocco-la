class HomeController < ApplicationController

  def index
    if UserQueue.count==0
      UserQueue.create
    end
    @queue = UserQueue.last
  end

  def add_to_queue
    queue = UserQueue.last
    queue.songs << Song.create(params[:video])
    queue.save
    render :json => queue.songs.to_json
  end
  
end
