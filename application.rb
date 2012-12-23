# encoding: utf-8

require "rubygems"
require "bundler"
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
      @_scripts ||= %w(mt more object_with_handlers session remote incomming_box contacts_box control_box util video_box index)
    end
    
    def self.widget_scripts
      @_widget_scripts ||= %w(mt more callme util) + %w(cmrouter cmsession cmtransport cmuser).map{ |scr| "callme/#{scr}" }
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
