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
    connection.hset( table_name, uuid, ( user_data.to_json rescue '' ) ).callback &blk
  end
  
  def connection
    Callme::Application.redis
  end
  
  def table_name
    self.class.to_s
  end
  
  def destroy!
    connection.hdel( table_name, uuid )
  end
    
  
  class << self

    def create
      self.new.tap do |instance|
        instance.uuid = UUID.new.generate.to_s
      end
    end

    def find( uuid, &blk )
      connection.hget( table_name, uuid ).callback do |data|
        p data
      end
    end
    
    def all( &blk )
      connection.hgetall( table_name ).callback do |data|
        yield data
      end
    end
    
  end
  
end