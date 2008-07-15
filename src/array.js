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
  },

  isUnique: function(value)
  {
    var idx = this.indexOf(value);
    return this.indexOf(value, idx + 1) == -1;  
  },
  
  sliceNonUnique: function() 
  {
    var result = [], clone = this.sort();
    
    for (var i=0, l=clone.length; i<l; i++) 
    {
      if (clone[i] === clone[i+1]) 
      {
        var temp = [];
        
        while (clone[i] === clone[i+1])
          temp.push(clone[i]); i++;
    
        if (clone[i] === clone[i-1]) 
          temp.push(clone[i]);
    
        result.push(temp);
      }
    }
    return result;
  }
});
