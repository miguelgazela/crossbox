class HomeController < ApplicationController

  before_action :require_user, only: [:show]
  before_action :clear_gon, only: [:show]

  def show

    @in_schedule = true

    @trainings = []

    @user_trainings = Training.where(user_id: current_user.id)
    @user_trainings.each do |training|

      if training.workout.date >= Date.today

        workout_trainings = training.workout.trainings.order(:id)

        index = 0

        while index < workout_trainings.length do

          if workout_trainings[index].id == training.id

            if index < Integer(training.workout.max_participants)
              @trainings.push({:training => training, :state => "Inscrito/a"})
            else
              @trainings.push({:training => training, :state => "Em Espera"})
            end

          end

          index += 1

        end

      end

    end

  end

  def contacts
  end

end
