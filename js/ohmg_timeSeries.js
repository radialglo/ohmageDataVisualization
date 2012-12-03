// JavaScript Document
var graph;
var TimeSeries = {

      //Draws chart given a processed Table as parameter
      //Code is modified version from https://developers.google.com/chart/interactive/docs/gallery/annotatedtimeline
      initChart: function (my_table) 
      {
        graph = new Dygraph(document.getElementById("chart_div"),my_table,
                  {
                    labels: [ "Date", "Number of Submissions"],
                    showRangeSelector: true,
                    zoomCallback : function(minDate, maxDate, yRange) {
                      TimeSeries.changeDateRange(new Date(minDate),new Date(maxDate));
                    },
                    drawCallback : function(dygraph, is_initial) {
                      if(!is_initial) 
                      {
                        var range = dygraph.xAxisRange();
                        var rs = TimeSeries.roundToDay(new Date(range[0]));
                        var re = TimeSeries.roundToDay(new Date(range[1]));
                        if(range[0] < rs.valueOf() || range[1] < re.valueOf()){
                          dygraph.updateOptions({ dateWindow: [rs.valueOf(), re.valueOf()] });
                        }
                        else
                          TimeSeries.changeDateRange(rs,re);
                      }
                    }

                  });

      },

      //Invoked outside of class with data being the response from the Ohmage Server
      //the data will be exactly what the Ohmage Server returned.
      //we go through the data.data (the array that contains the responses, sorted in date order)
      // counting the number of times a response occured per day.
      initSurveyResponse: function (data, onChangeHandler)
      {
        this.onChangeHandler = onChangeHandler;
        
        var surveyResponseTable = data.data;
        var processedTable= [];
        if(surveyResponseTable.length == 0) return;// this.rawChart(processedTable);
        var lastDate = surveyResponseTable[0].date;
        var dateCount = 0;
        var currentDate;
        var j = 0;
        for(var i = 0; i < surveyResponseTable.length; i++)
        {
          currentDate = surveyResponseTable[i].date;
          if(lastDate === currentDate)
          {
            dateCount++;
          }
          else
          {
            processedTable[j] = this.pairToRow(lastDate, dateCount);
            j++;
            lastDate = currentDate;
            dateCount = 1;
          }
        }
        processedTable[j] = this.pairToRow(lastDate, dateCount);
        this.initChart(processedTable);
        this.initDatePickers(processedTable[0][0],processedTable[j][0]);
      },

      //given a dateString formatted "YYYY-MM-DD" (the format from the response)
      //      and a number (representing the number of responses corresponding to that date)
      // return a row in an array that has [date,number] (format required by the datatable)
      pairToRow: function (dateString, number)
      {
        var dates = dateString.split("-");
        return [new Date(dates[0], dates[1]-1, dates[2]), number];
      },
      
      //Initialize/Re-initialize datePickers
      initDatePickers: function (startDate, endDate)
      {
        var self = this;
        this.getStartPicker().datepicker({minDate: startDate, maxDate: endDate, onSelect: function(dateText, inst){ self.changeDateRange(new Date(dateText),self.getEndPicker().datepicker("getDate"));}});
        this.getEndPicker().datepicker({minDate: startDate, maxDate: endDate, onSelect:  function(dateText, inst){ self.changeDateRange(self.getStartPicker().datepicker("getDate"), new Date(dateText));}});
        this.getStartPicker().datepicker("setDate", startDate);
        this.getEndPicker().datepicker("setDate", endDate);
      },

      //Modifiable date range kept by chart and datePicker
      changeDateRange: function (startDate, endDate)
      {
        if(startDate.valueOf() == this.getStartPicker().datepicker("getDate").valueOf() &&
           startDate.valueOf() == graph.xAxisRange()[0] && 
           endDate.valueOf() == this.getEndPicker().datepicker("getDate").valueOf() &&
           endDate.valueOf() == graph.xAxisRange()[1]) return;
        this.getStartPicker().datepicker("setDate", startDate);
        this.getEndPicker().datepicker("setDate", endDate);
        this.getStartPicker().datepicker("option","maxDate", endDate);
        this.getEndPicker().datepicker("option", "minDate", startDate);
        graph.updateOptions({ dateWindow: [startDate.valueOf(), endDate.valueOf()] });
        this.onChangeHandler();
      },

      //used to do date comparisons by days not hours/min/sec/ms
      roundToDay: function (date)
      {
        var d = new Date(date.getFullYear(),date.getMonth(),date.getDate());
        if(d < date)
        {
          return new Date(date.getFullYear(),date.getMonth(),date.getDate()+1);
        }
        return d;
      },
      
      //Function calls to datePicker to make them more readable           
      getStartPicker: function()
      {
        return $( "#dp_start" );
      },
      
      getEndPicker: function()
      {
        return $( "#dp_end" );
      },
      
      //Method to return start and end dates in ISO format
      getStartDate: function ()
      {
        var date = this.getStartPicker().datepicker("getDate");
        return [date.getFullYear(),date.getMonth()+1,date.getDate()].join("-");
      },
      
      getEndDate: function()
      {
        var date = this.getEndPicker().datepicker("getDate");
        return [date.getFullYear(),date.getMonth()+1,date.getDate()].join("-");

      }
}
