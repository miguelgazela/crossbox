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
//= require jsrender/jsrender
//= require bootstrap
//= require bootstrap-datepicker
//= require fastclick
//= require TheaterJS
//= require spin

var local_root_url = "http://localhost:3000";
var remote_root_url = "http://slcrossbox.herokuapp.com";

var root_url;

var currentFirstDayOfWeek = null;

var main = function () {

  FastClick.attach(document.body);

  var railsEnv = $('body').data('env');

  if (railsEnv == "development") {
    root_url = local_root_url;
  } else {
    root_url = remote_root_url;
  }

  var spinnerOpts = {
    lines: 9 // The number of lines to draw
, length: 24 // The length of each line
, width: 8 // The line thickness
, radius: 20 // The radius of the inner circle
, scale: 1 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#36A0D5' // #rgb or #rrggbb or array of colors
, opacity: 0.25 // Opacity of the lines
, rotate: 8 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1.2 // Rounds per second
, trail: 41 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: true // Whether to use hardware acceleration
, position: 'relative'
  }

  var spinner = new Spinner(spinnerOpts).spin();
  $("#workout-loader .loader").append(spinner.el);

  if(window.location.href.indexOf("workouts/new?") > -1) {
    configAddWorkoutsPage()
    return;
  }

	// if (gon.added_workouts) {
  //   console.log("Added workouts!");
  // }

	setCalendarToToday();

  fetchWeekWorkouts();

  // loadTopThree();

	// $("#go-week-before").click(function () { backOneWeek(); });
	// $("#go-week-after").click(function () { forwardOneWeek(); });
	// $("#go-today").click(function () { setCalendarToToday(); });

  // setup the configuration page

  $('#datepicker-container .input-daterange').datepicker({
    format: 'dd/mm/yyyy',
    todayBtn: "linked",
    language: "pt",
    daysOfWeekDisabled: "0",
    todayHighlight: true,
    startDate: "today"
  });


  // configure the create new account form

  $("#new_user").submit(function(event) {
    // event.preventDefault();

    var nameRegex = /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+\s[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+$/;
    var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var passwordRegex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/g;

    var name = $("#name").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var confirmPassword = $("#password_confirmation").val();

    var okToSubmit = true;

    if (!nameRegex.test(name)) {

      $("#name_help").html("Nome inválido. Obrigatório 2 nomes separados por 1 espaço.");
      $("#name_help").parent(".form-group").addClass("has-error");
      okToSubmit = false;

    } else {
      $("#name_help").html("");
      $("#name_help").parent(".form-group").removeClass("has-error");
    }

    if (!emailRegex.test(email)) {

      $("#email_help").html("Email inválido.");
      $("#email_help").parent(".form-group").addClass("has-error");
      okToSubmit = false;

    } else {
      $("#email_help").html("");
      $("#email_help").parent(".form-group").removeClass("has-error");
    }

    if (!passwordRegex.test(password)) {

      $("#password_help").html("Password inválida. Mínimo de 6 caracteres!");
      $("#password_help").parent(".form-group").addClass("has-error");
      okToSubmit = false;

    } else {
      $("#password_help").html("No mínimo 6 caracteres.");
      $("#password_help").parent(".form-group").removeClass("has-error");
    }

    if (password != confirmPassword) {

      okToSubmit = false;
      $("#confirm_password_help").html("As passwords não são iguais.");
      $("#confirm_password_help").parent(".form-group").addClass("has-error");

    } else {

      $("#confirm_password_help").html("");
      $("#confirm_password_help").parent(".form-group").removeClass("has-error");
    }

    return okToSubmit;

  });

};

// function loadTopThree() {
//
//   $.ajax({
//     type: "GET",
//     url: root_url + "/users/top_month",
//     success: function (response) {
//
//       if (response.error_code == 200) {
//
//         var top = response.payload.top;
//         var monthStart = moment(response.payload.month_start);
//         var monthEnd = moment(response.payload.month_end);
//
//         var container = '<div class="card">' +
//
//           '<h1 class="page-header hidden-xs">Top Mensal</h1>' +
//           '<h3 class="page-header hidden-sm hidden-md hidden-lg text-center">Top Mensal</h3>' +
//
//           '<table class="table">' +
//
//             '<thead>' +
//               '<tr>' +
//                 '<th>#</th>' +
//                 '<th></th>' +
//                 '<th>Nome</th>' +
//                 '<th>Treinos</th>' +
//               '</tr>' +
//             '</thead>' +
//
//             '<tbody>';
//
//               for (var i = 0; i < top.length; i++) {
//                 container += '<tr><td>' + (i + 1) + '</td><td><img class="media-object media-object-small" src="' + top[i].user.image + '" alt="..."></td><td>' + top[i].user.name + '</td><td>' + top[i].frequency + '</td></tr>';
//               }
//
//         container += '</tbody>' +
//           '</table>' +
//           '</div>';
//
//         $("#timetable").after($(container));
//
//       }
//     }
//   });
//
// }

function getWeekShiftForDay(day) {
  switch (day.day()) {
    case 0: // sunday
    return [1, 2, 3, 4, 5, 6];
    case 1: // monday
    return [0, 1, 2, 3, 4, 5];
    case 2: // tuesday
    return [0, 1, 2, 3, 4, 6];
    case 3: // wednesday
    return [0, 1, 2, 3, 5, 6];
    case 4: // thursday
    return [0, 1, 2, 4, 5, 6];
    case 5: // friday
    return [0, 1, 3, 4, 5, 6];
    case 6: // saturday
    return [0, 2, 3, 4, 5, 6];
  }
}

function getWeekShiftForToday() {

  var today = moment();
  return getWeekShiftForDay(today);

}

function fetchWeekWorkouts() {

  var lastDay = currentFirstDayOfWeek.clone().add(7, 'd');

  $.ajax({
    type: "GET",
    url: root_url + "/week_workouts?s=" + currentFirstDayOfWeek.format('YYYY-MM-DD') + "&e=" + lastDay.format('YYYY-MM-DD'),
    success: function (response) {

      if (response.error_code == 200) {

        $("#workout-section").removeClass("hidden");
        $("#workout-loader").hide();

        var workouts = response.payload.workouts;

        console.log(workouts);

        var classDayTmpl = $.templates("#class-day-template");
        var classHourTmpl = $.templates("#class-hour-template");

        $(workouts).each(function() {

          var workoutDate = moment(this.workout.date, 'YYYY-MM-DDTHH:mm:ss.sss');
          var $workoutDay = $('[data-class-day="' + workoutDate.format('YYYY-MM-DD') + '"]');

          if ($workoutDay.length == 0) {

            // add the day for this workout

            var templateData = {
              workoutDate: workoutDate.format('YYYY-MM-DD'),
              workoutDay: workoutDate.format('DD'),
              workoutMonth: workoutDate.format('MM'),
              workoutWeekDay: getLocaleWeekDay(workoutDate.format('ddd')),
              workoutsAvailableDescription: "Aulas Disponíveis"
            }

            var today = moment();
            if (workoutDate.isSame(today, 'day')) {
              templateData.workoutWeekDay = "Hoje";
            }

            var html = classDayTmpl.render(templateData);

            $('#home-list-days').append(html);

            var $day = $('[data-class-day="' + workoutDate.format('YYYY-MM-DD') + '"]');

            $day.click(function() {

              var $classHourList = $($day.next('.class-hour-list')[0]);
              var numberWorkouts = $classHourList.find('.class-hour-list-item').length;

              if (numberWorkouts > 0) {

                var $glyphicon = $($day.find('.glyphicon')[0]);

                if ($glyphicon.hasClass('glyphicon-chevron-down')) {

                  $glyphicon.removeClass('glyphicon-chevron-down');
                  $glyphicon.addClass('glyphicon-chevron-up');

                  $classHourList.find('.class-hour-list-item').each(function() {
                    $(this).removeClass('hidden');
                  });

                } else {

                  $glyphicon.removeClass('glyphicon-chevron-up');
                  $glyphicon.addClass('glyphicon-chevron-down');

                  $classHourList.find('.class-hour-list-item').each(function() {
                    $(this).addClass('hidden');
                  });
                }

              }

            });
          }

          // add this workout to the correct day

          var $day = $('[data-class-day="' + workoutDate.format('YYYY-MM-DD') + '"]');
          var $hoursList = $($day.next('.class-hour-list')[0]);

          var templateData = {
            workoutDateHour: workoutDate.format("YYYY-MM-DD HH:mm"),
            workoutHour: workoutDate.format("HH:mm"),
            workoutID: this.workout.id,
            inWorkout: this.in_workout
          };

          //    calculate number of free spots and percentage

          var maxParticipants = parseInt(this.workout.max_participants);
          var trainings = this.trainings;
          var freeSpots;
          var percentage;

          if (trainings >= maxParticipants) {
            freeSpots = 0;
            percentage = 100;
          } else {
            freeSpots = maxParticipants - trainings;
            percentage = Math.floor((trainings / maxParticipants) * 100);
          }

          templateData.availableSpots = freeSpots;
          templateData.completion = percentage;
          templateData.availabilityClass = getClassForPercentage(percentage);

          // calculate new number of available workouts for the day

          if (freeSpots > 0) {

            var numberAvailableWorkouts = parseInt($day.attr('data-workouts-available'));
            $day.attr('data-workouts-available', numberAvailableWorkouts + 1);

            var $workoutsDescription = $($day.find(".class-day-workouts-description")[0]);
            $workoutsDescription.html("" + (numberAvailableWorkouts + 1) + " aulas disponíveis");
          }

          if (trainings > 6) {
            templateData.excessUsers = trainings - 6;
          }

          //    build array with users thumbnails

          var thumbnails = [];
          for (var i = 0; i < this.thumbnails.length; i++) {

            if (i > 5) {
              break;
            }

            thumbnails.push({src: this.thumbnails[i]});
          }

          templateData.thumbnails = thumbnails;

          //    see if workout is from today

          var hiddenClass = "hidden";

          var today = moment();
          if (workoutDate.isSame(today, 'day')) {

            hiddenClass = "";

            var $glyphicon = $($day.find('.glyphicon')[0]);

            $glyphicon.removeClass('glyphicon-chevron-down');
            $glyphicon.addClass('glyphicon-chevron-up');
          }

          templateData.hiddenClass = hiddenClass;

          // calculate new number of available workouts for the day

          //    fetch html from template for workout

          var html = classHourTmpl.render(templateData);
          $hoursList.append(html);

        });
      }
    }
  });
}

function createWorkouts() {

  var pickedDays = [];
  var pickedHours = [];
  var workoutDates = [];

  var dayMappingToMomentsWeekDay = {'Seg': 1, 'Ter': 2, 'Qua': 3, 'Qui': 4, 'Sex': 5, 'Sáb': 6, 'Dom': 0};

  // check if there's any date selected

  var $start = $('#datepicker input[name="start"]');
  var $end = $('#datepicker input[name="end"]');

  var startDate = moment($start.datepicker("getDate"));
  var endDate = moment($end.datepicker("getDate"));

  if (!startDate.isValid() && !endDate.isValid()) {

    console.log("NEEDS AT LEAST ONE DATE!");

    // TODO: add code to warn user here!

    return;
  }

  // check the hours for the workouts

  $('.btn-group-hours').find('label.active').each(function() {

    var $hour = $($(this).find('span'));
    pickedHours.push($hour.html());
  });

  if (pickedHours.length == 0) {
    console.log("NEEDS AT LEAST ONE HOUR!");
  }

  var currentDate = startDate.clone();

  if (currentDate.isSame(endDate, 'day')) {

    console.log("Only one day! Doesn't need week days to be selected");

    _.each(pickedHours, function(hour) {
      workoutDates.push({date: currentDate.format('YYYY-MM-DD'), hour:hour});
    });

  } else {

    // needs to figure out which days of the week it must add the workouts

    $('#btn-group-days').find('label.active').each(function() {

      var $day = $($(this).find('span'));
      pickedDays.push(dayMappingToMomentsWeekDay[$day.html()]);
    });

    if (pickedDays.length == 0) {
      console.log("NEEDS AT LEAST ONE DAY!");
      return;
    }

    console.log(pickedDays);

    do {

      console.log(currentDate);

      if (_.contains(pickedDays, currentDate.day())) {

        _.each(pickedHours, function(hour) {
          workoutDates.push({date: currentDate.format('YYYY-MM-DD'), hour:hour});
        });
      }

      currentDate.add(1, 'd');

    } while (!currentDate.isSame(endDate, 'day'));

  }

  $.ajax({
	  type: "POST",
	  url: root_url + "/workouts_configurator",
	  data: {dates: workoutDates},
	  success: function (response) {

      if (response.error_code == 200) {
        window.location.href = ('/');
      }

	  }
	});
}




function addWorkoutsToDay(workouts, day, daysToAdd) {

  for (var i = 0; i < workouts.length; i++) {

    var workout = workouts[i];

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

        var html;

        if (workout.in_workout) {

          if (freeSpots == 1) {
            html = "<span class='pull-left occupancy-rate'><i class='fa fa-check-circle-o hidden-xs'></i> <a href='/workouts/" + workout.workout.id + "' class='hidden-xs'>" + freeSpots +" vaga</a><a href='/workouts/" + workout.workout.id + "' class='hidden-sm hidden-md hidden-lg'><i class='fa fa-check-circle-o'></i></a></span><div class='hour-completion " + getClassForPercentage(percentage) +"' data-completion='" + percentage +"'></div";
          } else {
            html = "<span class='pull-left occupancy-rate'><i class='fa fa-check-circle-o hidden-xs'></i> <a href='/workouts/" + workout.workout.id + "' class='hidden-xs'>" + freeSpots +" vagas</a><a href='/workouts/" + workout.workout.id + "' class='hidden-sm hidden-md hidden-lg'><i class='fa fa-check-circle-o'></i></a></span><div class='hour-completion " + getClassForPercentage(percentage) +"' data-completion='" + percentage +"'></div";
          }

        } else {

          if (freeSpots == 1) {
            html = "<span class='pull-left occupancy-rate'><a href='/workouts/" + workout.workout.id + "' class='hidden-xs'>" + freeSpots +" vaga</a><a href='/workouts/" + workout.workout.id + "' class='hidden-sm hidden-md hidden-lg'>" + freeSpots + "/" + maxParticipants + "</a></span><div class='hour-completion " + getClassForPercentage(percentage) +"' data-completion='" + percentage +"'></div";
          } else {
            html = "<span class='pull-left occupancy-rate'><a href='/workouts/" + workout.workout.id + "' class='hidden-xs'>" + freeSpots +" vagas</a><a href='/workouts/" + workout.workout.id + "' class='hidden-sm hidden-md hidden-lg'>" + freeSpots + "/" + maxParticipants + "</a></span><div class='hour-completion " + getClassForPercentage(percentage) +"' data-completion='" + percentage +"'></div";
          }
        }

        $(day).prepend(html);
      }
    }
  } /* /for */
}

