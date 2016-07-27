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

ActiveRecord::Schema.define(version: 20160727140559) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "events", force: :cascade do |t|
    t.string   "title"
    t.text     "text"
    t.integer  "type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "pr_entries", force: :cascade do |t|
    t.integer  "exercise_id"
    t.integer  "repetitions"
    t.integer  "load_percentage"
    t.integer  "value"
    t.text     "notes"
    t.integer  "user_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "event_id"
  end

  add_index "pr_entries", ["event_id"], name: "index_pr_entries_on_event_id", using: :btree
  add_index "pr_entries", ["user_id"], name: "index_pr_entries_on_user_id", using: :btree

  create_table "trainings", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "user_id"
    t.integer  "workout_id"
    t.integer  "guests"
    t.datetime "date"
    t.integer  "event_id"
  end

  add_index "trainings", ["event_id"], name: "index_trainings_on_event_id", using: :btree
  add_index "trainings", ["user_id"], name: "index_trainings_on_user_id", using: :btree
  add_index "trainings", ["workout_id"], name: "index_trainings_on_workout_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "role"
    t.string   "provider"
    t.string   "uid"
    t.string   "oauth_token"
    t.datetime "oauth_expires_at"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.string   "image"
    t.string   "url"
    t.string   "email"
    t.string   "password_digest"
    t.integer  "trainings_count",  default: 0
    t.integer  "numWorkouts"
  end

  create_table "workouts", force: :cascade do |t|
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.text     "note"
    t.datetime "date"
    t.string   "max_participants", default: "13"
  end

  add_foreign_key "pr_entries", "events"
  add_foreign_key "pr_entries", "users"
  add_foreign_key "trainings", "events"
end
