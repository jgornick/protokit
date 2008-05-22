/*
  Credits:
    Juriy Zaytsev (http://github.com/kangax)
*/

Element.addMethods({
  _observe: Element.observe.wrap(function(proceed, element, eventName, handler) 
  {
    return proceed.call(proceed, element, eventName, function(e) 
    {
      Event.stop(e); handler.call(e.target, e);
    });
  }),
  
  contains: function(element, pattern) 
  {
    element = $(element);
    if (!pattern) return false;
    pattern = pattern.constructor == RegExp ? pattern : RegExp.escape(pattern);
    return !!element.innerHTML.stripTags().match(pattern);
  },
  
  toTemplate: function(element) 
  {
    if (!(element = $(element))) return null;
    return element.wrap().show().up().remove().innerHTML;
  },
  
  replaceAttribute: function(element, attr, pattern, replacement) 
  {
    element = $(element);
    return el.writeAttribute(attr, element.readAttribute(attr)
      .replace(new RegExp(pattern), replacement)
    );
  },
  
  replaceHTML: function(element, pattern, replacement) 
  {
    element = $(element);
    return element.update(
      element.innerHTML.replace(new RegExp(pattern), replacement)
    );
  },
  
  toHTML: function(element) 
  {
    element = $(element);
    
    try 
    {
      var xmlSerializer = new XMLSerializer();
      return element.nodeType == 4
        ? element.nodeValue
        : xmlSerializer.serializeToString(element);
    } 
    catch(e) 
    {
      return (element.xml
        || element.outerHTML
        || element.cloneNode(true).wrap().innerHTML);
    }
  },
  
  addHoverClassName: function(element, className) 
  {
    return $(element).observe('mouseover', Element.addClassName.curry(element, className))
      .observe('mouseout', Element.removeClassName.curry(element, className));
  },
  
  setProperty: function(element, name, value) 
  {
    if (!(element = $(element))) return;
    element[name] = value;
    return element;
  },
  
  swapClassName: function(element, first, second) 
  {
    return Element.removeClassName(element, first).addClassName(second);
  },
  
  enableClassName: function(element, className, condition) 
  {
    return Element[condition ? 'addClassName' : 'removeClassName'](element, className);
  } 
});