function addWorkouts() {

  var dayShifts = getWeekShiftForDay(currentFirstDayOfWeek);

	// fetch all data
	var data = {
    startDay: gon.start_day.split(' ')[0],
    endDay: gon.end_day.split(' ')[0],
		days: [
			{
				date: currentFirstDayOfWeek.clone().add(dayShifts[0], 'd').format().substring(0, 10),
				workoutHours: []
			},
			{
				date: currentFirstDayOfWeek.clone().add(dayShifts[1], 'd').format().substring(0, 10),
				workoutHours: []
			},
			{
				date: currentFirstDayOfWeek.clone().add(dayShifts[2], 'd').format().substring(0, 10),
				workoutHours: []
			},
			{
				date: currentFirstDayOfWeek.clone().add(dayShifts[3], 'd').format().substring(0, 10),
				workoutHours: []
			},
			{
				date: currentFirstDayOfWeek.clone().add(dayShifts[4], 'd').format().substring(0, 10),
				workoutHours: []
			},
			{
				date: currentFirstDayOfWeek.clone().add(dayShifts[5], 'd').format().substring(0, 10),
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
	  url: root_url + "/workouts",
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
        currentFirstDayOfWeek = target.date;

        resetWeek();

        fetchWeekWorkouts();

			},
		},
		weekOffset: 1,
		daysOfTheWeek: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
	});
}

