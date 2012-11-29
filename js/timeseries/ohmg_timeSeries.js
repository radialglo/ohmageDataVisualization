// JavaScript Document
      google.load('visualization', '1', {'packages':['annotatedtimeline']});
      
var TimeSeries = {

      //Draws chart given a processed Table as parameter
      //Code is modified version from https://developers.google.com/chart/interactive/docs/gallery/annotatedtimeline
      initChart: function (my_table) 
      {
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'Responses');
        data.addRows(my_table);
        var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('chart_div'));
        chart.draw(data, {displayAnnotations: false});
        //google.visualization.events.addListener(chart,'rangechange', function (start,end) {alert("hi"); TimeSeries.changeDateRange(start,end)});
      },

      //Invoked outside of class with data being the response from the Ohmage Server
      //the data will be exactly what the Ohmage Server returned.
      //we go through the data.data (the array that contains the responses, sorted in date order)
      // counting the number of times a response occured per day.
      initSurveyResponse: function (data)
      {
        var surveyResponseTable = data.data;
        var processedTable= [];
        if(surveyResponseTable.length == 0) return this.rawChart(processedTable);
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

      initDatePickers: function (startDate, endDate)
      {
        $( "#dp_start" ).datepicker({minDate: startDate, maxDate: endDate, onSelect: function(dateText, inst){ TimeSeries.changeDateRange(dateText,$("#dp_end").datepicker("getDate"));}});
        $( "#dp_end" ).datepicker({minDate: startDate, maxDate: endDate, onSelect:  function(dateText, inst){ TimeSeries.changeDateRange($("#dp_start").datepicker("getDate"), dateText);}});
        $( "#dp_start" ).datepicker("setDate", startDate);
        $( "#dp_end" ).datepicker("setDate", endDate);
      },

      changeDateRange: function (startDate, endDate)
      {
        alert("hello!");
        $( "#dp_start" ).datepicker("setDate", startDate);
        $( "#dp_end" ).datepicker("setDate", endDate);
        $( "#dp_start" ).datepicker("option","maxDate", endDate);
        $( "#dp_end" ).datepicker("option", "minDate",startDate);
        //var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('chart_div'));
        //chart.setVisibleChartRange(new Date(startDate), new Date(endDate));
      }



}