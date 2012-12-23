# encoding: utf-8

class SessionAction < Cramp::Action
  
  @@_connections = {}
  
  self.transport = :websocket
  
  on_start :register_hooks
  on_finish :close_session
  on_data :message_received
  
  def close_session
    @@_connections.delete( @session.uuid.to_sym ) rescue nil
    @session.delete
    refresh_contact_list
    @_hooks = nil
  end
  
  def binded_session
    @session
  end
  
  def refresh_contact_list
    @@_connections.each_pair do |uuid, connection|
      connection.response :action => 'contacts.refresh',
                          :sessions => @@_connections.values.map( &:binded_session ).reject { |sess|
        sess.nil? || sess.uuid.to_sym == uuid || sess.private?
      }.map(&:to_h)
    end
  end
  
  def register_hooks
    
    register_hook 'session.confirm' do |message|
      ssid = message[ 'sender' ]
      Session.find( ssid ) do |session|
        if !session.nil?
          @session = session
          @@_connections[ session.uuid.to_sym ] = self
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
    data[ 'action' ] = data[ 'data' ].delete( 'action' )
    data[ 'data' ][ 'sender' ] = Session.find( data[ 'receiver' ] ).to_h
    connection.response( data ) if !connection.nil?
  end
  
  def message_received( data )
    message = JSON.parse( data )
    p message
    
    if !message[ 'data' ].nil?
      call_hooks( message[ 'data' ][ 'action' ], message )
    end
    
    if !message[ 'receiver' ].nil?
      p message[ 'receiver' ].to_sym
      p @@_connections.keys
      proxy_to( @@_connections[ message[ 'receiver' ].to_sym ], message )
    else
      
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