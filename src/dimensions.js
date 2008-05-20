/*
  Credits:
    Andrew Dupont (http://github.com/savetheclocktower)
*/
(function()
{
  var _ieBorderWidthKeywords = {
    thin: 2,
    medium: 4,
    thick: 6
  };
  
  function getIEPixelValue(element, value, cssProperty, pixelName)
  {
    element = $(element);
    
    // Check for a pixel value. If px is found in the value, then no need to go further.    
    if (/^\d+px?$/.test(value)) 
    {
      return parseInt(value, 10);
    } 
    else 
    {
      // Get the original style and runtime style.
      var originalStyle = element.style[cssProperty];
      var originalRuntimeStyle = element.runtimeStyle[cssProperty];
      
      element.runtimeStyle[cssProperty] = element.currentStyle[cssProperty];
      element.style[cssProperty] = value;
      
      var pixelValue = element.style[pixelName];
      
      // Restore the original styles.
      element.style[cssProperty] = originalStyle;
      element.runtimeStyle[cssProperty] = originalRuntimeStyle;
      
      return pixelValue;
    }
  }
  
  function getIECascadedStyle(element, cssProperty)
  {
    return element.currentStyle ? element.currentStyle[cssProperty] : null;
  }

  function getIEBorder(element, cssProperty)
  {
    element = $(element);
    
    if (getIECascadedStyle(element, cssProperty + 'Style') == 'none') return 0;
    
    var width = getIECascadedStyle(element, cssProperty + 'Width');
    
    // If the width returned is a word and not a value, then compare with our
    // border keywords to map a word to a pixel value.
    if (width in _ieBorderWidthKeywords)
      return _ieBorderWidthKeywords[width];
   
    return getIEPixelValue(element, width, 'left', 'pixelLeft');
  }
  
  function getIEPadding(element, cssProperty)
  {
    element = $(element);
    return getIEPixelValue(element, getIECascadedStyle(element, cssProperty), 'left', 'pixelLeft');
  }
  
  Element.addMethods({
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
      
      var prop, styles = {};
      for (var property in element) 
      {
        if (!property.startsWith('_original_')) continue;
        prop = property.replace(/^_original_/, '');
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
      
      return element.removeTempStyles();
    },
    
    isAccessible: function(element)
    {
      element = $(element);
      
      var display = element.getStyle('display');
      
      return !(display === 'none' || display === null || element.offsetHeight == 0);
    },

    getBorderSize: function(element)
    {
      element = $(element);
  
      var accessible = element.isAccessible();
      if (!accessible) element.setAccessibleStyles();
      
      if (Prototype.Browser.IE) 
      {
        var top = parseFloat(getIEBorder(element, 'borderTop'));
        var left = parseFloat(getIEBorder(element, 'borderLeft'));
        var bottom = parseFloat(getIEBorder(element, 'borderBottom'));
        var right = parseFloat(getIEBorder(element, 'borderRight'));
      }
      else 
      {
        var top = parseFloat(element.getStyle('border-top-width'));
        var left = parseFloat(element.getStyle('border-left-width'));
        var bottom = parseFloat(element.getStyle('border-bottom-width'));
        var right = parseFloat(element.getStyle('border-right-width'));
      }
      
      if (!accessible) element.removeAccessibleStyles();
      
      return {
        top: top ? top : 0,
        left: left ? left : 0,
        bottom: bottom ? bottom : 0,
        right: right ? right : 0,
        topbottom: (top + bottom) ? (top + bottom) : 0,
        leftright: (left + right) ? (left + right) : 0
      }
    },

    getPaddingSize: function(element)
    {
      element = $(element);
  
      var accessible = element.isAccessible();
      if (!accessible) element.setAccessibleStyles();
  
      if (Prototype.Browser.IE) 
      {
        var top = parseFloat(getIEPadding(element, 'paddingTop'));
        var left = parseFloat(getIEPadding(element, 'paddingLeft'));
        var bottom = parseFloat(getIEPadding(element, 'paddingBottom'));
        var right = parseFloat(getIEPadding(element, 'paddingRight'));
      }
      else 
      {
        var top = parseFloat(element.getStyle('padding-top'));
        var left = parseFloat(element.getStyle('padding-left'));
        var bottom = parseFloat(element.getStyle('padding-bottom'));
        var right = parseFloat(element.getStyle('padding-right'));
      }

      if (!accessible) element.removeAccessibleStyles();
      
      return {
        top: top ? top : 0,
        left: left ? left : 0,
        bottom: bottom ? bottom : 0,
        right: right ? right : 0,
        topbottom: (top + bottom) ? (top + bottom) : 0,
        leftright: (left + right) ? (left + right) : 0
      }
    },  
  
    getContentDimensions: function(element)
    {
      element = $(element);
      
      var dimensions = element.getDimensions();
      var border = element.getBorderSize();
      var padding = element.getPaddingSize();
      
      var width = (dimensions.width - border.leftright - padding.leftright);
      var height = (dimensions.height - border.topbottom - padding.topbottom);
      
      return {
        width: width,
        height: height
      };    
    },
    
    getContentOffset: function(element)
    {
      element = $(element);
      
      var offset = element.cumulativeOffset();
      var border = element.getBorderSize();
      var padding = element.getPaddingSize();
      
      var top = (offset.top + border.top + padding.top);
      var left = (offset.left + border.left + padding.left);
      
      return {
        top: top,
        left: left
      };    
    },

    getCoords: function(element)
    {
      element = $(element);
      
      var dimensions = element.getDimensions();
      
      var x1 = element.offsetLeft;
      var y1 = element.offsetTop;
      var x2 = x1 + dimensions.width;
      var y2 = y1 + dimensions.height;
      
      return {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
      }    
    },
    
    getFontSize: function(element)
    {
      element = $(element);
      
      var accessible = element.isAccessible();
      if (!accessible) element.setAccessibleStyles();
      
      // Gather all non accessible ancestors.
      var nonAccessibleAncestors = element.ancestors().findAll(function(a) { return !a.isAccessible(); });
      // Change each non-visible ancestor to an accessible element.
      nonAccessibleAncestors.invoke('setAccessibleStyles');
      
      // Get the current font size.
      var fontSize = element.getStyle('font-size');
            
      // If our font size is specified in pixels, then return.
      if (/^\d+px?$/.test(fontSize))
      {
        // Remove accessible styles from all ancestors that were not accessible.
	      nonAccessibleAncestors.invoke('removeAccessibleStyles');
        if (!accessible) element.removeAccessibleStyles();
        
        return parseFloat(fontSize);        
      }

      // We need to insert a span with the M character in it.  The offsetHeight
      // will give us the font size as this is the definition of the CSS font-size
      // attribute.
      var span = new Element('span')
        .setStyle({
          visibility: 'hidden',
          position: 'absolute',
          lineHeight: 0,
          padding: 0,
          margin: 0,
          border: 0,
          height: '1em'
        })
        .update('M');
      
      // Insert our span as a child of the specified element.
      element.insert(span);
      
      // Get the offsetHeight which is the font size.
      fontSize = span.offsetHeight;
      
      // Remove the span from the document.
      span.remove();
      
      // Remove accessible styles from all ancestors that were not accessible.
      nonAccessibleAncestors.invoke('removeAccessibleStyles');
      if (!accessible) element.removeAccessibleStyles();
      
      return parseFloat(fontSize);
    }    
  });
})();