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
      @@_connections[ @session.uuid ] = self
      response :action => :session, :status => :created, :uuid => @session.uuid
    end
  end
  
  def close_session
    @@_connections.delete( @session.uuid )
    @session.destroy!
    refresh_contact_list
  end
  
  def refresh_contact_list
    Session.findAll( @@_connections.keys ) do |items|
      @@_connections.each_pair do |uuid, connection|
        connection.response :action => :contacts, :status => :refresh, :sessions => items.reject { |sess|
          sess.uuid == uuid || sess.private?
        }.map(&:to_json)
      end
    end
  end
  
  def message_received( data )
    begin
      message = JSON.parse( data )
      case message[ 'action' ]
      when 'session'
        save_session!( message )
      when 'peer'
        peer_with!( message[ 'receiver' ], message[ 'session' ] )
      when 'confirm'
        confirm_to!( message[ 'receiver' ], message[ 'session' ] )
      when 'candidate'
        offer_candidate!( message[ 'candidate' ] )
      end
    rescue Exception => e
      p e
    end
  end
  
  def offer_candidate!( candidate )
    @@_connections.keys.reject { |key|
      key == @session.uuid
    }.each do |key|
      @@_connections[ key ].response :action => :remote, :status => :candidate, :callee => @session.to_json, :candidate => candidate
    end
  end
  
  def save_session!( message )
    @session.user_data = message[ 'user_data' ]
    @session.save! do
      refresh_contact_list
    end
  end
  
  def peer_with!( receiver_uuid, session )
    receiver = @@_connections[ receiver_uuid ]
    return if receiver_uuid.nil? || receiver.nil? || session.nil?
    receiver.response :action => :remote, :status => :offer, :callee => @session.to_json, :session => session
  end
  
  def confirm_to!( receiver_uuid, session )
    receiver = @@_connections[ receiver_uuid ]
    return if receiver_uuid.nil? || receiver.nil? || session.nil?
    receiver.response :action => :remote, :status => :confirm, :callee => @session.to_json, :session => session
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