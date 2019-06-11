from flask import Flask, flash, render_template, request, session, redirect, escape
from db_builder import register_user, search_users, get_questions, serialize_question, serialize_record, serialize_grades, update_gradebook, get_user_grades, get_profile_grades
from werkzeug.security import check_password_hash, generate_password_hash
from json import dumps, loads

# ADD PASSWORD SECURITY

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.secret_key = 'super secret key'
app.config['SESSION_TYPE'] = 'filesystem'

def apology(message, code=400):
    return render_template("apology.html", code=code, message=message), code

@app.route("/")
def newGame():
  return render_template("new-game.html")

@app.route("/login", methods=["GET", "POST"])
def login():
  if request.method == "POST":
    session.clear()
    if not request.form.get("username"):
      return apology("must provide username", 403)
    elif not request.form.get("password"):
      return apology("must provide password", 403)

    user = search_users(request.form.get("username"))
    if user and check_password_hash(user[2], request.form.get("password")):
      session["user_id"] = user[0]
      session["username"] = user[1]
      flash(f"{user[1]} logged in!")
      return redirect("/")
    else:
      flash("Incorrect username or password")
      return redirect("/login")

  else:
    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
  if request.method == "POST":
    session.clear()
    if not request.form.get("username"):
      return apology("must provide username", 403)
    elif not request.form.get("password"):
      return apology("must provide password", 403)
    elif request.form.get("password") != request.form.get("repeat"):
      return apology("passwords must match", 403)

    user = register_user(request.form.get("username"), request.form.get("password"))
    if user:
      session["user_id"] = user[0]
      session["username"] = user[1]
      flash(f"{user[1]} registered and logged in!")
      return redirect("/")
    else: 
      flash("Username taken")
      return redirect("/register")

  else:
    return render_template("register.html")

@app.route("/profile")
def profile():
  user_record = None
  if session:
    user_record = [serialize_grades(record) for record in get_profile_grades(get_u_id())]
  return render_template("profile.html", user_record=user_record)

@app.route("/logout")
def logout():
    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/login")

def get_u_id():
  return session["user_id"] if session else None

@app.route("/about")
def about():
  return render_template("about.html")

# questions will be a list of tuples with the format (using indexes[]):
# [0] q_id, [1] gametype, [2] - [4] question info, [5] answer, [6] - [9] choices, [10] example

@app.route("/endings")
def endings():
  game_type = "endings"
  questions = [serialize_question(question) for question in get_questions("endings")]
  return render_template("endings.html", game_type=game_type, questions=questions, user=dumps(get_u_id()))

@app.route("/articles")
def articles():
  game_type = "articles"
  questions = [serialize_question(question) for question in get_questions("articles")]
  return render_template("articles.html", game_type=game_type,  questions=questions, user=dumps(get_u_id()))

@app.route("/gender")
def gender():
  game_type = "gender"
  questions = [serialize_question(question) for question in get_questions("gender")]
  return render_template("gender.html", game_type=game_type, questions=questions, user=dumps(get_u_id()))

@app.route("/prepositions")
def prepositions():
  game_type = "preps"
  questions = [serialize_question(question) for question in get_questions("preps")]
  return render_template("prepositions.html", game_type=game_type, questions=questions, user=dumps(get_u_id()))
  # return render_template("prepositions.html", key=prepKey, wordSet=prepSet, gameType=prepGt)

@app.route("/results")
def results():
  user_record = None
  if session:
    user_record = [serialize_record(record) for record in get_user_grades(get_u_id())]
  return render_template("results.html", user_record=user_record)


@app.route("/update_grades", methods=["POST"])
def update_grades():
  if request.method == "POST":
    new_grade = request.get_json()
    result = update_gradebook(new_grade["u_id"], new_grade["q_id"], new_grade["correct"])
    return dumps(result)
