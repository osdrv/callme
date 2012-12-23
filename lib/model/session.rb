class Session
  
  attr_accessor :uuid
  attr_accessor :user_data
  
  def initialize( uuid, user_data )
    self.uuid = uuid
    self.user_data = user_data
  end
  
  # TODO: some private logic
  def private?
    false
  end
  
  def save
    ( @@_pool ||= Hash.new )[ uuid.to_sym ] = self
    yield if block_given?
  end
  
  def delete
    ( @@_pool ||= Hash.new ).delete uuid.to_sym
  end
  
  def to_h
    {
      :uuid => uuid,
      :user_data => user_data
    }
  end
  
  def to_json
    to_h.to_json
  end
  
  def self.table_name
    self.to_s
  end

  def self.create
    self.new( UUID.new.generate.to_s, nil )
  end
    
  def self.find( uuid, &blk )
    res = uuid.nil? ? nil : ( @@_pool ||= Hash.new )[ uuid.to_sym ]
    blk.call( res ) if block_given?
    res
  end
end