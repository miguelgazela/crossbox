class HomeController < ApplicationController

  before_action :require_user, only: [:show]
  
  def show

  end

end
