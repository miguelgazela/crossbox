class UsersController < ApplicationController

	def index

		@total_trainings = 0

		@users = User.all

		@users.each do |user|

			@total_trainings += user.trainings_count

		end

	end

	def new
		@user = User.new
	end

  def create

    @user = User.new(user_params)

    user = User.find_by(email: user_params['email'])

    if user
      flash[:email_already_exists] = "email_already_exists"
      redirect_to root_path
      return
    end

    @user.image = "http://placehold.it/200x200"
    @user.role = "new_user"
    @user.provider = "crossbox"

    if @user.save!
      flash[:user_created_account] = "created account"
      redirect_to root_path
    else
      redirect_to '/users/new'
    end

  end

  def top_3_of_week

    top_hash = Hash.new(0)

    week_workouts = Workout.week_workouts

    week_workouts.each do |workout|

      workout.trainings.each do |training|

        top_hash[training.user.id] = top_hash[training.user.id] + 1

      end

    end

    puts top_hash.sort_by { |id, trainings| trainings }

  end

	private
	  def user_params
	    params.permit(:name, :email, :password, :password_confirmation)
	  end


end
