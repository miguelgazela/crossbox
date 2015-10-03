OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, '1031799550173270', '36337a55f869a48526e91fc92360a037', :scope => 'public_profile, email', :image_size => 'normal', :info_fields => 'id, email, name, link, about, bio, hometown'
end