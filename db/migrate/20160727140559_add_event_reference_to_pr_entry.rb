class AddEventReferenceToPrEntry < ActiveRecord::Migration
  def change
    add_reference :pr_entries, :event, index: true, foreign_key: true
  end
end
