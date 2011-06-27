class UserQueue
  include Mongoid::Document

  belongs_to :user
  has_many :songs
end
