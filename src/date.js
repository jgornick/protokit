function $D(date)
{
  return Date.extend(date);
}

(function()
{
  function _validate(value, min, max, name) 
  {
    if (typeof value == "undefined")
      return false;
    else if (typeof value != "number")
      throw new TypeError(value + " is not a Number."); 
    else if (value < min || value > max)
	    throw new RangeError(value + " is not a valid value for " + name + "."); 

    return true;
  };

  Object.extend(Date, {
    culture: {
      /* Day Name Strings */
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      abbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      shortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      firstLetterDayNames: ["S", "M", "T", "W", "T", "F", "S"],
      
      /* Month Name Strings */
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  
      /* AM/PM Designators */
      amDesignator: "AM",
      pmDesignator: "PM",
      
      timezones: { 
        UTC: "-000", 
        GMT: "-000", 
        EST: "-0500", 
        EDT: "-0400", 
        CST: "-0600", 
        CDT: "-0500", 
        MST: "-0700", 
        MDT: "-0600", 
        PST: "-0800", 
        PDT: "-0700" 
      }
    },
    
    extend: (function() 
    {
      var extend = function(date) 
      {
        if (!date || date._extendedByPrototype) return date;
    
        var methods = Object.clone(Date.Methods);
        var property, value;
        
        for (property in methods) 
        {
          value = methods[property];
          if (Object.isFunction(value) && !(property in date))
            date[property] = value.methodize();
        }
    
        date._extendedByPrototype = Prototype.emptyFunction;
        return date;
      };
      
      return extend;
    })(),
    
    today: function()
    {
      return $D(new Date()).resetTime();
    },
    
    now: function()
    {
      return $D(new Date());
    },
    
    compare: function(date1, date2)
    {
      if (isNaN(date1) || isNaN(date2))
        throw new Error(date1 + " - " + date2); 
      else if (date1 instanceof Date && date2 instanceof Date)
        return (date1 < date2) ? -1 : (date1 > date2) ? 1 : 0;
      else 
        throw new TypeError(date1 + " - " + date2); 
    },
    
    equals: function(date1, date2)
    {
      return (Date.compare(date1, date2) === 0);
    },
    
    getDaysInMonth: function(year, month)
    {
      return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },
  
    isLeapYear: function(year)
    {
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    },
    
    validate: function(type, value)
    {
      switch (type)
      {
        case 'milliseconds':
          return _validate(value, 0, 999, type);
          break;
        case 'seconds':
          return _validate(value, 0, 59, type);
          break;
        case 'minutes':
          return _validate(value, 0, 59, type);          
          break;
        case 'hours':
          return _validate(value, 0, 23, type);
          break;
        case 'months':
          return _validate(value, 0, 11, type);
          break;
        case 'years':
          return _validate(value, 0, 9999, type);
          break;
        case 'days':
          return _validate(value, 0, Date.getDaysInMonth(arguments[2], arguments[3]), type);
          break;       
      }      
    },

    getTimezoneOffset: function(value) 
    {
      return Date.culture.timezones[value.toUpperCase()];
    },

    getTimezoneAbbreviation: function(offset) 
    {
      var timezones = Date.culture.timezones;
      var property, value;
      
      for (property in timezones) 
      {
        value = n[property];
        if (value == offset) return value;
      }   

      return null;
    }
  });
})()

