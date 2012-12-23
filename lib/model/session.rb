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
  
  def to_json
    {
      :uuid => uuid,
      :user_data => user_data
    }.to_json
  end
  
  def self.table_name
    self.to_s
  end

  def self.create
    self.new( UUID.new.generate.to_s, nil )
  end
    
  def self.find( uuid, &blk )
    res = ( @@_pool ||= Hash.new )[ uuid.to_sym ]
    blk.call( res ) if block_given?
    res
  end
end