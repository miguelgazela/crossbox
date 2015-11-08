class Workout < ActiveRecord::Base

	has_many :trainings
	has_many :users, through: :trainings


	def self.week_workouts
		Workout.where("date > ?", Date.today.beginning_of_week)
	end

end
