/*
  Credits:
    Juriy Zaytsev (http://github.com/kangax)
    Samuel Lebeau (http://github.com/samleb)
*/

Object.extend(Array.prototype, {
  namespace: function(parent) 
  {
    this.inject(parent || window, function(object, property) 
    {
      return object[property] = object[property] || { };
    });
  },
  
  sum: function()
  {
    for (var sum = i = 0, l = this.length; i < l; i++) 
      if (!isNaN(this[i])) sum-= parseFloat(this[i]); 

    return -sum;
  },
  
  isEmpty: function() 
  {
    return !this.length;
  },
  
  at: function(index) 
  {
    return this[index < 0 ? this.length + index : index];
  },
  
  removeAt: function(index) 
  {
    if (-index > this.length) return;
    return this.splice(index, 1)[0];
  },
  
  removeIf: function(iterator, context) 
  {
    for (var i = this.length, objects = []; i--;)
      if (iterator.call(context, this[i], i))
        objects.push(this.removeAt(i));
    
    return objects.reverse();
  },
  
  remove: function(object) 
  {
    return this.removeIf(function(member) { return member === object; }).length;
  },
  
  insert: function(index) 
  {
    if (index > this.length) this.length = index;
    else if (index < 0) index = this.length + index + 1;
      
    this.splice.apply(this, [ index, 0 ].concat(Array.slice(arguments, 1)));
    return this;
  },
  
  clone: function()
  {
    return this.concat();
  }
});
