class SongsController < InheritedResources::Base
  respond_to :json

  def destroy
    destroy!{|success,failure|
      success.json { 
        Pusher["#{Rails.env}_global_room"].trigger('playlist:remove_from_queue', {:id => @song._id, :youtube_id => @song.youtube_id})
        render :json => true 
      }
      failure.json { render :json => false }
    }
  end
  
end
