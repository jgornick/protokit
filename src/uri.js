(function()
{
  var _regExp = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(.*)/;
  
  function _getVal(r, i) 
  {
		if (!r) return;
		return r[i];
	}
   
  ProtoKit.URI = Class.create({
  	initialize: function(uri) 
    {
      var r = [];
            
      if (typeof uri == 'object' && typeof uri.toString == 'function') uri = uri.toString();
  		if (typeof uri != 'undefined') r = uri.match(_regExp);
      
  		if (!r) throw 'Invalid URI';
  		
      this.url         = _getVal(r,0);
  		this.protocol	   = (Object.isUndefined(_getVal(r,2))) ? 'http' : _getVal(r,2);
  		this.username	   = _getVal(r,4);
  		this.password	   = _getVal(r,5);
  		this.host		     = _getVal(r,6);
  		this.port		     = _getVal(r,7);
  		this.pathname    = _getVal(r,8);
  		this.query       = (_getVal(r,9)) ? _getVal(r,9).toQueryParams() : _getVal(r,9);
  		this.fragment	   = (_getVal(r,10) == '') ? undefined : _getVal(r,10);	
  	},
     
    toString: function()
    {
  		var output = $A();
      
      output.push(Object.isUndefined(this.protocol) ? '' : this.protocol + '://');
      output.push(Object.isUndefined(this.username) ? '' : this.username);
      output.push(Object.isUndefined(this.password) ? (Object.isUndefined(this.username) ? '' : '@') : ':' + this.password + '@');
      output.push(Object.isUndefined(this.host) ? '' : this.host);
      output.push(Object.isUndefined(this.port) ? '' : ':' + this.port);
      output.push(Object.isUndefined(this.pathname) ? '' : this.pathname);
      output.push(Object.isUndefined(this.query) ? '' : '?' + decodeURIComponent($H(this.query).toQueryString()));    
      output.push(Object.isUndefined(this.fragment) ? '' : '#' + this.fragment);
      
      return output.join('');
    }
  });
})();

function $U(uri) 
{
  return new ProtoKit.URI(uri);
}