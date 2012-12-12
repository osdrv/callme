// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more/d77f91c8b0f1ea2e9e18d4f20963c591 
// Or build this file again with packager using: packager build More/URI More/URI.Relative More/Keyboard More/Keyboard.Extras
/*
---
copyrights:
  - [MooTools](http://mootools.net)

licenses:
  - [MIT License](http://mootools.net/license.txt)
...
*/
MooTools.More={version:"1.4.0.1",build:"a4244edf2aa97ac8a196fc96082dd35af1abab87"};String.implement({parseQueryString:function(d,a){if(d==null){d=true;
}if(a==null){a=true;}var c=this.split(/[&;]/),b={};if(!c.length){return b;}c.each(function(i){var e=i.indexOf("=")+1,g=e?i.substr(e):"",f=e?i.substr(0,e-1).match(/([^\]\[]+|(\B)(?=\]))/g):[i],h=b;
if(!f){return;}if(a){g=decodeURIComponent(g);}f.each(function(k,j){if(d){k=decodeURIComponent(k);}var l=h[k];if(j<f.length-1){h=h[k]=l||{};}else{if(typeOf(l)=="array"){l.push(g);
}else{h[k]=l!=null?[l,g]:g;}}});});return b;},cleanQueryString:function(a){return this.split("&").filter(function(e){var b=e.indexOf("="),c=b<0?"":e.substr(0,b),d=e.substr(b+1);
return a?a.call(null,c,d):(d||d===0);}).join("&");}});(function(){var b=function(){return this.get("value");};var a=this.URI=new Class({Implements:Options,options:{},regex:/^(?:(\w+):)?(?:\/\/(?:(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/,parts:["scheme","user","password","host","port","directory","file","query","fragment"],schemes:{http:80,https:443,ftp:21,rtsp:554,mms:1755,file:0},initialize:function(d,c){this.setOptions(c);
var e=this.options.base||a.base;if(!d){d=e;}if(d&&d.parsed){this.parsed=Object.clone(d.parsed);}else{this.set("value",d.href||d.toString(),e?new a(e):false);
}},parse:function(e,d){var c=e.match(this.regex);if(!c){return false;}c.shift();return this.merge(c.associate(this.parts),d);},merge:function(d,c){if((!d||!d.scheme)&&(!c||!c.scheme)){return false;
}if(c){this.parts.every(function(e){if(d[e]){return false;}d[e]=c[e]||"";return true;});}d.port=d.port||this.schemes[d.scheme.toLowerCase()];d.directory=d.directory?this.parseDirectory(d.directory,c?c.directory:""):"/";
return d;},parseDirectory:function(d,e){d=(d.substr(0,1)=="/"?"":(e||"/"))+d;if(!d.test(a.regs.directoryDot)){return d;}var c=[];d.replace(a.regs.endSlash,"").split("/").each(function(f){if(f==".."&&c.length>0){c.pop();
}else{if(f!="."){c.push(f);}}});return c.join("/")+"/";},combine:function(c){return c.value||c.scheme+"://"+(c.user?c.user+(c.password?":"+c.password:"")+"@":"")+(c.host||"")+(c.port&&c.port!=this.schemes[c.scheme]?":"+c.port:"")+(c.directory||"/")+(c.file||"")+(c.query?"?"+c.query:"")+(c.fragment?"#"+c.fragment:"");
},set:function(d,f,e){if(d=="value"){var c=f.match(a.regs.scheme);if(c){c=c[1];}if(c&&this.schemes[c.toLowerCase()]==null){this.parsed={scheme:c,value:f};
}else{this.parsed=this.parse(f,(e||this).parsed)||(c?{scheme:c,value:f}:{value:f});}}else{if(d=="data"){this.setData(f);}else{this.parsed[d]=f;}}return this;
},get:function(c,d){switch(c){case"value":return this.combine(this.parsed,d?d.parsed:false);case"data":return this.getData();}return this.parsed[c]||"";
},go:function(){document.location.href=this.toString();},toURI:function(){return this;},getData:function(e,d){var c=this.get(d||"query");if(!(c||c===0)){return e?null:{};
}var f=c.parseQueryString();return e?f[e]:f;},setData:function(c,f,d){if(typeof c=="string"){var e=this.getData();e[arguments[0]]=arguments[1];c=e;}else{if(f){c=Object.merge(this.getData(),c);
}}return this.set(d||"query",Object.toQueryString(c));},clearData:function(c){return this.set(c||"query","");},toString:b,valueOf:b});a.regs={endSlash:/\/$/,scheme:/^(\w+):/,directoryDot:/\.\/|\.$/};
a.base=new a(Array.from(document.getElements("base[href]",true)).getLast(),{base:document.location});String.implement({toURI:function(c){return new a(this,c);
}});})();Class.refactor=function(b,a){Object.each(a,function(e,d){var c=b.prototype[d];c=(c&&c.$origin)||c||function(){};b.implement(d,(typeof e=="function")?function(){var f=this.previous;
this.previous=c;var g=e.apply(this,arguments);this.previous=f;return g;}:e);});return b;};URI=Class.refactor(URI,{combine:function(f,e){if(!e||f.scheme!=e.scheme||f.host!=e.host||f.port!=e.port){return this.previous.apply(this,arguments);
}var a=f.file+(f.query?"?"+f.query:"")+(f.fragment?"#"+f.fragment:"");if(!e.directory){return(f.directory||(f.file?"":"./"))+a;}var d=e.directory.split("/"),c=f.directory.split("/"),g="",h;
var b=0;for(h=0;h<d.length&&h<c.length&&d[h]==c[h];h++){}for(b=0;b<d.length-h-1;b++){g+="../";}for(b=h;b<c.length-1;b++){g+=c[b]+"/";}return(g||(f.file?"":"./"))+a;
},toAbsolute:function(a){a=new URI(a);if(a){a.set("directory","").set("file","");}return this.toRelative(a);},toRelative:function(a){return this.get("value",new URI(a));
}});(function(){Events.Pseudos=function(h,e,f){var d="_monitorEvents:";var c=function(i){return{store:i.store?function(j,k){i.store(d+j,k);}:function(j,k){(i._monitorEvents||(i._monitorEvents={}))[j]=k;
},retrieve:i.retrieve?function(j,k){return i.retrieve(d+j,k);}:function(j,k){if(!i._monitorEvents){return k;}return i._monitorEvents[j]||k;}};};var g=function(k){if(k.indexOf(":")==-1||!h){return null;
}var j=Slick.parse(k).expressions[0][0],p=j.pseudos,i=p.length,o=[];while(i--){var n=p[i].key,m=h[n];if(m!=null){o.push({event:j.tag,value:p[i].value,pseudo:n,original:k,listener:m});
}}return o.length?o:null;};return{addEvent:function(m,p,j){var n=g(m);if(!n){return e.call(this,m,p,j);}var k=c(this),r=k.retrieve(m,[]),i=n[0].event,l=Array.slice(arguments,2),o=p,q=this;
n.each(function(s){var t=s.listener,u=o;if(t==false){i+=":"+s.pseudo+"("+s.value+")";}else{o=function(){t.call(q,s,u,arguments,o);};}});r.include({type:i,event:p,monitor:o});
k.store(m,r);if(m!=i){e.apply(this,[m,p].concat(l));}return e.apply(this,[i,o].concat(l));},removeEvent:function(m,l){var k=g(m);if(!k){return f.call(this,m,l);
}var n=c(this),j=n.retrieve(m);if(!j){return this;}var i=Array.slice(arguments,2);f.apply(this,[m,l].concat(i));j.each(function(o,p){if(!l||o.event==l){f.apply(this,[o.type,o.monitor].concat(i));
}delete j[p];},this);n.store(m,j);return this;}};};var b={once:function(e,f,d,c){f.apply(this,d);this.removeEvent(e.event,c).removeEvent(e.original,f);
},throttle:function(d,e,c){if(!e._throttled){e.apply(this,c);e._throttled=setTimeout(function(){e._throttled=false;},d.value||250);}},pause:function(d,e,c){clearTimeout(e._pause);
e._pause=e.delay(d.value||250,this,c);}};Events.definePseudo=function(c,d){b[c]=d;return this;};Events.lookupPseudo=function(c){return b[c];};var a=Events.prototype;
Events.implement(Events.Pseudos(b,a.addEvent,a.removeEvent));["Request","Fx"].each(function(c){if(this[c]){this[c].implement(Events.prototype);}});})();
(function(){var d={relay:false},c=["once","throttle","pause"],b=c.length;while(b--){d[c[b]]=Events.lookupPseudo(c[b]);}DOMEvent.definePseudo=function(e,f){d[e]=f;
return this;};var a=Element.prototype;[Element,Window,Document].invoke("implement",Events.Pseudos(d,a.addEvent,a.removeEvent));})();(function(){var a="$moo:keys-pressed",b="$moo:keys-keyup";
DOMEvent.definePseudo("keys",function(d,e,c){var g=c[0],f=[],h=this.retrieve(a,[]);f.append(d.value.replace("++",function(){f.push("+");return"";}).split("+"));
h.include(g.key);if(f.every(function(j){return h.contains(j);})){e.apply(this,c);}this.store(a,h);if(!this.retrieve(b)){var i=function(j){(function(){h=this.retrieve(a,[]).erase(j.key);
this.store(a,h);}).delay(0,this);};this.store(b,i).addEvent("keyup",i);}});DOMEvent.defineKeys({"16":"shift","17":"control","18":"alt","20":"capslock","33":"pageup","34":"pagedown","35":"end","36":"home","144":"numlock","145":"scrolllock","186":";","187":"=","188":",","190":".","191":"/","192":"`","219":"[","220":"\\","221":"]","222":"'","107":"+"}).defineKey(Browser.firefox?109:189,"-");
})();(function(){var a=this.Keyboard=new Class({Extends:Events,Implements:[Options],options:{defaultEventType:"keydown",active:false,manager:null,events:{},nonParsedEvents:["activate","deactivate","onactivate","ondeactivate","changed","onchanged"]},initialize:function(f){if(f&&f.manager){this._manager=f.manager;
delete f.manager;}this.setOptions(f);this._setup();},addEvent:function(h,g,f){return this.parent(a.parse(h,this.options.defaultEventType,this.options.nonParsedEvents),g,f);
},removeEvent:function(g,f){return this.parent(a.parse(g,this.options.defaultEventType,this.options.nonParsedEvents),f);},toggleActive:function(){return this[this.isActive()?"deactivate":"activate"]();
},activate:function(f){if(f){if(f.isActive()){return this;}if(this._activeKB&&f!=this._activeKB){this.previous=this._activeKB;this.previous.fireEvent("deactivate");
}this._activeKB=f.fireEvent("activate");a.manager.fireEvent("changed");}else{if(this._manager){this._manager.activate(this);}}return this;},isActive:function(){return this._manager?(this._manager._activeKB==this):(a.manager==this);
},deactivate:function(f){if(f){if(f===this._activeKB){this._activeKB=null;f.fireEvent("deactivate");a.manager.fireEvent("changed");}}else{if(this._manager){this._manager.deactivate(this);
}}return this;},relinquish:function(){if(this.isActive()&&this._manager&&this._manager.previous){this._manager.activate(this._manager.previous);}else{this.deactivate();
}return this;},manage:function(f){if(f._manager){f._manager.drop(f);}this._instances.push(f);f._manager=this;if(!this._activeKB){this.activate(f);}return this;
},drop:function(f){f.relinquish();this._instances.erase(f);if(this._activeKB==f){if(this.previous&&this._instances.contains(this.previous)){this.activate(this.previous);
}else{this._activeKB=this._instances[0];}}return this;},trace:function(){a.trace(this);},each:function(f){a.each(this,f);},_instances:[],_disable:function(f){if(this._activeKB==f){this._activeKB=null;
}},_setup:function(){this.addEvents(this.options.events);if(a.manager&&!this._manager){a.manager.manage(this);}if(this.options.active){this.activate();
}else{this.relinquish();}},_handle:function(h,g){if(h.preventKeyboardPropagation){return;}var f=!!this._manager;if(f&&this._activeKB){this._activeKB._handle(h,g);
if(h.preventKeyboardPropagation){return;}}this.fireEvent(g,h);if(!f&&this._activeKB){this._activeKB._handle(h,g);}}});var b={};var c=["shift","control","alt","meta"];
var e=/^(?:shift|control|ctrl|alt|meta)$/;a.parse=function(h,g,k){if(k&&k.contains(h.toLowerCase())){return h;}h=h.toLowerCase().replace(/^(keyup|keydown):/,function(m,l){g=l;
return"";});if(!b[h]){var f,j={};h.split("+").each(function(l){if(e.test(l)){j[l]=true;}else{f=l;}});j.control=j.control||j.ctrl;var i=[];c.each(function(l){if(j[l]){i.push(l);
}});if(f){i.push(f);}b[h]=i.join("+");}return g+":keys("+b[h]+")";};a.each=function(f,g){var h=f||a.manager;while(h){g.run(h);h=h._activeKB;}};a.stop=function(f){f.preventKeyboardPropagation=true;
};a.manager=new a({active:true});a.trace=function(f){f=f||a.manager;var g=window.console&&console.log;if(g){console.log("the following items have focus: ");
}a.each(f,function(h){if(g){console.log(document.id(h.widget)||h.wiget||h);}});};var d=function(g){var f=[];c.each(function(h){if(g[h]){f.push(h);}});if(!e.test(g.key)){f.push(g.key);
}a.manager._handle(g,g.type+":keys("+f.join("+")+")");};document.addEvents({keyup:d,keydown:d});})();Keyboard.prototype.options.nonParsedEvents.combine(["rebound","onrebound"]);
Keyboard.implement({addShortcut:function(b,a){this._shortcuts=this._shortcuts||[];this._shortcutIndex=this._shortcutIndex||{};a.getKeyboard=Function.from(this);
a.name=b;this._shortcutIndex[b]=a;this._shortcuts.push(a);if(a.keys){this.addEvent(a.keys,a.handler);}return this;},addShortcuts:function(b){for(var a in b){this.addShortcut(a,b[a]);
}return this;},removeShortcut:function(b){var a=this.getShortcut(b);if(a&&a.keys){this.removeEvent(a.keys,a.handler);delete this._shortcutIndex[b];this._shortcuts.erase(a);
}return this;},removeShortcuts:function(a){a.each(this.removeShortcut,this);return this;},getShortcuts:function(){return this._shortcuts||[];},getShortcut:function(a){return(this._shortcutIndex||{})[a];
}});Keyboard.rebind=function(b,a){Array.from(a).each(function(c){c.getKeyboard().removeEvent(c.keys,c.handler);c.getKeyboard().addEvent(b,c.handler);c.keys=b;
c.getKeyboard().fireEvent("rebound");});};Keyboard.getActiveShortcuts=function(b){var a=[],c=[];Keyboard.each(b,[].push.bind(a));a.each(function(d){c.extend(d.getShortcuts());
});return c;};Keyboard.getShortcut=function(c,b,d){d=d||{};var a=d.many?[]:null,e=d.many?function(g){var f=g.getShortcut(c);if(f){a.push(f);}}:function(f){if(!a){a=f.getShortcut(c);
}};Keyboard.each(b,e);return a;};Keyboard.getShortcuts=function(b,a){return Keyboard.getShortcut(b,a,{many:true});};