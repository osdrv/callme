# encoding: utf-8

class SessionAction < Cramp::Action
  
  @@_connections = {}
  
  self.transport = :websocket
  
  on_start :create_redis, :create_session
  on_finish :close_session
  on_data :message_received
  
  def create_redis
    Callme::Application.redis
  end
  
  def close_redis
    Callme::Application.redis.close_connection
  end
  
  def create_session
    @session = Session.create
    @session.save! do
      @@_connections[ @session.uuid ] = @session
      response :action => :session, :status => :created, :uuid => @session.uuid
    end
  end
  
  def close_session
    @@_connections.delete( @session.uuid )
    @session.destroy!
  end
  
  def message_received( data )
    begin
      message = JSON.parse( data )
      case message[ 'action' ]
      when 'session'
        @session.user_data = message[ 'user_data' ]
        p message
        @session.save! do
          Session.findAll( @@_connections.keys ) do |items|
            response :action => :contacts, :status => :refresh, :sessions => items.reject { |sess|
              sess.uuid == @session.uuid
            }.map(&:to_json)
          end
        end
      end
    rescue Exception => e
      p e
    end
  end
  
  def response( data )
    render data.to_json.force_encoding('utf-8')
  end
  
  protected
  
  # https://github.com/lifo/cramp/pull/39
  # пиздец, блядь
  def websockets_protocol_10?
    [7, 8, 9, 10, 13].include?(@env['HTTP_SEC_WEBSOCKET_VERSION'].to_i)
  end
  
end