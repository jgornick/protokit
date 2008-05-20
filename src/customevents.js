/*
  Credits:
    Juriy Zaytsev (http://github.com/kangax)
    Andrew Dupont (http://github.com/savetheclocktower)
*/

Object.extend(document, {
  enableTextResizeDetection: function(time)
  {
    // Default to 1 second.
    if (typeof time == 'undefined') time = 1000;

    // We need to insert a span with the M character in it.  The offsetHeight
    // will give us the font size as this is the definition of the CSS font-size
    // attribute.
    var el = new Element('span')
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
    $(document.body).insert({ top: el });
    
    // Setup our text resize detection object on the document.
    document._textResizeDetection = {
      el: el,
      size: el.offsetHeight,
      pe: null
    };

    // Start our PeriodicalExecuter
    document._textResizeDetection.pe = new PeriodicalExecuter(function() 
    {
      var currentSize = document._textResizeDetection.el.offsetHeight;
      if (document._textResizeDetection.size != currentSize) 
      {
        document.fire('text:resized', {
          previousSize: document._textResizeDetection.size,
          currentSize: currentSize
        });
        document._textResizeDetection.size = currentSize;
      }
    }, (time / 1000));
    
    return document;
  },
  
  disableTextResizeDetection: function()
  {
    // Stop the periodical executer
    document._textResizeDetection.pe.stop();
    document._textResizeDetection.pe = null;
    
    // Remove the span element.
    document._textResizeDetection.el.remove();
    document._textResizeDetection.el = null;
    
    // Remove the _textResizeDetection object on the document.
    document._textResizeDetection = null;
    delete document._textResizeDetection;
    
    return document;
  } 
});

(function()
{
  var IDLE_TIME = 1000;
  
  var EVENTS = [
    [window, 'scroll'],
    [window, 'resize'],
    [document, 'mousemove'],
    [document, 'click'],
    [document, 'keydown'],
  ];
  
  var _timer, _idleTime;
  
  function resetTimer()
  {
    window.clearTimeout(_timer);
    _idleTime = new Date();
    _timer = window.setTimeout(setIdle, IDLE_TIME)
  }
  
  function setIdle() 
  { 
    document.fire('state:idle'); 
  }
  
  function setActive() 
  {
    document.fire('state:active', { idleTime: new Date() - _idleTime });
    resetTimer();
  }
  
  Object.extend(document, {
    enableIdleState: function(time)
    {
      if (typeof time != 'undefined') IDLE_TIME = time;
      
      EVENTS.each(function(e) { Event.observe(e[0], e[1], setActive); });
    },
    
    disableIdleState: function()
    {
      EVENTS.each(function(e) { Event.stopObserving(e[0], e[1], setActive); });
    }
  });
})();


(function() {
  function respondToMouseOver(event) 
  {
    var target = event.element();
    if (event.relatedTarget && !event.relatedTarget.descendantOf(target))
      target.fire('mouse:enter');
  }
  
  function respondToMouseOut(event) {
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
          .observe('mouseover', respondToMouseOver)
          .observe('mouseout', respondToMouseOut);
    },
    
    disableMouseEnterLeave: function()
    {
      if (Prototype.Browser.IE) 
        document
          .stopObserving('mouseenter', function(event) { event.element().fire('mouse:enter'); })
        	.stopObserving('mouseleave', function(event) { event.element().fire('mouse:leave'); });
      else
        document
          .stopObserving('mouseover', respondToMouseOver)
          .stopObserving('mouseout', respondToMouseOut);
    }
  });
})();