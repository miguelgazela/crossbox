class Training < ActiveRecord::Base

	belongs_to :workout
	belongs_to :event
	belongs_to :user, :counter_cache => true

end
