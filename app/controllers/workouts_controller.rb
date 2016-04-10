class WorkoutsController < ApplicationController

	before_action :require_user, only: [:show, :week_workouts, :change_training_state]
	before_action :require_account_management_rights, only: [:new, :create, :delete_workout]
	before_action :clear_gon, only: [:show, :week_workouts, :new, :create]

	def show

		@workout = Workout.find(params[:id])
		@in_workout = Training.find_by(user_id: current_user.id, workout_id: params[:id])

		@percentage = (((@workout.trainings.length * 1.0) / Integer(@workout.max_participants)) * 100).round

	end

	def change_training_state

		action = params[:a]
		return_home = params[:rh]

		training = Training.find_by(user_id: current_user.id, workout_id: params[:id])
		workout = Workout.find_by(id: params[:id])

		if action == "enter"

			guests = Integer(params[:g])

			if training
				redirect_to "/workouts/" + params[:id]
				return
			end

			training = Training.new

			training.user_id = current_user.id
			training.workout_id = params[:id]
			training.guests = guests

			training.save!

			if return_home
				redirect_to root_path
			else
				redirect_to "/workouts/" + params[:id]
			end

		elsif action == "leave"

			trainings = Training.where(workout_id: params[:id]).order(:id)

			if trainings.length > Integer(workout.max_participants)

				index = 0

				while index < trainings.length do

					if trainings[index].id == training.id
						break
					end

					index += 1

				end

				# the user had one of the openings

				if index < Integer(workout.max_participants)

					# send email to the first of the users waiting in line

					user = trainings[Integer(workout.max_participants)].user

					if user.email && user.email != ""
						UserMailer.out_of_waiting_queue(user, workout).deliver
					end

					admin = User.find_by(email: 'miguel.gazela@gmail.com')
					UserMailer.out_of_waiting_queue(admin, workout).deliver

				end

			end

			if training
				training.delete
			end

			if return_home
				redirect_to root_path
			else
				redirect_to "/workouts/" + params[:id]
			end

		elsif action == "change_guests"

			guests = Integer(params[:g])

			training.guests = guests
			training.save!

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

			# get thumbnails from users of the workout

			users_thumbnails = Array.new

			workout.trainings.each do |training|
				users_thumbnails.push(training.user.image);
			end

			training = Training.find_by(user_id: current_user.id, workout_id: workout.id)

			result.push({:workout => workout, :trainings => trainings_count, :in_workout => training, :thumbnails => users_thumbnails})
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

	def delete_workout

		workout = Workout.find(params[:id])

		if workout

			workout.trainings.each do |training|
				training.delete
			end

			workout.delete

		end

		redirect_to root_path

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
