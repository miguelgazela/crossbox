class AddCacheColumnToUser < ActiveRecord::Migration
  def change

  	add_column :users, :trainings_count, :integer, :default => 0

  	User.reset_column_information

  	User.all.each do |user|
  		User.update_counters(user.id, :trainings_count => user.trainings.length)
  	end

  end
end
