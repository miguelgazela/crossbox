class PrEntrysController < ApplicationController

  before_action :require_user, only: [:show, :create]

  def index

    @fs = PrEntry.where(user_id: current_user.id, exercise_id: 1).order('created_at desc')
    @best_fs_pr = nil

    max_value = 0
    @fs.each do |pr|

      if pr.value > max_value
        @best_fs_pr = pr
        max_value = pr.value
      end

    end

    @bs = PrEntry.where(user_id: current_user.id, exercise_id: 2).order('created_at desc')
    @best_bs_pr = nil

    max_value = 0
    @bs.each do |pr|

      if pr.value > max_value
        @best_bs_pr = pr
        max_value = pr.value
      end

    end

  end

  def create

    value = params[:value]
		num_reps = params[:numReps]
    percentage = params[:percentage]
    exercise_id = params[:exerciseId]

    response = {
			error_code: 200,
			payload: {}
		}

    pr = PrEntry.new

    pr.exercise_id = exercise_id
    pr.repetitions = num_reps
    pr.load_percentage = percentage
    pr.value = value
    pr.user_id = current_user.id

    pr.save!

		# gon.adding_workouts = nil
    #
		# workout_plan = params[:days]
		# counter = 0
    #
		# workout_plan.each do |key, value|
    #
		# 	value['workoutHours'].each do |key, workoutHour|
    #
		# 		workout_date = DateTime.parse(value['date'] + " " + workoutHour['hour'])
    #
		# 		workouts = Workout.where(:date => workout_date)
    #
		# 		if workouts.length == 0
    #
		# 			workout = Workout.new
    #
		# 			workout.date = workout_date
		# 			workout.max_participants = workoutHour['maxParticipants']
		# 			workout.save!
    #
		# 			counter += 1
		# 		end
		# 	end
		# end

		render json: response

  end

end
