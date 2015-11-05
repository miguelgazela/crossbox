class UserMailer < ApplicationMailer

	default from: "slcrossbox@gmail.com"

	def out_of_waiting_queue(user)
		@user = user
		@url = "http://www.google.com"
		mail(to: @user.email, subject: 'SLCrossBox Gondomar - Nova Vaga')
	end

end
