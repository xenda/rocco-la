class ApplicationController < ActionController::Base
  protect_from_forgery
  
  def current_room
    id = params[:id] || session[:current_room_id] 
    id ? Room.find(id) : Room.last
  end
  
  
end
