// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require turbolinks
//= require moment/moment
//= require underscore/underscore
//= require clndr/src/clndr

var cldnrTemplate = "<div class='clndr-controls'>" +
    "<div class='clndr-control-button clndr-previous-button'>&lsaquo;</div><div class='month'><%= month %> <%= year %></div><div class='clndr-control-button clndr-next-button'>&rsaquo;</div>" +
    "</div>" +
    "<table class='clndr-table' border='0' cellspacing='0' cellpadding='0'>" +
    "<thead>" +
    "<tr class='header-days'>" +
    "<% for(var i = 0; i < daysOfTheWeek.length; i++) { %>" +
      "<td class='header-day'><%= daysOfTheWeek[i] %></td>" +
    "<% } %>" +
    "</tr>" +
    "</thead>" +
    "<tbody>" +
    "<% for(var i = 0; i < numberOfRows; i++){ %>" +
      "<tr>" +
      "<% for(var j = 0; j < 7; j++){ %>" +
      "<% var d = j + i * 7; %>" +
      "<td class='<%= days[d].classes %>'><div class='day-contents'><%= days[d].day %>" +
      "</div></td>" +
      "<% } %>" +
      "</tr>" +
    "<% } %>" +
    "</tbody>" +
  "</table>";

var currentFirstDayOfWeek = null;

var main = function () {

  console.log("Running main function");

  configSidebarCalendar();

  if (gon.adding_workouts) {
    configAddWorkoutsPage()
    return;
  }

	if (gon.added_workouts) {
    console.log("Added workouts!");
  } 

	setCalendarToToday();

  fetchWeekWorkouts();

	$("#go-week-before").click(function () { backOneWeek(); });
	$("#go-week-after").click(function () { forwardOneWeek(); });
	$("#go-today").click(function () { setCalendarToToday(); });

};

function fetchWeekWorkouts() {

  var lastDay = currentFirstDayOfWeek.clone().add(7, 'd');

  $.ajax({
    type: "GET",
    url: "http://localhost:3000/week_workouts?s=" + currentFirstDayOfWeek.format('YYYY-MM-DD') + "&e=" + lastDay.format('YYYY-MM-DD'),
    success: function (response) {

      if (response.error_code == 200) {

        var workouts = response.payload.workouts;

        $('.cal-day-hour').each(function () {

          var day = $(this).parent();

          switch ($(day).data('cal-row')) {
            case '-day1':
              addWorkoutsToDay(workouts, this, 0);
            break;
            case  '-day2':
              addWorkoutsToDay(workouts, this, 1);
            break;
            case '-day3':
              addWorkoutsToDay(workouts, this, 2);
            break;
            case  '-day4':
              addWorkoutsToDay(workouts, this, 3);
            break;
            case '-day5':
              addWorkoutsToDay(workouts, this, 4);
            break;
            case  '-day6':
              addWorkoutsToDay(workouts, this, 5);
            break;
          }

        });

        $('.cal-day-hour').each(function () {

          if($(this).find('.occupancy-rate').length == 0) {
            $(this).addClass('no-workout');
          }
        });
      }
    }
  });
}

function addWorkoutsToDay(workouts, day, daysToAdd) {

  for (var i = 0; i < workouts.length; i++) {

    var workout = workouts[i]

    var workoutDate = moment(workout.workout.date, 'YYYY-MM-DDTHH:mm:ss.sss');
    var currentDay = currentFirstDayOfWeek.clone().add(daysToAdd, 'd');

    if (currentDay.date() == workoutDate.date()) {

      var hour = $(day).children('span').text();

      if (workoutDate.format('HH:mm') == hour) {

        var maxParticipants = parseInt(workout.workout.max_participants);
        var trainings = workout.trainings;
        var freeSpots;
        var percentage;

        if (trainings >= maxParticipants) {
          freeSpots = 0;
          percentage = 100;
        } else {
          freeSpots = maxParticipants - trainings;
          percentage = Math.floor((trainings / maxParticipants) * 100);
        }

        var html = "<span class='pull-left occupancy-rate'><a href='/workouts/" + workout.workout.id + "'>" + freeSpots +" vagas</a></span><div class='hour-completion " + getClassForPercentage(percentage) +"' data-completion='" + percentage +"'></div"
        $(day).prepend(html);
      } 
    }
  } /* /for */
}

function configAddWorkoutsPage() {

	var startDay = moment(gon.start_day.split(' ')[0]);
	var endDay = moment(gon.end_day.split(' ')[0]);

	if (startDay.day() == 0) {
		startDay.add(1, 'd');
	}

	currentFirstDayOfWeek = startDay;

	resetWeek();

  // change the hours that are displayed for the saturdays

  var counter = 0;
  while (true) {

    var newDay = currentFirstDayOfWeek.clone().add(counter, 'd');

    if (newDay.day() == 6) { // saturday
      break;
    }

    counter++;
  }

  $('.cal-cell').each(function () {

    var shouldMatch = "-day" + (counter + 1);

    if ($(this).data('cal-row') == shouldMatch) {

      var hour = $(this).children('.cal-day-hour').children('span').text();

      if (hour == "09:00") {
        $(this).children('.cal-day-hour').prepend('<div class="col-xs-8 col-md-6"><input type="text" class="form-control" placeholder="Vagas" value="13"></div>');
      } else if (hour == "10:00" || hour == "20:00" || hour == "21:00") {
        $(this).children('.cal-day-hour').children('div').remove();
      }

      console.log("Right day: " + hour);
    }
  })

}

