class WorkoutsController < ApplicationController

	before_action :require_account_management_rights, only: [:new]

	def index
	end

	def new

		start_day = params[:s]
		end_day = params[:e]

		gon.adding_workouts = true

		gon.start_day = start_day
		gon.end_day = end_day

	end

	def create
		
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

		redirect_to root_path
	end

end
