namespace :trainings do
  desc "Removes all duplicated trainings of the same day for all users"
  task remove_same_day_trainings: :environment do

    puts "Removing same day trainings..."

    @users = User.all
    @users.each do |user|

      puts "Processing " + user.name + "..."

      busy_days = {}

      user.trainings.each do |training|

        workout = training.workout

        if workout

          workout_date = training.workout.date.to_formatted_s(:db)[0..9]

          if busy_days.key?(workout_date)
            training.delete
          else
            busy_days[workout_date] = "Y"
          end

        end

			end

    end

  end
end
