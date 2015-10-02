class Workout < ActiveRecord::Base

	has_many :trainings
	has_many :users, through: :trainings

end
