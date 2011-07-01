class Room
  include Mongoid::Document

  field :name, :type => String
  has_many :users
  embeds_many :songs
  field :current_song, :type => String
  field :started_at, :type => DateTime, :default => DateTime.now
  
  REWIND = 0
  
  def change_song(time=nil)
    if one_song_remaining?
      set_current_song(songs.last,time)
    elsif more_than_one_song?
      if current_last_song?
        next_song = rewind_to_first
      else
        next_song = get_next_one
      end
    end
    current_song_instance.destroy
    set_current_song(next_song,time)
    self.reload
    send_to_pusher(REWIND)
  end
  
  def load_next_song(time=nil)
    reload
    seconds_to_go = 0
    if one_song_remaining?
       if already_playing?
         seconds_to_go = seconds_to_now
         set_current_song(songs.last)
       else
         set_current_song(songs.last,Time.now)            
       end
    elsif more_than_one_song?
      if already_playing?
        next_song = current_song_instance
        seconds_to_go = seconds_to_now
        return false
      else
        current_song_instance.destroy        
        next_song = get_next_one
      end
      set_current_song(next_song,time)
    end
    
    send_to_pusher(seconds_to_go)
  end
  
  def no_songs_remaining?
    songs.empty?
  end
  
  def seconds_to_now
    Time.now - started_at
  end
  
  def send_to_pusher(play_to=REWIND)
    Pusher["#{Rails.env}_global_room"].trigger('playlist:play_next', {:video_id => current_song, :play_to => play_to, :title => current_title })    
  end
  
  
  def already_playing?
    (started_at + current_song_instance.duration.seconds) > (Time.now + 20.seconds)
  end
  
  def get_next_one
    index = self.songs.index(current_song_instance)
    index = -1 if index == self.songs.size + 1
    self.songs[index+1]
    # self.songs.where(position: current_song_instance.position + 1).first
  end
  
  def current_title
    current_song_instance.title
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
    self.reload
    current_song ||= self.songs.where(youtube_id: self.current_song).first
    current_song ||= self.songs.first
    current_song
  end
  
end
