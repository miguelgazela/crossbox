class AddDateToTraining < ActiveRecord::Migration
  def change
  	add_column :trainings, :date, :datetime
  end
end
