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
		puts params
		redirect_to root_path
	end

end
