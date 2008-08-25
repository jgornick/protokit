Object.extend(Function.prototype, {
  _new: function() 
  {
    var __method = this, args = $A(arguments);
    function C() { return __method.apply(this, args); };
    C.prototype = __method.prototype;
    return new C;
  },
  
  not: function() 
  {
    var f = this;
    return function() { return !f.apply(f, arguments); };
  },
  
  runOnce: function() 
  {
    this.apply(this, arguments);
    return this;
  },
  
  toDelayed: function(timeout) 
  {
    var __method = this;
    return function() 
    {
      var args = $A(arguments);
      setTimeout(function(){ __method.apply(__method, args) }, timeout * 1000);
    }
  },

  toDeferred: function() 
  {
    return this.toDelayed(0.01);
  },
  
  addAdvice: function(advices) 
  {
    return this.wrap(function() 
    {
      var args = $A(arguments), proceed = args.shift();
      var a = advices, bf = a.before, ar = a.around, af = a.after;
      bf && bf.apply(proceed, args);
      ar && ar.apply(proceed, args);
      var result = proceed.apply(proceed, args);
      ar && ar.apply(proceed, result);
      af && af.apply(proceed, result);
      return result;
    });
  }
});

Object.extend(Function, {
  K: function(k)
  {
    return function() { return k; };
  }
});