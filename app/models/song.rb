class Song
  include Mongoid::Document

  field :youtube_id, :type => String
  field :title, :type => String
  field :duration, :type => Integer

  belongs_to :user
  embedded_in :room_queue
  
end
