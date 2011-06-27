class UserQueue
  include Mongoid::Document

  field :current_song, :type => String
  field :started_at, :type => DateTime
  belongs_to :user
  has_many :songs
  
  def load_next_song(time=nil)
    if self.songs.size == 1
      self.current_song = songs.last.youtube_id
      self.started_at = time if time
      self.save
    elsif self.songs.size > 1
      current = Song.where(youtube_id: self.current_song).first
      puts current.inspect
      puts self.songs.inspect
      index = self.songs.index(current)
      index = -1  if index == (self.songs.size - 1)
      puts index
      next_song = songs[index+1]
      puts next_song.inspect
      self.current_song = next_song.youtube_id
      self.started_at = time if time
      self.save
    end
  end
  
end
