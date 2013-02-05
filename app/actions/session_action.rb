# encoding: utf-8

class SessionAction < Cramp::Action
  
  @@_connections = {}
  
  self.transport = :websocket
  
  on_start :register_hooks
  on_finish :close_session
  on_data :message_received
  
  ACTION_PROXY_TABLE = {
    'peer' => 'invite',
    'accept' => 'accepted',
    'reject' => 'rejected',
    'hangup' => 'hanged_up'
  }

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
      ssid = message[ 'uuid' ]
      Session.find( ssid ) do |session|
        if session.nil?
          session = Session.new( ssid, {} )
        end
        @session = session
        @@_connections[ session.uuid.to_sym ] = self
        response :action => 'session.confirmed', :uuid => ssid, :user_data => session.user_data
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
    data[ 'action' ] = proxy_action( data.delete( 'action' ) )
    data[ 'sender' ] = @session.uuid
    connection.response( data ) if !connection.nil?
  end
  
  def proxy_action( action )
    ACTION_PROXY_TABLE[ action.to_s ]
  end

  def message_received( data )
    message = JSON.parse( data )
    p "message received: #{message}"
    
    if !message[ 'action' ].nil?
      call_hooks( message[ 'action' ], message )
    end
    
    if !message[ 'receiver' ].nil?
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