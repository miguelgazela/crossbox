class AddWorkoutAndUserToTrainings < ActiveRecord::Migration
  def change
    add_reference :trainings, :user, index: true, foreign_key: true
    add_reference :trainings, :workout, index: true, foreign_key: true
  end
end
