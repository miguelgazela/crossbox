class AddFieldsToWorkout < ActiveRecord::Migration
  def change

  		add_column :workouts, :note, :text
      add_column :workouts, :date, :datetime
      add_column :workouts, :max_participants, :string, default: 13

  end
end
