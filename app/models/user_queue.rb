class UserQueue
  include Mongoid::Document

  field :current_song, :type => String
  field :started_at, :type => DateTime
  belongs_to :user
  has_many :songs
end
