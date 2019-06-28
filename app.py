from flask import Flask, flash, render_template, request, session, redirect
from queries import (register_user, search_users, get_questions,
                     serialize_record, serialize_grades, update_gradebook,
                     serialize_question, grades_for, profile_table,
                     filter_qs)
from werkzeug.security import check_password_hash
from json import dumps
from config import SECRET_KEY


app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.secret_key = SECRET_KEY
app.config['SESSION_TYPE'] = 'filesystem'


def apology(message, code=400):
    return render_template("apology.html", code=code, message=message), code


def get_u_id():
    return session["user_id"] if session.get("user_id") else None


@app.route("/new-game")
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
        if user and check_password_hash(user["password"],
                                        request.form.get("password")):
            session["user_id"] = user["u_id"]
            session["username"] = user["username"]
            session["reg_date"] = user["reg_date"].strftime("%B %dth, %Y")
            flash(f"{session['username']} logged in!")
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

        user = register_user(request.form.get("username"),
                             request.form.get("password"))
        if user:
            session["user_id"] = user["u_id"]
            session["username"] = user["username"]
            session["reg_date"] = user["reg_date"].strftime("%B %dth, %Y")
            flash(f"{user.username} registered and logged in!")
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
        user_record = [serialize_grades(record) for record
                       in profile_table(session["user_id"])]

    return render_template("profile.html", user_record=user_record)


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")


@app.route("/")
@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/game/<gametype>", methods=["POST", "GET"])
def run_game(gametype):
    template = determine_template(gametype)
    serialized = None

    if request.method == "POST":
        session["current_gametype"] = gametype

        max_score = (normalize_max_score(int(request.form.get("maxScore")))
                     if request.form.get("maxScore") else None)

        questions = (filter_qs(gametype, max_score, session["user_id"])
                     if max_score else get_questions(gametype))

        serialized = [serialize_question(question) for question in questions]

        full = len(serialized)
        usr_len = (int(request.form.get("setSize"))
                   if request.form.get("setSize") else None)

        set_size = usr_len if usr_len and usr_len <= full else full
        session["set_size"] = set_size

    return render_template(template,
                           gametype=gametype,
                           questions=serialized,
                           setSize=session["set_size"],
                           user=get_u_id())


def determine_template(gametype):
    if gametype == "gender":
        return "games/gender.html"
    if gametype == "preps":
        return "games/prepositions.html"
    if gametype == "endings":
        return "games/endings.html"
    if gametype == "articles":
        return "games/articles.html"


def normalize_max_score(max_score):
    if max_score > 100:
        return 100
    elif max_score < 0:
        return 0
    else:
        return max_score


@app.route("/results")
def results():
    session["current_gametype"] = None
    session["set_size"] = None
    session["results"] = True
    user_record = None
    if session.get("user_id"):
        user_record = [serialize_record(record) for record
                       in grades_for(session["user_id"])]

    return render_template("results.html",
                           user_record=user_record)


@app.route("/update_grades", methods=["POST"])
def update_grades():
    if request.method == "POST":
        new_grade = request.get_json()
        update_gradebook(new_grade["u_id"],
                         new_grade["q_id"],
                         new_grade["correct"])
        return dumps("success")
