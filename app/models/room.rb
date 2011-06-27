class Room
  include Mongoid::Document

  field :name, :type => String
  field :description
  has_many :users
end
