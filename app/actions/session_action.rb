# encoding: utf-8

class SessionAction < Cramp::Action
  
  @@_connections = {}
  
  self.transport = :websocket
  
  on_start :register_hooks
  on_finish :close_session
  on_data :message_received
  
  def create_session( uuid )
    Session.find( uuid ) do |session|
      if session.nil?
        response :action => :session, :status => :rejected, :uuid => uuid
      else
        @@_connections[ session.uuid ] = self
        response :action => :session, :status => :confirmed, :uuid => session.uuid, :user_data => session.user_data
      end
    end
  end
  
  def close_session
    @@_connections.delete( @session.uuid ) rescue nil
    @session = null
    refresh_contact_list
  end
  
  def refresh_contact_list
    @@_connections.each_pair do |uuid, connection|
      connection.response :action => 'contacts.refresh', :sessions => items.reject { |sess|
        sess.uuid == uuid || sess.private?
      }.map(&:to_json)
    end
  end
  
  def register_hooks
    
    register_hook 'session.confirm' do |message|
      ssid = message[ 'sender' ]
      Session.find( ssid ) do |session|
        if !session.nil?
          @@_connections[ session.uuid ] = self
          response :action => 'session.confirmed', :receiver => ssid, :user_data => session.user_data
        else
          response :action => 'session.rejected', :receiver => ssid
        end
      end
    end
    
    register_hook 'contacts.refresh' do
      refresh_contact_list
    end
  end
  
  def register_hook( signature, &blk )
    ( ( @_hooks ||= Hash.new )[ signature.to_sym ] ||= [] ).push( blk )
  end
  
  def call_hooks( signature, data )
    ( ( @_hooks ||= Hash.new )[ signature.to_sym ] ||= [] ).each do |handler|
      handler.call( data )
    end
  end
  
  def proxy_to( connection, data )
    connection.response data
  end
  
  def message_received( data )
    # begin
      message = JSON.parse( data )
      p message
      
      if !message[ 'data' ].nil?
        call_hooks( message[ 'data' ][ 'action' ], message )
      end
      
      if !message[ 'receiver' ].nil?
        proxy_to( @@_connections[ message[ 'receiver' ].to_sym ], message )
      else
        
      end
        
      # case message[ 'action' ]
      # when 'session'
      #   save_session!( message )
      # when 'peer'
      #   peer_with!( message[ 'receiver' ], message[ 'session' ] )
      # when 'confirm'
      #   confirm_to!( message[ 'receiver' ], message[ 'session' ] )
      # when 'candidate'
      #   offer_candidate!( message[ 'candidate' ] )
      # end
    # rescue Exception => e
    #   p e
    # end
  end
  
  def offer_candidate!( candidate )
    @@_connections.keys.reject { |key|
      key == @session.uuid
    }.each do |key|
      @@_connections[ key ].response :action => :remote, :status => :candidate, :callee => @session.to_json, :candidate => candidate
    end
  end
  
  def save_session!( message )
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