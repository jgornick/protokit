/*
  Credits:
    Juriy Zaytsev (http://github.com/kangax)
    Pat Nakajima (http://github.com/nakajima)
    Xilinus (http://github.com/xilinus)
*/
Object.extend(String.prototype, {
  _each: function() 
  {
    return Array.prototype._each.apply($w(String(this)), arguments);
  },
  
  camelcase: function() 
  {
    var string = this.dasherize().camelize();
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  makeElement: function() 
  {
    var wrapper = new Element('div'); wrapper.innerHTML = this;
    return wrapper.down();
  },
  
  toPermalink: function() 
  {
    return this.gsub(/\W+/, ' ').strip().dasherize().toLowerCase().gsub(/\ +/, '-');
  },
  
  without: function(substring) 
  {
    var _copy = this;
    var method = (typeof(substring) == 'string') ? 'replace' : 'gsub';
    return $A([_copy]).invoke(method, substring, '')[0];
  },
  
  uncapitalize: function() 
  {
    return this[0].toLowerCase() + this.slice(1);
  },
 
  titleize: function() 
  {
    var words = this.toLowerCase().gsub(/\W|\_/, ' ').split(/\s+/);
    return $A(words).invoke('capitalize').join(' ');
  },

  toMethodName: function() 
  {
    return this.titleize().without(/\s/).uncapitalize();
  },
  
  getFileExtension: function()
  {
    var match = this.match(/^(.*)(\.)(.*)$/);
    
    if (match != null) return match.last();
    
    return '';
  },
  
  namespace: function(parent) 
  {
    return this.split('.').inject(parent || window, function(object, property) 
    {
      return object[property] = object[property] || { };
    });
  },
  
  pad: function(length, chr, type)
  {
    if (typeof chr == 'undefined') chr = ' ';
    if (typeof type == 'undefined') type = 0;
    
    if (length == this.length) return this;
    
    var l = (length - this.length);
    var c = String(chr).times(l);
    
    if (type == 0) return c + this;
    else return this + c;
  },
  
  padLeft: function(length, chr)
  {
    return this.pad(length, chr, 0);
  },
  
  padRight: function(length, chr)
  {
    return this.pad(length, chr, 1);
  }
});

Object.extend(String.prototype, Enumerable);