function setCalendarToToday() {

	currentFirstDayOfWeek = moment();
	// resetWeek();

  // fetchWeekWorkouts();
}

// function backOneWeek() {
//
// 	var firstDayOfWeek = currentFirstDayOfWeek.clone();
// 	firstDayOfWeek.subtract(1, 'w');
//
// 	changeWeek(firstDayOfWeek);
// }

// function forwardOneWeek() {
//
// 	var firstDayOfWeek = currentFirstDayOfWeek.clone();
// 	firstDayOfWeek.add(1, 'w');
//
// 	changeWeek(firstDayOfWeek);
// }

// function changeWeek(firstDayOfWeek) {
//
//   currentFirstDayOfWeek = firstDayOfWeek.clone();
//
//   resetWeek();
//
//   fetchWeekWorkouts();
// }

// function resetWeek() {
//
//   $('.cal-day-hour').each(function () {
//     $(this).find('.occupancy-rate').remove();
//     $(this).find('.hour-completion').remove();
//     $(this).removeClass('no-workout');
//   });
//
// 	setWeekStartingAt(currentFirstDayOfWeek);
// }

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
  } else if (percentage <= 99) {
    return "almost-full";
  } else {
    return "full";
  }
}

function showChangeGuestsUI(button) {

  $(button).addClass("hidden");
  $("#changeGuestsUITitle").removeClass("hidden");
  $("#changeGuestsUIRadios").removeClass("hidden");
  $("#changeGuestsUIButtons").removeClass("hidden");

}

