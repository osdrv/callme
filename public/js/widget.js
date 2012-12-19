(function(_d){
  if (_d&&_d.write) {
    var _ck = function(n) {
    	var c=" "+_d.cookie,s=" "+n+"=",res=null,off=0,e=0,l="length",iof="indexOf";
    	if(c[l]>0){off=c[iof](s);if(off!=-1){off+=s[l];e=c[iof](";",off);if(e==-1)e=c[l];res=unescape(c.substring(off, e));}}
    	return res;
    }, M = Math,ssid=_ck('wb_ssid')||"tmp_"+M.round(M.random()*1e6);
    _d.write("<iframe src='http://127.0.0.1:8080/widget?s="+ssid+"' width='230' height='230' frameborder='0'></iframe>");
  }
})(document);