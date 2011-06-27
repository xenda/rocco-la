class Song
  include Mongoid::Document

  field :youtube_id, :type => String
  field :title, :type => String
  belongs_to :user_queue

end
