/*
  Credits:
    Juriy Zaytsev (http://github.com/kangax)
    Andrew Dupont (http://github.com/savetheclocktower)
*/

(function()
{
  var _el;
  var _size;
  var _pe;
  
  function _createSpan()
  {
    // We need to insert a span with the M character in it.  The offsetHeight
    // will give us the font size as this is the definition of the CSS font-size
    // attribute.
    _el = new Element('span')
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
    
    // Insert the element at the "top" of the body.
    $(document.body).insert({ top: _el });
  }
  
  function _checkTextSize() 
  {
    var currentSize = _el.offsetHeight;
    if (_size != currentSize) 
    {
      document.fire('text:resize', {
        previousSize: _size,
        currentSize: currentSize
      });
      _size = currentSize;
    }
  }
  
  Object.extend(document, {
    enableTextResizeDetection: function(time)
    {
      // Default to 1 second.
      if (typeof time == 'undefined') time = 1000;
      
      _createSpan();
      
      _size = _el.offsetHeight;
  
      // Start our PeriodicalExecuter
      _pe = new PeriodicalExecuter(_checkTextSize, (time / 1000));
      
      return document;
    },
    
    disableTextResizeDetection: function()
    {
      // Stop the periodical executer
      _pe.stop();
      _pe = null;
      
      // Remove the span element.
      _el.remove();
      _el = null;
         
      return document;
    } 
  });  
})();

(function()
{
  var IDLE_TIME = 1000;
  
  var _events = [
    [window, 'scroll'],
    [window, 'resize'],
    [document, 'mousemove'],
    [document, 'click'],
    [document, 'keydown']
  ];
  
  var _timer, _idleTime;
  
  function _resetTimer()
  {
    window.clearTimeout(_timer);
    _idleTime = new Date();
    _timer = window.setTimeout(_setIdle, IDLE_TIME)
  }
  
  function _setIdle() 
  { 
    document.fire('state:idle'); 
  }
  
  function _setActive() 
  {
    document.fire('state:active', { idleTime: new Date() - _idleTime });
    _resetTimer();
  }
  
  Object.extend(document, {
    enableIdleState: function(time)
    {
      if (typeof time != 'undefined') IDLE_TIME = time;
      
      _events.each(function(e) { Event.observe(e[0], e[1], _setActive); });
    },
    
    disableIdleState: function()
    {
      events.each(function(e) { Event.stopObserving(e[0], e[1], _setActive); });
    }
  });
})();


(function() 
{
  function _onMouseOver(event) 
  {
    var target = event.element();
    if (event.relatedTarget && !event.relatedTarget.descendantOf(target))
      target.fire('mouse:enter');
  }
  
  function _onMouseOut(event) 
  {
    var target = event.element();
    if (event.relatedTarget && !event.relatedTarget.descendantOf(target))
      target.fire('mouse:leave');
  }
    
  Object.extend(document, {
    enableMouseEnterLeave: function() 
    {
      if (Prototype.Browser.IE) 
        document
          .observe('mouseenter', function(event) { event.element().fire('mouse:enter'); })
        	.observe('mouseleave', function(event) { event.element().fire('mouse:leave'); });
      else
        document
          .observe('mouseover', _onMouseOver)
          .observe('mouseout', _onMouseOut);
    },
    
    disableMouseEnterLeave: function()
    {
      if (Prototype.Browser.IE) 
        document
          .stopObserving('mouseenter', function(event) { event.element().fire('mouse:enter'); })
        	.stopObserving('mouseleave', function(event) { event.element().fire('mouse:leave'); });
      else
        document
          .stopObserving('mouseover', _onMouseOver)
          .stopObserving('mouseout', _onMouseOut);
    }
  });
})();

(function() 
{
  function _onMouseWheel(event) 
  {
    var realDelta;
 
    // normalize the delta
    if (event.wheelDelta) // IE & Opera
      realDelta = event.wheelDelta / 120;
    else if (event.detail) // W3C
      realDelta = -event.detail / 3;
 
    if (!realDelta) return;
    
    var customEvent = event.element().fire("mouse:wheel", { delta: realDelta });
    if (customEvent.stopped) event.stop();
  }
  
  Object.extend(document, {
    enableMouseWheel: function() 
    {
      document.observe("mousewheel", _onMouseWheel).observe("DOMMouseScroll", _onMouseWheel);
    },
    
    disableMouseWheel: function()
    {
      document.stopObserving("mousewheel", _onMouseWheel).stopObserving("DOMMouseScroll", _onMouseWheel);
    }
  });
})();