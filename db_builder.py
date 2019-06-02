from game_data import *
from config import DATABASE_URI
from models import User, Question, Record, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager
from random import randint, shuffle


engine = create_engine(DATABASE_URI)

Session = sessionmaker(bind=engine)


@contextmanager
def session_scope():
  session = Session()
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


def sampleUser():
  sUser = User(username='derek', password='123')
  with session_scope() as s:
    s.add(sUser)


def sampleQuestion():
  sQuestion = Question(game_type='gender', qInfo_1='Stift', answer='der', 
                      choiceA='der', choiceB='die', choiceC='das'        
  )
  with session_scope() as s:
    s.add(sQuestion)


def loadList(theList):
  with session_scope() as s:
    for item in theList:
      s.add(item)


def generateRandomChoices(answer):
  choices = None
  if answer[0] == "e":
    return makeChoiceList(answer, indef_articles)
  elif answer[0] == "d":
    return makeChoiceList(answer, def_articles)
  return choices



def makeChoiceList(answer, artList):
  ansList = [answer]
  while len(ansList) < 4:
    pa = artList[randint(0,5)]
    if pa not in ansList:
      ansList.append(pa)
  return ansList


def addPrepositionQuestions():
  questions = []
  for item in prepSet:
    question = Question(
      game_type='preps', 
      qInfo_1=item[1], 
      answer=prepKey[item[0]], 
      choiceA=prepKey[0], 
      choiceB=prepKey[1], 
      choiceC=prepKey[2],
      choiceD=prepKey[3]        
    )
    questions.append(question)
  loadList(questions)


def addGenderQuestions():
  questions = []
  for item in genderSet:
    question = Question(
      game_type='gender', 
      qInfo_1=item[1], 
      answer=genderKey[item[0]], 
      choiceA=genderKey[0], 
      choiceB=genderKey[1], 
      choiceC=genderKey[2]     
    )
    questions.append(question)
  loadList(questions)


def addEndingQuestions():
  questions = []
  for item in endingSet:
    question = Question(
      game_type='endings', 
      qInfo_1=item[1], 
      answer=endingKey[item[0]], 
      choiceA=endingKey[0], 
      choiceB=endingKey[1], 
      choiceC=endingKey[2],
      example=item[2]   
    )
    questions.append(question)
  loadList(questions)


def addArticleQuestions():
  questions = []
  for item in articleSet:
    choices = generateRandomChoices(articleKey[item[0]])
    shuffle(choices)
    question = Question(
      game_type='articles', 
      qInfo_1=a_types[item[1]],
      qInfo_2=a_genders[item[2]],
      qInfo_3=a_cases[item[3]],
      answer=articleKey[item[0]], 
      choiceA=choices[0], 
      choiceB=choices[1], 
      choiceC=choices[2],
      choiceD=choices[3],
      example=item[2]   
    )
    questions.append(question)
  loadList(questions)


if __name__ == '__main__':
  recreate_database()
  addGenderQuestions()
  addPrepositionQuestions()
  addEndingQuestions()
  addArticleQuestions()
  with session_scope() as s:
    print(s.query(Question).filter_by(game_type='gender').limit(2).all())
    print(s.query(Question).filter_by(game_type='endings').limit(2).all())
    print(s.query(Question).filter_by(game_type='articles').limit(2).all())
    print(s.query(Question).filter_by(game_type='preps').limit(2).all())
    
