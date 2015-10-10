class SessionsController < ApplicationController

  before_action :require_user, only: [:show]
  before_action :require_account_management_rights, only: [:index, :authorize, :cancel] 

  # TODO: this method is responsible for showing the home page
  #       change it eventually to a more appropriate controller
  def new
  end

  def index
    @new_accounts = User.where(role: 'new_user')
  end

  def create

    auth_hash = request.env['omniauth.auth']

    user = User.find_by(uid: auth_hash['uid'])

    if user

      user.email = auth_hash['info']['email']
      user.image = auth_hash['info']['image']
      user.url = auth_hash['info']['urls']['Facebook']
      user.name = auth_hash['info']['name']

      user.save!

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
      user.email = auth_hash['info']['email']
      user.name = auth_hash['info']['name']
      user.url = auth_hash['info']['urls']['Facebook']
      user.image = auth_hash['info']['image']

      user.save!

      flash[:user_created_account] = "created account"
      redirect_to action: 'new'

    end
    
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path
  end

  def authorize

    user = User.find(params[:id])

    if user

      user.role = 'verified_user'
      user.save!

      if User.where(role: 'new_user').count == 0
        redirect_to root_path
      else
        redirect_to :action => 'index'
      end

    else
      redirect_to :action => 'index'
    end

    print params[:id]
  end

  def cancel

    user = User.find(params[:id])

    if user
      user.delete
    end

    if User.where(role: 'new_user').count == 0
        redirect_to root_path
    else
      redirect_to :action => 'index'
    end

  end

end