Date.Methods = {
  resetTime: function(date)
  {
    date = $D(date);
    
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    return date;
  },
  
  equals: function(date, date2)
  {
    return Date.equals(date, date2);
  },

  compareTo: function(date, date2)
  {
    return Date.compare(date, date2);
  },
  
  addMilliseconds: function(date, value)
  {
    date = $D(date);
    date.setMilliseconds(date.getMilliseconds() + value);
    return date;
  },
  
  addSeconds: function(date, value)
  {
    date = $D(date);
    return date.addMilliseconds(value * 1000);
  },

  addMinutes: function(date, value)
  {
    date = $D(date);
    return date.addMilliseconds(value * 60000);
  },

  addHours: function(date, value)
  {
    date = $D(date);
    return date.addMilliseconds(value * 3600000);
  },
  
  addDays: function(date, value)
  {
    date = $D(date);
    return date.addMilliseconds(value * 86400000);
  },
  
  addWeeks: function(date, value)
  {
    date = $D(date);
    return date.addDays(value * 7);
  },
  
  addMonths: function(date, value)
  {
    date = $D(date); 
       
    var d = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + value);
    date.setDate(Math.min(d, Date.getDaysInMonth(date.getFullYear(), date.getMonth())));
    
    return date;
  },
  
  addYears: function(date, value)
  {
    date = $D(date);
    return date.addMonths(value * 12); 
  },
  
  set: function(date, options) 
  {
    date = $D(date);
    
    if (Date.validate('milliseconds', options.millisecond))
      date.addMilliseconds(options.millisecond - date.getMilliseconds()); 

    if (Date.validate('seconds', options.second))
      date.addSeconds(options.second - date.getSeconds()); 

    if (Date.validate('minutes', options.minute))
      date.addMinutes(options.minute - date.getMinutes()); 

    if (Date.validate('hours', options.hour))
      date.addHours(options.hour - date.getHours()); 
    
    if (Date.validate('months', options.month))
      date.addMonths(options.month - date.getMonth()); 
    
    if (Date.validate('years', options.year))
      date.addYears(options.year - date.getFullYear()); 
    
    /* day has to go last because you can't validate the day without first knowing the month */
    if (Date.validate('days', options.day, date.getFullYear(), date.getMonth()))
      date.addDays(options.day - date.getDate()); 
        
    if (options.timezone)
      date.setTimezone(options.timezone); 

    if (options.timezoneOffset) 
      date.setTimezoneOffset(options.timezoneOffset); 
    
    return date;   
  },
  
  firstOfMonth: function(date)
  {
    date = $D(date);
    return date.set({ day: 1 });
  },
  
  endOfMonth: function(date)
  {
    date = $D(date);
    return date.set({ day: Date.getDaysInMonth(date.getFullYear, date.getMonth()) });
  },
  
  getDayOfYear: function(date)
  {
    date = $D(date);
    return Math.floor((date - new Date(date.getFullYear(), 0, 1)) / 86400000);
  },
  
  getUTCOffset: function(date) 
  {
    date = $D(date);

    var n = date.getTimezoneOffset() * -10 / 6, r;
    
    if (n < 0) 
    { 
      r = (n - 10000).toString(); 
      return r[0] + r.substr(2); 
    } 
    else
    { 
      r = (n + 10000).toString();  
      return "+" + r.substr(1); 
    }
  },
  
  getTimezone: function(date) 
  {
    date = $D(date);
    return Date.getTimezoneAbbreviation(date.getUTCOffset());
  },

  setTimezoneOffset: function(date, offset) 
  {
    date = $D(date);
    var here = date.getTimezoneOffset(), there = Number(offset) * -6 / 10;
    return date.addMinutes(there - here); 
  },

  setTimezone: function(date, value) 
  {
    date = $D(date);
    return date.setTimezoneOffset(Date.getTimezoneOffset(value)); 
  },  
  
  toFormattedString: function(date, format)
  {
    date = $D(date);
    
    var p = function p(s) { return s.toPaddedString(2); };

    var f = function(format) 
    {
      switch (format) 
      {
        case "hh":
          return p(date.getHours() < 13 ? (date.getHours() === 0 ? 12 : date.getHours()) : (date.getHours() - 12));
        case "h":
          return date.getHours() < 13 ? (date.getHours() === 0 ? 12 : date.getHours()) : (date.getHours() - 12);
        case "HH":
          return p(date.getHours());
        case "H":
          return date.getHours();
        case "mm":
          return p(date.getMinutes());
        case "m":
          return date.getMinutes();
        case "ss":
          return p(date.getSeconds());
        case "s":
          return date.getSeconds();
        case "yyyy":
          return date.getFullYear();
        case "yy":
          return date.getFullYear().toString().substring(2, 4);
        case "dddd":
          return Date.culture.dayNames[date.getDay()];
        case "ddd":
          return Date.culture.abbreviatedDayNames[date.getDay()];
        case "dd":
          return p(date.getDate());
        case "d":
          return date.getDate().toString();
        case "MMMM":
          return Date.culture.monthNames[date.getMonth()];
        case "MMM":
          return Date.culture.abbreviatedMonthNames[date.getMonth()];
        case "MM":
          return p((date.getMonth() + 1));
        case "M":
          return date.getMonth() + 1;
        case "t":
          return date.getHours() < 12 ? Date.culture.amDesignator.substring(0, 1) : Date.culture.pmDesignator.substring(0, 1);
        case "tt":
          return date.getHours() < 12 ? Date.culture.amDesignator : Date.culture.pmDesignator;
        case "zzz":
        case "zz":
        case "z":
          return "";
      }
    };

    return format ? format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g, f) : date.toString();
  }
};