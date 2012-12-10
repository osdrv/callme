class Session
  
  attr_accessor :uuid
  attr_accessor :user_data
  
  def save( &blk )
    begin
      save!( blk )
      return true
    rescue Exception => e
      return false
    end
  end
  
  def save!( &blk )
    self.class.connection.hset(
      self.class.table_name,
      uuid,
      ( user_data.to_json rescue '' )
    ).callback &blk
  end
  
  def destroy!
    self.class.connection.hdel( self.class.table_name, uuid )
  end
  
  def to_json
    {
      :uuid => uuid,
      :user_data => user_data
    }.to_json
  end
  
  class << self

    def connection
      Callme::Application.redis
    end
    
    def table_name
      self.to_s
    end

    def create
      self.new.tap do |instance|
        instance.uuid = UUID.new.generate.to_s
      end
    end

    def findAll( ids, &blk )
      connection.hmget( table_name, *ids ).callback do |data|
        res = []
        data.each_index do |idx|
          next unless !data[ idx ].empty? && data[ idx ] != 'null'
          res.push self.new.tap { |instance|
            instance.uuid = ids[ idx ]
            instance.user_data = JSON.parse( data[ idx ] )
          }
        end
        
        blk.call( res )
      end
      
    end

    def find( uuid, &blk )
      connection.hget( table_name, uuid ).callback do |data|
        p data
      end
    end
    
    def all( &blk )
      connection.hgetall( table_name ).callback do |data|
        p data
        blk.call( data )
      end
    end
    
  end
  
end