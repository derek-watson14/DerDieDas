from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def newGame():
  return render_template("new-game.html")

@app.route("/about")
def about():
  return render_template("about.html")

@app.route("/articles")
def articles():
  return render_template("articles.html")

@app.route("/gender")
def gender():
  return render_template("gender.html")

@app.route("/prepositions")
def prepositions():
  return render_template("prepositions.html")

@app.route("/results")
def results():
  return render_template("results.html")