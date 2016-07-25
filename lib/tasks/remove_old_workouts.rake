namespace :workouts do
  desc "Removes workouts older than 6 months"
  task remove_old_workouts: :environment do

    @workouts = Workout.all
    @workouts.each do |workout|

      if workout.date < Time.now.to_date - 6.months

        workout.trainings.each do |training|
          training.delete
        end

        workout.delete

      end

    end

  end
end
