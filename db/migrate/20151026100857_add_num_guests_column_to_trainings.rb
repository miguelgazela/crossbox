class AddNumGuestsColumnToTrainings < ActiveRecord::Migration
  def change
    add_column :trainings, :guests, :integer
  end
end
