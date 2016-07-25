namespace :trainings do
  desc "Sync the number of trainings"
  task sync_user_trainings_count: :environment do

    @users = User.all
    @users.each do |user|

      user.numWorkouts = user.trainings_count
      user.save!
    end

  end
end
