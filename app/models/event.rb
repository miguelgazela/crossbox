class Event < ActiveRecord::Base

  has_one :training
  has_one :pr_entry
  has_one :workout, through: :training

end
