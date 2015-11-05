class UserMailer < ApplicationMailer

	default from: "miguel.gazela@gmail.com"

	def out_of_waiting_queue(user, workout)
		@user = user
		@workout = workout

		mail(to: @user.email, subject: 'SLCrossBox Gondomar - Vaga')
	end

end
