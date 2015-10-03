class HomeController < ApplicationController

  before_action :require_user, only: [:show]
  
  def show
    @new_accounts_count = User.where('role': 'new_user').count
  end

end
