class AddEventReferenceToTrainings < ActiveRecord::Migration
  def change
    add_reference :trainings, :event, index: true, foreign_key: true
  end
end
