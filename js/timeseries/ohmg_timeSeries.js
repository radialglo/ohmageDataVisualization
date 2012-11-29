// JavaScript Document
      google.load('visualization', '1', {'packages':['annotatedtimeline']});
      
var TimeSeries = {

      //Draws chart given a processed Table as parameter
      //Code is modified version from https://developers.google.com/chart/interactive/docs/gallery/annotatedtimeline
      drawChart: function (my_table) 
      {
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'Responses');
        data.addRows(my_table);
        var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('chart_div'));
        chart.draw(data, {displayAnnotations: false});
      },

      //Invoked outside of class with data being the response from the Ohmage Server
      //the data will be exactly what the Ohmage Server returned.
      //we go through the data.data (the array that contains the responses, sorted in date order)
      // counting the number of times a response occured per day.
      setSurveyResponse: function (data)
      {
        var surveyResponseTable = data.data;
        var processedTable= [];
        if(surveyResponseTable.length == 0) return TimeSeries.rawChart(processedTable);
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
            processedTable[j] = TimeSeries.pairToRow(lastDate, dateCount);
            j++;
            lastDate = currentDate;
            dateCount = 1;
          }
        }
        processedTable[j] = TimeSeries.pairToRow(lastDate, dateCount);
        TimeSeries.drawChart(processedTable);
        //TimeSeries.changeDate(surveyResponseTable[0].date,lastDate);
        TimeSeries.changeDate(processedTable[0][0],processedTable[j][0]);
      },

      //given a dateString formatted "YYYY-MM-DD" (the format from the response)
      //      and a number (representing the number of responses corresponding to that date)
      // return a row in an array that has [date,number] (format required by the datatable)
      pairToRow: function (dateString, number)
      {
        var dates = dateString.split("-");
        return [new Date(dates[0], dates[1]-1, dates[2]), number];
      },

      changeDate: function (startDate, endDate)
      {
        $('#dp_start_div').DatePicker({
          flat: true,
          date: startDate,
          current: startDate,
          calendars: 1,
          starts: 1,
          onRender: function(date) {
            return {
              disabled: (date < startDate)
            }
          }
        });
        $('#dp_end_div').DatePicker({
          flat: true,
          date: endDate,
          current: endDate,
          calendars: 1,
          starts: 1,
          onRender: function(date) {
            return {
              disabled: (date > endDate)
            }
          }
        });

      }

}