class Room
  include Mongoid::Document

  field :name, :type => String
  field :description
  embeds_many :users
end
