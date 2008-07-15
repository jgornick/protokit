Element.addMethods(['SELECT', 'INPUT', 'TEXTAREA'], {
  isBlank: function(element) 
  {
    return $F(element).blank();
  },
  
  present: function(element) 
  {
    if (!(element = $(element)) && !element.type) return;
    var t = element.type;
    return ((/text|password|file/.test(t) && !element.value.blank()) ||
      /reset|submit|button|hidden/.test(t) ||
      (t == 'checkbox' && element.checked) ||
      (t == 'radio' && (element.checked || $$('input[name=' + element.name + ']:checked').length))
      (/select-one|select-multiple/.test(t) && element.selectedIndex != -1));
  }
});

Element.addMethods(['INPUT', 'TEXTAREA'], {
  getSelection: function(element)
  {
    element = $(element);
        
    /* Mozilla/DOM 3.0 */
    if ('selectionStart' in element) 
    {
      var length = element.selectionEnd - element.selectionStart;
            
      return { 
        start: element.selectionStart, 
        end: element.selectionEnd, 
        length: length, 
        text: element.value.substr(element.selectionStart, length) 
      };
    }
    
    /* IE */
    if (document.selection) 
    {
      element.focus();

      var r = document.selection.createRange();

      if (r == null)
        return { start: 0, end: element.value.length, length: 0 };

      var re = element.createTextRange();
      var rc = re.duplicate();
      re.moveToBookmark(r.getBookmark());
      rc.setEndPoint('EndToStart', re);

      return { 
        start: rc.text.length, 
        end: rc.text.length + r.text.length, 
        length: r.text.length, 
        text: r.text 
      };
    }

    return { start: 0, end: e.value.length, length: 0 };
  },
  
  setSelection: function(element, start, end)
  {
    element = $(element);
    
    if (typeof end == 'undefined') end = start;

    /* Mozilla/DOM 3.0 */
    if ('selectionStart' in element) 
    {
      element.focus();
      element.setSelectionRange(start, end);
    }

    /* IE */
    if (document.selection) 
    {
      element.focus();

      var r = document.selection.createRange();
      if (r == null)
        return { start: 0, end: element.value.length, length: 0 };

      var tr = element.createTextRange();
			tr.collapse(true);
			tr.moveEnd('character', end);
			tr.moveStart('character', start);
			tr.select();
    }
    
    return element.getSelection();
  },

  replaceSelection: function(element, text) 
  {
    element = $(element);
    
    if (typeof text == 'undefined') text = '';

    /* Mozilla/DOM 3.0 */
    if ('selectionStart' in element) 
    {
      element.value = element.value.substr(0, element.selectionStart) + text + element.value.substr(element.selectionEnd, element.value.length);
      return element;
    }

    /* IE */
    if (document.selection) 
    {
      element.focus();
      document.selection.createRange().text = text;
      return element;
    }

    element.value += text;
    return element;
  }
});

Element.addMethods(['SELECT'], {
  selectOptionByValue: function(element, value) 
  {
    element = $(element);
    
    var index = 0;
   
    Element.childElements(element).each(function(element, i) 
    {
      if (element.value == value) 
      {    
        index = i;    
        throw $break;
      }
    });
    
    element.selectedIndex = index;
    
    return element;
  }
});
