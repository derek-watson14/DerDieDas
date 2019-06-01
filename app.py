from flask import Flask, render_template, request, session
import json
import csv
from game_data import *

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.secret_key = 'super secret key'
app.config['SESSION_TYPE'] = 'filesystem'

# Temporary users home until database is integrated
users = {"derek": "123", "anni": "password1", "tyler": "glasboi"}

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

    if request.form.get("username") in users:
      if request.form.get("password") == users[f'{request.form.get("username")}']:
        return apology("successful login", 200)
      else:
        return apology("incorrect password")
    else:
      return apology("username does not exsist")

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

    users[f"{request.form.get('username')}"] = request.form.get("password")
    return apology("registered!!", 200)

  else:
    return render_template("register.html")

@app.route("/about")
def about():
  return render_template("about.html")

@app.route("/endings")
def endings():
  endingGt = "endings"
  return render_template("endings.html", key=endingKey, wordSet=endingSet, gameType=endingGt)

@app.route("/articles")
def articles():
  articleGt = "articles"
  return render_template("articles.html", key=articleKey, wordSet=articleSet, gameType=articleGt)

@app.route("/gender")
def gender():
  genderGt = "gender"
  return render_template("gender.html", key=genderKey, wordSet=genderSet, gameType=genderGt)

@app.route("/prepositions")
def prepositions():
  prepGt = "preps"
  return render_template("prepositions.html", key=prepKey, wordSet=prepSet, gameType=prepGt)

@app.route("/results")
def results():
  return render_template("results.html")