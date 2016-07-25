class AddWorkoutCounterColumnToUsers < ActiveRecord::Migration
  def change
    add_column :users, :numWorkouts, :integer
  end
end
