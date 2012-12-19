HttpRouter.new do
  add( '/' ).to( IndexAction )
  add( '/session' ).to( SessionAction )
  add( '/register' ).to( RegisterAction )
  add( '/widget' ).to( WidgetAction )
  add( '/test' ).to( TestAction )
end
