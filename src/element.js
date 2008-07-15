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
  },
  
  wrapContent: function(element, wrapper, attributes) 
  {
    if (!(element = $(element))) return;
    
    if (Object.isElement(wrapper))
      $(wrapper).writeAttribute(attributes || { })
    else if (Object.isString(wrapper))
      wrapper = new Element(wrapper, attributes);
    else wrapper = new Element('div', wrapper);
    
    while (element.firstChild)
      wrapper.appendChild(element.firstChild)
    
    element.appendChild(wrapper);
    
    return element;
  },
  
	disableSelection: function(element, cursor)
  {
    element = $(element);
		cursor = cursor || 'default';
    
    element.__onselectstart = element.onselectstart;
		element.onselectstart = ProtoKit.falseFunction;
    
    element.unselectable = 'on';
    element.setTempStyles({
      MozUserSelect: 'none',
      cursor: cursor
    });
		
    return element;
	},
  
	enableSelection: function(element)
  {
		element = $(element);
    
    element.onselectstart = element.__onselectstart || ProtoKit.trueFunction;
    element.unselectable = 'off';
    
    element.removeTempStyles(['MozUserSelect', 'cursor']);

    return element;
	},
  
  setTempStyles: function(element, styles) 
  {
    element = $(element);
    
    for (var property in styles)
      element['_original_' + property] = element.style[property];

    return element.setStyle(styles);
  },
  
  removeTempStyles: function(element) 
  {
    element = $(element);
    
    var specifiedStyles = arguments[1];
    
    if (typeof specifiedStyles != 'undefined')
      if ((typeof specifiedStyles == 'object') && (!Object.isArray(specifiedStyles)))
        specifiedStyles = $H(specifiedStyles).keys();
          
    var prop, styles = {};
    for (var property in element) 
    {
      if (!property.startsWith('_original_')) continue;
      prop = property.replace(/^_original_/, '');
      
      // If there are specified styles, then only remove those temp styles.
      if ((typeof specifiedStyles != 'undefined') && (!specifiedStyles.include(prop))) continue;
      
      styles[prop] = element[property] || '';
      element[property] = undefined;
    }
    
    return element.setStyle(styles);
  },
  
  setAccessibleStyles: function(element)
  {
    element = $(element);
    
    return element.setTempStyles({
      visibility: 'hidden',
      position: 'absolute',
      display: 'block'
    });
  },
  
  removeAccessibleStyles: function(element)
  {
    element = $(element);
    
    return element.removeTempStyles(['visibility', 'position', 'display']);
  },
  
  isAccessible: function(element)
  {
    element = $(element);
    
    var display = element.getStyle('display');
    
    return !(display === 'none' || display === null || element.offsetHeight == 0);
  },
  
  indexOf: function(element) 
  {
    var parent = $(element.parentNode);
    if (!parent) return;
    return parent.childElements().indexOf(element);
  },
  
  isTagName: function(element, tagName) 
  {
    if (!element.tagName) return null;
    return element.tagName.toUpperCase() == String(tagName).toUpperCase();
  },

  delegate: function(element, eventName, selector, handler) 
  {  
    if (Object.isElement(selector)) 
    {
      return Event.observe(element, eventName, function(e) 
      {
        if (e.target == selector || e.target.descendantOf(selector))  
          handler.call(selector, e);
      });
    }
    else 
    {
      return Event.observe(element, eventName, function(e, element) 
      {
        if (!(element = e.findElement(selector))) return;
        handler.call(e.target, e);
      });
    }
  },
  
  fillDocument: function(element) 
  {
    element = $(element);
    
    var vpDim = document.viewport.getDimensions();
    var docDim = $(document.documentElement).getDimensions();
    
    return element.setStyle({
      width: Math.max(docDim.width, vpDim.width) + 'px',
      height: Math.max(docDim.height, vpDim.height) + 'px'
    });
  },
  
  centerInViewport: function(element) 
  {
   element = $(element);
   
   var vpDim = document.viewport.getDimensions();
   var offsets = document.viewport.getScrollOffsets();
   var elDim = Element.getDimensions(element);
   
   return element.setStyle({
     left: (((vpDim.width - elDim.width) / 2) + offsets.left) + 'px',
     top: (((vpDim.height - elDim.height) / 2) + offsets.top) + 'px'
   });
  }
});

document.delegate = Element.Methods.delegate.curry(document);

(function() 
{
  var _initPointer, _currentDraggable, _dragging;
    
  function _onMouseDown(event) 
  {
    var draggable = event.findElement('[element:draggable="true"]');
  
    if (draggable) 
    {
     event.stop();
     _currentDraggable = draggable;
     _initPointer = event.pointer();
    
     document.observe('mousemove', _onMouseMove).observe('mouseup', _onMouseUp);
    }
  };
  
  function _onMouseMove(event) 
  {
    event.stop();
  
    if (_dragging)
     _fireEvent('drag:update', event);
    else 
    {
      _dragging = true;
	    _fireEvent('drag:start', event);
    }
  };
  
  function _onMouseUp(event) 
  {
    document.stopObserving('mousemove', _onMouseMove).stopObserving('mouseup', _onMouseUp);
  
    if (_dragging) 
    {
     _dragging = false;
     _fireEvent('drag:end', event);
    }
  };
  
  function _fireEvent(eventName, mouseEvent) 
  {
    var pointer = mouseEvent.pointer();
  
    _currentDraggable.fire(eventName, {
     dx: pointer.x - _initPointer.x,
     dy: pointer.y - _initPointer.y,
     mouseEvent: mouseEvent
    });
  };
  
  Element.addMethods({
    enableDrag: function(element) 
    {
     element = $(element);
     return element.writeAttribute('element:draggable', 'true');
    },
    
    disableDrag: function(element)
    {
     element = $(element);
     return element.writeAttribute('element:draggable', null);
    },
    
    isDraggable: function(element) {
     return $(element).readAttribute('element:draggable') == 'true';
    }
  });
  
  document.observe('mousedown', _onMouseDown);
})();
