# encoding: utf-8

class RegisterAction < Cramp::Action
  
  def start
    session = Session.create
    session.user_data = params[ :user ]
    session.save! do
      render session.uuid
      finish
    end
  end
  
end