(function()
{
  function _getElement(object)
  {
    return (object._eventElement = object._eventElement || new Element('code'));
  }
  
  Class.Observable = {
    observe: function(eventName, handler) 
    {
      _getElement(this).observe(eventName, handler);
      return this;
    },
    
    stopObserving: function(eventName, handler) 
    {
      _getElement(this).stopObserving(eventName, handler);
      return this;
    },
    
    fire: function(eventName, memo) 
    {
      _getElement(this).fire(eventName, memo);
      return this;
    }
  }
})();

Class.Watchable = Class.create({
  watch: function(prop, handler) 
  {
    // isFunction will return true for regexp (but it's too ugly to fix it here)
    if (Object.isUndefined(prop) || !Object.isFunction(handler))
      throw new TypeError('Wrong arguments supplied');
 
    if (!this.__watchable) this.__watchable = { };
    var w = this.__watchable;
 
    if (!w.clone) w.clone = { };
    w.clone[prop] = this[prop];
 
    if (!w.handlers) w.handlers = { };
    if (!w.handlers[prop]) w.handlers[prop] = [ ];
    if (!w.handlers[prop].include(handler)) w.handlers[prop].push(handler);
 
    if (!w.timer)
      w.timer = setInterval(this.__callback.bind(this), Class.Watchable.INTERVAL);
 
    return this;
  },
  
  unwatch: function(prop, handler) 
  {
    var w = this.__watchable;
    
    if (w.clone && w.clone[prop])
      if (handler)
        w.handlers[prop] = w.handlers[prop].without(handler);
      else
        w.handlers[prop] = [ ];
    
    return this;
  },
  
  __callback: function() 
  {
    var oldValue, handlers, w = this.__watchable;
    for (var prop in w.clone) 
    {
      if (w.clone[prop] != this[prop]) 
      {
        oldValue = w.clone[prop];
        w.clone[prop] = this[prop];
        handlers = w.handlers[prop];

        for (var i=0, l=handlers.length; i<l; i++)
          handlers[i].call(handlers[i], prop, oldValue, this[prop]);
      }
    }
  }
}); 
Class.Watchable.INTERVAL = 100;


Object.extend(Class.Methods, {
  extend: Object.extend.methodize(),
  
  addMethods: Class.Methods.addMethods.wrap(function(proceed, source) 
  {
    // ensure we are not trying to add null or undefined
    if (!source) return this;
    
    // no callback, vanilla way
    if (!source.hasOwnProperty('methodsAdded'))
      return proceed(source);
 
    var callback = source.methodsAdded;
    delete source.methodsAdded;
    proceed(source);
    callback.call(source, this);
    source.methodsAdded = callback;
 
    return this;
  }),
  
  addMethod: function(name, lambda) 
  {
    var methods = {};
    methods[name] = lambda;
    return this.addMethods(methods);
  },
  
  method: function(name) 
  {
    return this.prototype[name].valueOf();
  },
  
  classMethod: function() 
  {
    $A(arguments).flatten().each(function(method) 
    {
      this[method] = (function() 
      { 
        return this[method].apply(this, arguments); 
      }).bind(this.prototype);
    }, this);
    return this;
  },
  
  // prevent any call to this method
  undefMethod: function(name) 
  {
    this.prototype[name] = undefined;
    return this;
  },
  
  // remove the class' own implementation of this method
  removeMethod: function(name) 
  {
    delete this.prototype[name];
    return this;
  },
  
  aliasMethod: function(newName, name) 
  {
    this.prototype[newName] = this.prototype[name];
    return this;
  },
  
  aliasMethodChain: function(target, feature) 
  {
    feature = feature.camelcase();
        
    this.aliasMethod(target+"Without"+feature, target);
    this.aliasMethod(target, target+"With"+feature);
 
    return this;
  }
});