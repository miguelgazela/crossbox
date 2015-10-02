class SessionsController < ApplicationController

  def new
  end

  def create

    auth_hash = request.env['omniauth.auth']

    user = User.find_by(uid: auth_hash['uid'])

    if user

      if user.role != 'new_user'
        session[:user_id] = user.id
        redirect_to root_path
      else

        flash[:user_not_confirmed] = "user not confirmed"
        redirect_to action: 'new'

      end

    else

      user = User.new

      user.uid = auth_hash['uid']
      user.provider = auth_hash['provider']
      user.role = 'new_user'
      user.name = auth_hash['info']['name']
      user.url = auth_hash['info']['urls']['Facebook']
      user.image = auth_hash['info']['image']

      user.save!
    end
    
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path
  end

end
