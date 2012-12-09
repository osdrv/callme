class SessionAction < Cramp::Action
  
  on_start :register_session
  on_finish :close_session
  
  def register_session
    p "session registered"
  end
  
  def close_session
    p "session closed"
  end
  
end