class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user
  helper_method :require_user
  helper_method :new_accounts_count

  helper_method :clear_gon

  helper_method :require_account_management_rights

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def require_user
  	redirect_to '/login' unless current_user
  end

  def new_accounts_count
    @new_accounts_count = User.where('role': 'new_user').count
  end

  def require_account_management_rights
    redirect_to '/' unless current_user && (current_user.role == 'admin' || current_user.role == 'coach')
  end

  def clear_gon
    gon.start_day = nil;
    gon.adding_workouts = nil;
    gon.end_day = nil;
    gon.added_workouts = nil;
  end

end
