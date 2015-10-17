class UsersController < ApplicationController

	def index

		@total_trainings = 0

		@users = User.all
		@users.each do |user|
			trainings_count = user.trainings.length
			@total_trainings += trainings_count
		end

	end


end
