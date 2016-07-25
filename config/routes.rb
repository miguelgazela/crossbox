Rails.application.routes.draw do

  root to: "home#show"

  get '/contacts' => 'home#contacts'

  # sessions

  resources :sessions, only: [:create, :index]
  get 'sessions/destroy'
  get 'login' => 'sessions#new'
  get 'signout' => 'sessions#destroy', as: 'signout'
  post '/signin' => 'sessions#signin'
  post 'users/yes/:id' => 'sessions#authorize'
  post 'users/no/:id' => 'sessions#cancel'
  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/') # this redirects in case the user denied access for our application

  # PRs

  resources :pr_entrys, only: [:index, :create]
  get 'personal_best' => 'workouts#personal_best'
  get 'activity' => 'pr_entrys#activity'

  # users

  resources :users

  get 'users/:id/delete' => 'users#delete'
  get 'users/top_month' => 'users#top_3_of_month'
  get 'profile' => 'users#profile'

  # workouts

  resources :workouts, only: [:show, :new, :create]
  get 'workouts_configurator' => 'workouts#configurator'
  post 'workouts_configurator' => 'workouts#configurator_create'
  get 'week_workouts' => 'workouts#week_workouts'
  get 'workouts/:id/state' => 'workouts#change_training_state'
  get 'workouts/:id/delete' => 'workouts#delete_workout'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
