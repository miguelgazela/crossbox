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
//= require jquery_ujs
//= require turbolinks
//= require moment/moment
//= require underscore/underscore
//= require clndr/src/clndr
//= require_tree .

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

	setCalendarToToday();

	$("#go-week-before").click(function () { backOneWeek(); });
	$("#go-week-after").click(function () { forwardOneWeek(); });
	$("#go-today").click(function () { setCalendarToToday(); });

	configSidebarCalendar();

	
};

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

	currentFirstDayOfWeek = firstDayOfWeek.clone();

	resetWeek();
}

function forwardOneWeek() {

	var firstDayOfWeek = currentFirstDayOfWeek.clone();
	firstDayOfWeek.add(1, 'w');

	currentFirstDayOfWeek = firstDayOfWeek.clone();

	resetWeek();
}

function resetWeek() {
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
	var days = {'Mon': 'Seg', 'Tue': 'Ter', 'Wed': 'Qua', 'Thu': 'Qui', 'Fri': 'Sex', 'Sat': 'Sáb', 'Sun': 'Dom'};
	return days[weekDay];
}

$(document).ready(main);
