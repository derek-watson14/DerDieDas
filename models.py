from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String

Base = declarative_base()

class User(Base):
  __tablename__ = 'users'
  u_id = Column(Integer, primary_key=True)
  username = Column(String, nullable=False)
  password = Column(String, nullable=False)

  def __repr__(self):
    return "<User(user_id='{}', username='{}', password='{}')>"\
            .format(self.u_id, self.username, self.password)


class Question(Base):
  __tablename__ = 'questions'
  q_id = Column(Integer, primary_key=True)
  game_type = Column(String, nullable=False)
  qInfo_1 = Column(String, nullable=False)
  qInfo_2 = Column(String, nullable=True)
  qInfo_3 = Column(String, nullable=True)
  answer = Column(String, nullable=False)
  choiceA = Column(String, nullable=False)
  choiceB = Column(String, nullable=False)
  choiceC = Column(String, nullable=False)
  choiceD = Column(String, nullable=True)
  example = Column(String, nullable=True)

  def __repr__(self):
    qInfo = [self.qInfo_1, self.qInfo_2, self.qInfo_3]
    question = " ".join([word for word in qInfo if word != None])
    return "<Question(quesion_id='{}', question='{}', answer= '{}')>"\
            .format(self.q_id, question, self.answer)


class Record(Base):
  __tablename__ = 'gradebook'
  r_id = Column(Integer, primary_key=True)
  ru_id = Column(Integer, nullable=False)
  rq_id = Column(Integer, nullable=False)
  attempts = Column(Integer, nullable=False)
  correct = Column(Integer, nullable=False)

  def __repr__(self):
    percentage = "{:.2%}".format(self.correct/self.attempts)
    return "<Record(record_id='{}', r_userId='{}', r_questionId='{}', grade={})>"\
            .format(self.r_id, self.ru_id, self.rq_id, percentage)