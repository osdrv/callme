# Check out https://github.com/joshbuddy/http_router for more information on HttpRouter
HttpRouter.new do
  add( '/' ).to( IndexAction )
  add( '/session' ).to( SessionAction )
end
