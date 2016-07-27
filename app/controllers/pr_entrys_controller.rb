class PrEntrysController < ApplicationController

  before_action :require_user, only: [:show, :create]

  def index

    @in_prs = true

    @fs = PrEntry.where(user_id: current_user.id, exercise_id: 1).order('created_at desc')
    @best_fs_pr = nil

    max_value = 0
    @fs.each do |pr|

      if pr.value > max_value
        @best_fs_pr = pr
        max_value = pr.value
      end

    end

    @bs = PrEntry.where(user_id: current_user.id, exercise_id: 2).order('created_at desc')
    @best_bs_pr = nil

    max_value = 0
    @bs.each do |pr|

      if pr.value > max_value
        @best_bs_pr = pr
        max_value = pr.value
      end

    end

    @hc = PrEntry.where(user_id: current_user.id, exercise_id: 3).order('created_at desc')
    @best_hc_pr = nil

    max_value = 0
    @hc.each do |pr|

      if pr.value > max_value
        @best_hc_pr = pr
        max_value = pr.value
      end

    end

    @so = PrEntry.where(user_id: current_user.id, exercise_id: 4).order('created_at desc')
    @best_so_pr = nil

    max_value = 0
    @so.each do |pr|

      if pr.value > max_value
        @best_so_pr = pr
        max_value = pr.value
      end

    end

    @th = PrEntry.where(user_id: current_user.id, exercise_id: 5).order('created_at desc')
    @best_th_pr = nil

    max_value = 0
    @th.each do |pr|

      if pr.value > max_value
        @best_th_pr = pr
        max_value = pr.value
      end

    end

  end

  def create

    value = params[:value]
		num_reps = params[:numReps]
    percentage = params[:percentage]
    exercise_id = params[:exerciseId]

    response = {
			error_code: 200,
			payload: {}
		}

    pr = PrEntry.new

    pr.exercise_id = exercise_id
    pr.repetitions = num_reps
    pr.load_percentage = percentage
    pr.value = value
    pr.user_id = current_user.id

    pr.save!

		render json: response

  end

  def activity

    @events = PrEntry.all.limit(50)

  end

end
