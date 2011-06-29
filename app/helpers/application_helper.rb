module ApplicationHelper

  def facebook_like(url)
    content_tag :iframe, nil, :src => "http://www.facebook.com/plugins/like.php?href=#{CGI::escape(url)}&layout=standard&show_faces=true&width=150&action=like&font&colorscheme=light&height=30", :scrolling => 'no', :frameborder => '0', :allowtransparency => true, :id => :facebook_like, :style => "width:150px;height:30px"
  end

end
