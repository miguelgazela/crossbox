class WorkoutsController < ApplicationController

	before_action :require_user, only: [:week_workouts]
	before_action :require_account_management_rights, only: [:new, :create, :change_training_state]

	def show

		@workout = Workout.find(params[:id])
		@in_workout = Training.find_by(user_id: current_user.id, workout_id: params[:id])

	end

	def change_training_state

		action = params[:a]

		training = Training.find_by(user_id: current_user.id, workout_id: params[:id])

		if action == "enter"

			if training
				redirect_to "/workouts/" + params[:id]
				return			
			end

			training = Training.new

			training.user_id = current_user.id
			training.workout_id = params[:id]

			training.save!

			redirect_to "/workouts/" + params[:id]

		elsif action == "leave"

			if training
				training.delete
			end

			redirect_to "/workouts/" + params[:id]
		end

	end

	def week_workouts

		start_day = params[:s]
		end_day = params[:e]

		start_date = DateTime.parse(start_day)
		end_date = DateTime.parse(end_day)

		result = Array.new

		workouts = Workout.where(date: start_date..end_date)
		workouts.each do |workout|
			trainings_count = workout.trainings.length
			result.push({:workout => workout, :trainings => trainings_count})
		end

		response = {
			error_code: 200,
			payload: {
				workouts: result,
				start_date: start_date,
				end_date: end_date
			}
		}

		render json: response

	end

	def new

		start_day = params[:s]
		end_day = params[:e]

		gon.adding_workouts = true

		gon.start_day = start_day
		gon.end_day = end_day

	end

	def create
		
		start_day = params[:startDay]
		end_day = params[:endDay]

		gon.adding_workouts = nil

		workout_plan = params[:days]
		counter = 0

		workout_plan.each do |key, value|

			value['workoutHours'].each do |key, workoutHour|

				workout_date = DateTime.parse(value['date'] + " " + workoutHour['hour'])

				workouts = Workout.where(:date => workout_date)

				if workouts.length == 0

					workout = Workout.new

					workout.date = workout_date
					workout.max_participants = workoutHour['maxParticipants']
					workout.save!

					counter += 1
				end
			end
		end

		response = {
			error_code: 200,
			payload: {
				counter: counter,
				start_day: start_day,
				end_day: end_day
			}
		}

		render json: response

	end

end
