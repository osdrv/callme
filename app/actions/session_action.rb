class SessionAction < Cramp::Action
  
  self.transport = :websocket
  
  on_start :register_session
  on_finish :close_session
  on_data :message_received
  
  def register_session
    p "session registered"
  end
  
  def close_session
    p "session closed"
  end
  
  def message_received( data )
    p "data received: "
    p data
  end
  
end