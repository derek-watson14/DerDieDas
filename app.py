from flask import Flask, render_template, request
import json
from game_data import *

app = Flask(__name__)
app.config['TESTING'] = True

@app.route("/")
def newGame():
  return render_template("new-game.html")

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