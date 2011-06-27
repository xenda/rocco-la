class UserQueue
  include Mongoid::Document

  field :current_song, :type => String
  field :started_at, :type => DateTime
  belongs_to :user
  has_many :songs
  
  def load_next_song(time=nil)
    if one_song_remaining?
      set_current_song(songs.last,time)
    elsif more_than_one_song?
      if current_last_song?
        next_song = rewind_to_first
      else
        next_song = get_next_one
      end
      set_current_song(next_song,time)
      current_song_instance.destroy
      self.reload
    end
  end
  
  def get_next_one
    self.songs.where(position: current_song_instance.position + 1).first
  end
  
  def rewind_to_first
    self.songs.first
  end
  
  def one_song_remaining?
    self.songs.size == 1
  end
  
  def more_than_one_song?
    self.songs.size > 1
  end
  
  def current_last_song?
    current_song_instance == self.songs.last
  end
  
  def set_current_song(song,time=nil)
    self.current_song = song.youtube_id
    self.started_at = time if time
    self.save
  end
  
  def current_song_instance
    @current_song ||= self.songs.where(youtube_id: self.current_song).first
  end
  
end
