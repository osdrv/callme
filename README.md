#CallMe App

## Introduction

CallMe App is a simple p2p video call web application built on top of [WebRTC](http://www.webrtc.org/).

## Features

![image](http://i.4pcbr.com/i/3c/1tJ7Qj.png)

You can call yourself! )))

No flash, no complicated video systems. Just pure javascript.

No video server is required. Just remote session exchange coordination.

## Requirements

Current version requires Chrome 23 or later.

## Backend

CallMe App uses [cramp](http://cramp.in) backend with WebSockets as primary transport and [redis](http://redis.io) as user session storage.

## Starting your own server

```bash
git clone https://github.com/4pcbr/callme.git
cd callme
bundle install
bundle exec thin --max-persistent-conns 1024 --timeout 0 -R config.ru -p 8080 start
```

You have to launch redis-server as well to get websockets working.

## Usage

After launching server instance launch your google chrome and open http://localhost:8000

You need 2 clients online minimum to make a calls.

## TODO

#### Functional TODO

* hangup button
* notify callee if partner was disconnected
* conference calls
* call request
* decline call if user is ringing
* rooms, invitations
* authorization with fb && google
* user profiles

#### Tech TODO

* JQUnit all around
* move all pub-sub actions to redis
* some mvc for frontend

## Code contribution

If you want to contribute this proj follow those simple steps:

1. Clone this repository
2. Make new feature branch
3. Make your changes
4. Make a pull request

## Feature contribution

1. Open an issue with subject
2. Write simple description of your feature
3. We will take it on free-for-all discussion