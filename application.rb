# encoding: utf-8

require "rubygems"
require "bundler"
require 'em-hiredis'
require 'json'

module Callme
  class Application

    def self.root(path = nil)
      @_root ||= File.expand_path(File.dirname(__FILE__))
      path ? File.join(@_root, path.to_s) : @_root
    end

    def self.env
      @_env ||= ENV['RACK_ENV'] || 'development'
    end

    def self.routes
      @_routes ||= eval(File.read('./config/routes.rb'))
    end

    def self.scripts
      @_scripts ||= %w(mt more object_with_handlers session remote contacts_box util video_box index)
    end

    def self.redis
      if @_redis.nil?
        @_redis = EM::Hiredis.connect
        @_redis.callback do
          @_redis.del( Session.table_name )
        end
      end
      @_redis
    end

    # Initialize the application
    def self.initialize!
      Cramp::Websocket.backend = :thin
    end

  end
end

Bundler.require(:default, Callme::Application.env)

# Preload application classes
%w(lib app).each do |loc|
  Dir["./#{loc}/**/*.rb"].each {|f| require f}
end
