class CreatePrEntries < ActiveRecord::Migration
  def change
    create_table :pr_entries do |t|

      t.integer :exercise_id
      t.integer :repetitions
      t.integer :load_percentage
      t.integer :value
      t.text :notes
      t.references :user, index: true, foreign_key: true
      t.timestamps null: false

    end
  end
end
