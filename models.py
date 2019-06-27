from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (Column, Integer, String, ForeignKey, UniqueConstraint, 
                        DateTime)
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    u_id = Column(Integer, primary_key=True)
    reg_date = Column(DateTime(timezone=False), server_default=func.now())
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)

    def __repr__(self):
        return "<User(user_id='{}', username='{}', password='{}')>"\
                .format(self.u_id, self.username, self.password)


class Question(Base):
    __tablename__ = 'questions'
    q_id = Column(Integer, primary_key=True)
    gametype = Column(String, nullable=False)
    qinfo_1 = Column(String, nullable=False)
    qinfo_2 = Column(String, nullable=True)
    qinfo_3 = Column(String, nullable=True)
    answer = Column(String, nullable=False)
    choice_a = Column(String, nullable=False)
    choice_b = Column(String, nullable=False)
    choice_c = Column(String, nullable=False)
    choice_d = Column(String, nullable=True)
    example = Column(String, nullable=True)

    def __repr__(self):
        qinfo = [self.qinfo_1, self.qinfo_2, self.qinfo_3]
        question = " ".join([word for word in qinfo if word is None])
        return "<Question(quesion_id='{}', question='{}', answer= '{}')>"\
               .format(self.q_id, question, self.answer)


class Record(Base):
    __tablename__ = 'gradebook'
    __table_args__ = (UniqueConstraint('ru_id', 'rq_id',
                                       name='_record_uniqueness'), )
    r_id = Column(Integer, primary_key=True)
    ru_id = Column(Integer, ForeignKey("users.u_id"), nullable=False)
    rq_id = Column(Integer, ForeignKey("questions.q_id"), nullable=False)
    correct = Column(Integer, nullable=False)
    attempts = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)

    def __repr__(self):
        percentage = "{:.2%}".format(self.correct/self.attempts)
        return """<Record(record_id='{}', r_userId='{}',
                          r_questionId='{}', grade={})>"""\
               .format(self.r_id, self.ru_id, self.rq_id, percentage)
