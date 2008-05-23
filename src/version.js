(function()
{
  function _diffVersion(a, b) 
  {
    // a = Comparing Version
    // b = This Version
    
    var newA = parseInt(a);
    var newB = parseInt(b);
    
    if (a == b) return 0;
     
    // Make sure both a and b are integers and subtract this version with
    // the comparing version.
    if ((!isNaN(newA)) && (!isNaN(newB))) return newB - newA;
  }
  
  ProtoKit.Version = Class.create({
    initialize: function(version)
    {
      this.major;
      this.minor;
      this.build;
      this.release;
      
      this.set(version);
    },
    
    set: function(version)
    {
      if (typeof version == 'undefined') return this;
      
      if (typeof version == 'string')
        version = version.split('.');

      if (Object.isArray(version)) 
      {
        this.major = version[0];
        this.minor = version[1];
        this.build = version[2];
        this.release = version[3];
      }
      else 
      {
        this.major = version.major;
        this.minor = version.minor;
        this.build = version.build;
        this.release = version.release;
      }
      
      return this;
    },
    
    toString: function()
    {
      var a = this.toArray();
      var s = '';
      
      for (var i = 0; i < a.length; i++)
        if (typeof a[i] != 'undefined') 
          s += a[i] + '.';
      
      return s.substr(0, s.length - 1);
    },
    
    toArray: function()
    {
      return [this.major, this.minor, this.build, this.release];
    },
    
    getDiff: function(version)
    {
      var diff = 0;
      
      thisVersion = this.toArray();
      
      if (version instanceof ProtoKit.Version)
        version = version.toArray();
      else if (typeof version == 'string')
        version = version.split('.');
      
      while ((thisVersion.length > 0) && ((diff = _diffVersion(version.shift(), thisVersion.shift())) == 0)) {}
      
      return diff;      
    },
    
    equal: function(version)
    {
      return (this.getDiff(version) == 0);
    },
    
    greaterThan: function(version)
    {
      return (this.getDiff(version) > 0)
    },
    
    lessThan: function(version)
    {
      return (this.getDiff(version) < 0)
    }
  });
})();
