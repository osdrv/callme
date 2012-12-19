# encoding: utf-8

class WidgetAction < Cramp::Action
  
  def app
    Callme::Application
  end
  
  def reload_template
    @@template = Haml::Engine.new( File.read( app.root( 'app/views/widget.haml' ) ) )
  end
  
  def start
    ssid = params[ :s ] || ""
    Session.find( ssid ) do |session|
      @session = session || Session.create
      @session.save! do
        reload_template unless app.env == 'production' && @@template.nil?
        render @@template.render( Object.new, :session => @session.to_json )
        finish
      end
    end
  end

end