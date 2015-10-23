class User < ActiveRecord::Base

  has_secure_password

  has_many :trainings
  has_many :workouts, through: :trainings

  def self.from_omniauth(auth_hash)
    user = find_by_or_create(uid: auth_hash['uid'], provider: auth_hash['provider'])

    user.role = 'user'
    user.name = auth_hash['info']['name']
    user.url = auth_hash['info']['urls']['Facebook']
    user.image = auth_hash['info']['image']

    user.save!
    user
  end
  

end
