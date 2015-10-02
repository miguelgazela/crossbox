class CreateTrainings < ActiveRecord::Migration
  def change
    create_table :trainings do |t|

      t.timestamps null: false
    end
  end
end
