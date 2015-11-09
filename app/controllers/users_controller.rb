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

    week_start = DateTime.now.beginning_of_week
    week_end = DateTime.now.end_of_week

    top_hash = Hash.new(0)

    week_workouts = Workout.where("date > ? and date < ?", week_start, week_end)

    week_workouts.each do |workout|

      workout.trainings.each do |training|

    #     puts "Training"
    #     puts "Training user " + training.user.name

        top_hash[training.user.id] = top_hash[training.user.id] + 1

      end

    end

    @top = []

    frequencies = top_hash.sort_by {|a, b| b }
    frequencies.reverse!

    frequencies.each do |userid, frequency|

      if @top.length < 3 || @top.last[:frequency] == frequency

        user = User.find_by(id: userid)

        if user.role != "coach"
          @top.push({:user => user, :frequency => frequency})
        end

      end

    end

    response = {
      error_code: 200,
      payload: {
        week_start: week_start,
        week_end: week_end,
        top: @top
      }
    }

    render json: response

  end

	private
	  def user_params
	    params.permit(:name, :email, :password, :password_confirmation)
	  end


end
