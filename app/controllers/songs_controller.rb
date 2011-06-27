class SongsController < InheritedResources::Base
  
  respond_to :json
  
  def current
    render :json => {:video_id => "57tK6aQS_H0", :play_to => 0}
  end
  
end