function hideChangeGuestsUI() {

  $("#showChangeGuestsUIBtn").removeClass("hidden");
  $("#showChangeGuestsUIBtnBgScreens").removeClass("hidden");
  $("#changeGuestsUITitle").addClass("hidden");
  $("#changeGuestsUIRadios").addClass("hidden");
  $("#changeGuestsUIButtons").addClass("hidden");
}

function changeGuests(numGuests) {
  $("#numGuests").val(numGuests);
}

function updateNumGuests(workoutId) {

  var numGuests = $("#numGuests").val();

  window.location.href = ("/workouts/" + workoutId + "/state?a=change_guests&g=" + numGuests);
}

function enterWorkout(workoutId) {

  var numGuests = $("#numGuests").val();

  if (!numGuests) {
    numGuests = 0;
  }

  window.location.href = ("/workouts/" + workoutId + "/state?a=enter&g=" + numGuests);
}

function showConfirmationBox(button, username, userid) {

  var boxTmpl = $.templates("#remove-user-confirmation-box-template");

  $(button).hide();

  var templateData = {
    userName: username,
    userId: userid
  };

  var html = boxTmpl.render(templateData);

  var $listItem = $($(button).closest(".list-group-item-user"));
  $listItem.after(html);
}

function hideConfirmationBox(button) {

  var $confirmationBox = $($(button).closest(".list-group-item-confirmation-box"));

  var $itemBox = $confirmationBox.prev(".list-group-item-user");
  var $button = $($itemBox.find("button"));

  $button.show();
  $confirmationBox.remove();
}

function showWorkoutDeleteConfirmationBox(button) {

  $listItem = $($(button).closest(".list-group-item"));

  $listItem.hide();
  $($listItem.next('.list-group-item')).removeClass("hidden");
}

function hideWorkoutDeleteConfirmationBox(button) {

  var $confirmationBox = $($(button).closest(".list-group-item-workout-delete-box"));

  var $itemBox = $confirmationBox.prev(".list-group-item");

  $itemBox.show();
  $confirmationBox.addClass("hidden");
}

$(document).ready(main);
