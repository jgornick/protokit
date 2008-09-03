document.loadScript = function(url) {
  var options = Object.extend({ 
    onComplete: Prototype.emptyFunction,
    breakCache: true
  }, arguments[1]);
  
  // TODO: Validate url
            
  var script = new Element('script', {type: 'text/javascript', charset: 'utf-8'});
  
  var _onComplete = function() {
    options.onComplete.apply(this, arguments);
    
    // Remove the script from the head.  This will not affect what's been
    // loaded/evaluated from the script
    script.remove();
  };

  // Setup our onload handler
  // NOTE: This will fire even if the file is 404'd
  script.onload = function() {
    _onComplete(url);
    return;
  };      
  
  // Setup our onreadystatechange handler
  // NOTE: The readyState will be set to loaded even if the file is 404'd
  // NOTE: Opera 9+ supports both onload and onreadstatechange, don't use 
  // onreadystatechange in Opera.
  if (!Prototype.Browser.Opera) {
    script.onreadystatechange = function() {
      if (/loaded|complete/.test(script.readyState))
        _onComplete(url);
    }
  }

  // Check to see if we need to add a unique query param to break cache
  if (options.breakCache) { 
    var query = $H({'unique' : Math.random()}); 
    var index = url.indexOf('?'); 
    
    if (index != -1) { 
      query.merge(url.substr(index).toQueryParams()); 
      url = url.substr(0, index); 
    }
    
    url += '?' + query.toQueryString(); 
  }

  script.src = url;
  
  // Insert the script into our head.
  $$("head")[0].appendChild(script);
  
  
  // Safari 2 doesn't support either onload or readystate, wait for it.
  if (Prototype.Browser.WebKit && !navigator.userAgent.match(/Version\/3/)) {
    if (typeof ProtoKit.__scriptTimers == 'undefined')
      ProtoKit.__scriptTimers = $A();
      
    ProtoKit.__scriptTimers[url] = setInterval(function() {
      if (/loaded|complete/.test(document.readyState)) {
        clearInterval(ProtoKit.__scriptTimers[url]);
        _onComplete(url);
      }
    }, 100);    
  }
};