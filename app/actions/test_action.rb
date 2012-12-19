# encoding: utf-8

class TestAction < Cramp::Action
  
  def app
    Callme::Application
  end
  
  def reload_template
    @@template = Haml::Engine.new( File.read( app.root( 'app/views/test.haml' ) ) )
  end
  
  def start
    reload_template unless app.env == 'production' && @@template.nil?
    render @@template.render
    finish
  end
  
end