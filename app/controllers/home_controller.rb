class HomeController < ApplicationController

  before_action :require_user, only: [:show]
  before_action :clear_gon, only: [:show]

  def show

    @in_home = true

    start_date = Time.zone.now

    workouts = Workout.where('date < ? AND date > ?', start_date+1.day, start_date).order(:date)

    # build a list with all the days that the user has trainings

    user_training_days = []
    workouts.each do |workout|

      training = Training.find_by(user_id: current_user.id, workout_id: workout.id)

      if training
        user_training_days.push(workout.date)
      end

    end

    @results = Array.new

		workouts.each do |workout|

			trainings_count = workout.trainings.length

			# get thumbnails from users of the workout

			users_thumbnails = Array.new

			workout.trainings.each do |training|
				users_thumbnails.push(training.user.image);
			end

			training = Training.find_by(user_id: current_user.id, workout_id: workout.id)

      # calculate number of free spots and percentage

      freeSpots = 0
      percentage = 100

      if trainings_count < workout.max_participants.to_i()
        freeSpots = workout.max_participants.to_i() - trainings_count
        percentage = ((trainings_count * 1.0 / workout.max_participants.to_i()) * 100).floor
      end

      availability_class = "full"

      if percentage <= 50
        availability_class = "available"
      else percentage <= 99
        availability_class = "almost-full"
      end

      excess_users = 0

      if trainings_count > 6
        excess_users = trainings_count - 6
      end

      # check if user has already enroled in anoter training this day
      is_busy = false

      user_training_days.each do |training_day|

        if training_day.strftime('%Y-%m-%d') == workout.date.strftime('%Y-%m-%d')

          if training_day.strftime('%H:%M') == workout.date.strftime('%H:%M')
            next
          end

          is_busy = true

        end

      end

			@results.push({
        :workout => workout,
        :trainings => trainings_count,
        :in_workout => training,
        :thumbnails => users_thumbnails,
        :free_spots => freeSpots,
        :percentage => percentage,
        :excess_users => excess_users,
        :availability_class => availability_class,
        :is_busy => is_busy
      })

		end

    @events = Event.limit(50)
    

  end

  def contacts
  end

end
