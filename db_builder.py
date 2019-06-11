from game_data import *
from config import DATABASE_URI
from models import User, Question, Record, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from contextlib import contextmanager
from random import randint, shuffle
from werkzeug.security import check_password_hash, generate_password_hash
from json import dumps


engine = create_engine(DATABASE_URI)

session_factory = sessionmaker(bind=engine)
db = scoped_session(session_factory)


@contextmanager
def session_scope():
  session = session_factory()
  try:
    yield session
    session.commit()
  except Exception:
    session.rollback()
    raise
  finally:
    session.close()


def recreate_database():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)


# app.py operations (adding users, loading questions, updating gradebook)

# User Registrations and Logins:

def register_user(username, password):
  if not search_users(username):
    db.execute("INSERT INTO users (username, password) VALUES (:username, :password)", 
                {"username": username, "password": generate_password_hash(password, method='pbkdf2:sha256', salt_length=4)})
    db.commit()
    return search_users(username)
  else:
    return None

def search_users(username):
  return db.execute("SELECT * FROM users WHERE username = :username", {"username": username}).fetchone()

# Loading Questions:

def get_questions(gametype, set_size=None):
  if set_size == None:
    return db.execute("SELECT * FROM questions WHERE gametype = :gametype", {"gametype": gametype}).fetchall()
  else:
    return db.execute("SELECT * FROM questions WHERE gametype = :gametype", {"gametype": gametype}).fetchmany(set_size)


# Updating the Gradebook:

def update_gradebook(ru_id, rq_id, correct):
  r_id = db.execute("SELECT r_id FROM gradebook WHERE ru_id = :ru_id AND rq_id = :rq_id", 
                    {"ru_id": ru_id, "rq_id": rq_id}).fetchone()
  try:
    update_user_record(r_id[0], correct) if r_id else new_user_record(ru_id, rq_id, correct)
    return True
  except:
    return False


def new_user_record(ru_id, rq_id, correct):
  with session_scope() as s:
    record = Record(
        ru_id= ru_id, 
        rq_id= rq_id, 
        correct= correct, 
        attempts= 1     
    )
    s.add(record)


def update_user_record(r_id, correct):
  db.execute(f"UPDATE gradebook SET attempts = attempts + 1, correct = correct + :correct WHERE r_id = :r_id",
              {"correct": correct, "r_id": r_id})
  db.commit()

def get_user_grades(ru_id):
  grades = db.execute("SELECT * FROM gradebook WHERE ru_id = :ru_id", 
                    {"ru_id": ru_id}).fetchall()
  return grades

def get_profile_grades(ru_id):
  grades = db.execute("SELECT gradebook.correct, gradebook.attempts, questions.q_id, questions.gametype, questions.qinfo_1, questions.qinfo_2, questions.qinfo_3, questions.answer \
                        FROM gradebook \
                        INNER JOIN questions \
                        ON questions.q_id = gradebook.rq_id \
                        WHERE ru_id = :ru_id", {"ru_id": ru_id}).fetchall()
  return grades

def serialize_grades(item):
  return {
    "correct": int(item.correct),
    "attempts": int(item.attempts),
    "q_id": int(item.q_id),
    "gametype": item.gametype,
    "qinfo_1": item.qinfo_1,
    "qinfo_2": item.qinfo_2,
    "qinfo_3": item.qinfo_3,
    "answer": item.answer
  }

# Load DB Questions with ORM:

def add_prep_qs():
  questions = []
  for item in prepSet:
    question = Question(
      gametype='preps', 
      qinfo_1=item[1], 
      answer=prepKey[item[0]], 
      choice_a=prepKey[0], 
      choice_b=prepKey[1], 
      choice_c=prepKey[2],
      choice_d=prepKey[3]        
    )
    questions.append(question)
  load_list(questions)


def add_gender_qs():
  questions = []
  for item in genderSet:
    question = Question(
      gametype='gender', 
      qinfo_1=item[1], 
      answer=genderKey[item[0]], 
      choice_a=genderKey[0], 
      choice_b=genderKey[1], 
      choice_c=genderKey[2]     
    )
    questions.append(question)
  load_list(questions)


def add_ending_qs():
  questions = []
  for item in endingSet:
    question = Question(
      gametype='endings', 
      qinfo_1=item[1], 
      answer=endingKey[item[0]], 
      choice_a=endingKey[0], 
      choice_b=endingKey[1], 
      choice_c=endingKey[2],
      example=item[2]   
    )
    questions.append(question)
  load_list(questions)


def add_article_qs():
  questions = []
  for item in articleSet:
    choices = gen_random_choices(articleKey[item[0]])
    shuffle(choices)
    question = Question(
      gametype='articles', 
      qinfo_1=a_types[item[1]],
      qinfo_2=a_genders[item[2]],
      qinfo_3=a_cases[item[3]],
      answer=articleKey[item[0]], 
      choice_a=choices[0], 
      choice_b=choices[1], 
      choice_c=choices[2],
      choice_d=choices[3],
      example=item[2]   
    )
    questions.append(question)
  load_list(questions)

def gen_random_choices(answer):
  choices = None
  if answer[0] == "e":
    choices = choice_list(answer, indef_articles)
  elif answer[0] == "d":
    choices = choice_list(answer, def_articles)
  shuffle(choices)
  return choices

def choice_list(answer, artList):
  ansList = [answer]
  while len(ansList) < 4:
    pa = artList[randint(0,5)]
    if pa not in ansList:
      ansList.append(pa)
  return ansList

def load_list(the_list):
  with session_scope() as s:
    for item in the_list:
      s.add(item)


def serialize_question(item):
  return {
    "q_id": int(item.q_id),
    "qinfo_1": item.qinfo_1,
    "qinfo_2": item.qinfo_2,
    "qinfo_3": item.qinfo_3,
    "answer": item.answer,
    "choice_a": item.choice_a,
    "choice_b": item.choice_b,
    "choice_c": item.choice_c,
    "choice_d": item.choice_d,
    "example": item.example,
  }


def serialize_record(item):
  return {
    "r_id": int(item.r_id),
    "ru_id": int(item.ru_id),
    "rq_id": int(item.rq_id),
    "correct": int(item.correct),
    "attempts": int(item.attempts)
  }


if __name__ == '__main__':
  recreate_database()
  add_gender_qs()
  add_prep_qs()
  add_ending_qs()
  add_article_qs()
  register_user("derek2", "pppoo")
  register_user("anni5", "dogs")
  update_gradebook(1, 2, 0)
  foo = get_questions("preps")
  print(type(foo))
  print(get_profile_grades(1)[0]["qinfo_1"])
  