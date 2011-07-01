class HomeController < ApplicationController

  def index
    @songs = current_room.songs
  end
  
end
