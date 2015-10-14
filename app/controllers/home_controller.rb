class HomeController < ApplicationController

  before_action :require_user, only: [:show]
  before_action :clear_gon, only: [:show]
  
  def show
  end

  def contacts
  end

end
