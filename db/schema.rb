# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151007100504) do

  create_table "trainings", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "user_id"
    t.integer  "workout_id"
  end

  add_index "trainings", ["user_id"], name: "index_trainings_on_user_id"
  add_index "trainings", ["workout_id"], name: "index_trainings_on_workout_id"

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "role"
    t.string   "provider"
    t.string   "uid"
    t.string   "oauth_token"
    t.datetime "oauth_expires_at"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "image"
    t.string   "url"
    t.string   "email"
  end

  create_table "workouts", force: :cascade do |t|
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.text     "note"
    t.datetime "date"
    t.string   "max_participants", default: "13"
  end

end
