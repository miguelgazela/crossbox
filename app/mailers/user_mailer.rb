class UserMailer < ApplicationMailer

	default from: "miguel.gazela@gmail.com"

	def out_of_waiting_queue(user)
		@user = user
		mail(to: @user.email, subject: 'SLCrossBox Gondomar - Nova Vaga')
	end

end
