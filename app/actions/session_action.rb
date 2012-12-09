# encoding: utf-8

class SessionAction < Cramp::Action
  
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
      response :action => :session, :status => :created, :uuid => @session.uuid
    end
  end
  
  def close_session
    @session.destroy!
  end
  
  def message_received( data )
    p "data received: "
    p data
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