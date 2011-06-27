class UserQueue
  include Mongoid::Document

  embeds_one :user, class_name: "User", inverse_of: :dj
end
