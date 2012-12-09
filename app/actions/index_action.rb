class IndexAction < Cramp::Action
  
  on_start :reload_template
  
  def reload_template
    p @_env
    p "hello!"
  end
  
  @@template = Haml::Engine.new( File.read( Callme::Application.root( 'app/views/index.haml' ) ) )
  
  def start
    render @@template.render
    finish
  end
  
end