class Song
  include Mongoid::Document

  field :youtube_id, :type => String
  field :title, :type => String
  field :duration, :type => Integer
  belongs_to :user_queue

end