function addWorkouts() {

	// fetch all data
	var data = {
    startDay: gon.start_day.split(' ')[0],
    endDay: gon.end_day.split(' ')[0],
		days: [
			{
				date: currentFirstDayOfWeek.format().substring(0, 10),
				workoutHours: []
			},
			{
				date: currentFirstDayOfWeek.clone().add(1, 'd').format().substring(0, 10),
				workoutHours: []
			},
			{
				date: currentFirstDayOfWeek.clone().add(2, 'd').format().substring(0, 10),
				workoutHours: []
			},
			{
				date: currentFirstDayOfWeek.clone().add(3, 'd').format().substring(0, 10),
				workoutHours: []
			},
			{
				date: currentFirstDayOfWeek.clone().add(4, 'd').format().substring(0, 10),
				workoutHours: []
			}, 
			{
				date: currentFirstDayOfWeek.clone().add(5, 'd').format().substring(0, 10),
				workoutHours: []
			}
		]
	};

	$('.cal-day-hour').each(function () {

		var day = $(this).parent();
    var hour = $(this).children('span').text();

    if ($(this).find('.form-control').length > 0) {

      var value = $(this).find('.form-control').val();

      if (value && value != 0) {
        switch ($(day).data('cal-row')) {
          case '-day1':
            data['days'][0]['workoutHours'].push({hour: hour, maxParticipants: value});
          break;
          case  '-day2':
            data['days'][1]['workoutHours'].push({hour: hour, maxParticipants: value});
          break;
          case '-day3':
            data['days'][2]['workoutHours'].push({hour: hour, maxParticipants: value});
          break;
          case  '-day4':
            data['days'][3]['workoutHours'].push({hour: hour, maxParticipants: value});
          break;
          case '-day5':
            data['days'][4]['workoutHours'].push({hour: hour, maxParticipants: value});
          break;
          case  '-day6':
            data['days'][5]['workoutHours'].push({hour: hour, maxParticipants: value});
          break;
        }
      }
    }
	});

	$.ajax({
	  type: "POST",
	  url: "http://localhost:3000/workouts",
	  data: data,
	  success: function (response) {

      if (response.error_code == 200) {
        window.location.href = ('/');
      }
	  }
	});
}

function cancelAddWorkouts() {
	window.location.href = ('/');
}

function configSidebarCalendar() {

	$('.sidebar-calendar').clndr({
		template: cldnrTemplate,
		clickEvents: {
			click: function(target){
				setWeekStartingAt(target.date);
			},
		},
		weekOffset: 1,
		daysOfTheWeek: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
	});
}

function setCalendarToToday() {

	currentFirstDayOfWeek = moment();
	resetWeek();
}

function backOneWeek() {

	var firstDayOfWeek = currentFirstDayOfWeek.clone();
	firstDayOfWeek.subtract(1, 'w');

	changeWeek(firstDayOfWeek);
}

function forwardOneWeek() {

	var firstDayOfWeek = currentFirstDayOfWeek.clone();
	firstDayOfWeek.add(1, 'w');

	changeWeek(firstDayOfWeek);
}

function changeWeek(firstDayOfWeek) {

  currentFirstDayOfWeek = firstDayOfWeek.clone();

  resetWeek();

  fetchWeekWorkouts();
}

function resetWeek() {

  $('.cal-day-hour').each(function () {
    $(this).find('.occupancy-rate').remove();
    $(this).find('.hour-completion').remove();
    $(this).removeClass('no-workout');
  });

	setWeekStartingAt(currentFirstDayOfWeek);
}

function setWeekStartingAt(firstDay) {

	var weekDays = $(".cal-row-head .week-day");
	var daysMonth = $(".cal-row-head .day-month");

	var numSetDays = 0;
	var count = 0;

	do {

		var date = firstDay.clone().add(count, 'd');

		if (date.day() == 0) {
			count++;
			continue; 
		}

		$(weekDays[numSetDays]).text("" + getLocaleWeekDay(date.format('ddd')));
		$(daysMonth[numSetDays]).text("" + date.date() + "/" + (date.month() + 1));

		if (date.isBefore(moment()) && !date.isSame(moment(), 'day')) {
			$(weekDays[numSetDays]).addClass('past-day');
			$(daysMonth[numSetDays]).addClass('past-day');
		} else {
			$(weekDays[numSetDays]).removeClass('past-day');
			$(daysMonth[numSetDays]).removeClass('past-day');
		}

		count++;
		numSetDays++;

	} while (numSetDays < 6);
}

function getLocaleWeekDay(weekDay) {
	var days = {'Mon': 'Segunda', 'Tue': 'Terça', 'Wed': 'Quarta', 'Thu': 'Quinta', 'Fri': 'Sexta', 'Sat': 'Sábado', 'Sun': 'Domingo'};
	return days[weekDay];
}

function redirectToAddWorkouts() {

	var lastDay = currentFirstDayOfWeek.clone().add(7, 'd');

	window.location.href = ("/workouts/new?s=" + currentFirstDayOfWeek.format() + "&e=" + lastDay.format());
}

function getClassForPercentage(percentage) {

  if (percentage <= 50) {
    return "available";
  } else if (percentage <= 80) {
    return "almost-full";
  } else {
    return "full";
  }
}

$(document).ready(main);
