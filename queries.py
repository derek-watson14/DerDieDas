from config import DATABASE_URI
# from models import Record
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from contextlib import contextmanager
from werkzeug.security import generate_password_hash


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


# app.py operations (adding users, loading questions, updating gradebook)


# User Registrations and Logins:
def register_user(username, password):
    if not search_users(username):
        db.execute('INSERT INTO users (username, password) '
                   'VALUES (:username, :password)',
                   {"username": username,
                    "password": generate_password_hash(password,
                                                       method='pbkdf2:sha256',
                                                       salt_length=4)})
        db.commit()
        return search_users(username)
    else:
        return None


def search_users(username):
    return db.execute('SELECT * '
                      'FROM users '
                      'WHERE username = :username',
                      {"username": username}).fetchone()


# Altering Table Questions:
def get_questions(gametype, set_size=None):
    if set_size is None:
        return db.execute('SELECT * '
                          'FROM questions '
                          'WHERE gametype = :gametype',
                          {"gametype": gametype}).fetchall()
    else:
        return db.execute('SELECT * '
                          'FROM questions '
                          'WHERE gametype = :gametype',
                          {"gametype": gametype}).fetchmany(set_size)


# Altering Table Gradebook:
def update_gradebook(ru_id, rq_id, correct):
    r_id = db.execute('SELECT r_id '
                      'FROM gradebook '
                      'WHERE ru_id = :ru_id '
                      'AND rq_id = :rq_id',
                      {"ru_id": ru_id, "rq_id": rq_id}).fetchone()
    if r_id:
        update_exsisting(r_id[0], correct)
    else:
        new_user_record(ru_id, rq_id, correct)


# Needs to be rewritten as insert into
def new_user_record(ru_id, rq_id, correct):
    db.execute('INSERT INTO gradebook (ru_id, rq_id, correct, attempts)'
               'VALUES (:ru_id, :rq_id, :correct, :attempts)',
               {"ru_id": ru_id, "rq_id": rq_id,
                "correct": correct, "attempts": 1})
    db.commit()


def update_exsisting(r_id, correct):
    db.execute(f'UPDATE gradebook '
               'SET attempts = attempts + 1, correct = correct + :correct '
               'WHERE r_id = :r_id',
               {"correct": correct, "r_id": r_id})
    db.commit()


def grades_for(ru_id):
    grades = db.execute('SELECT * '
                        'FROM gradebook '
                        'WHERE ru_id = :ru_id',
                        {"ru_id": ru_id}).fetchall()
    return grades


def profile_table(ru_id):
    grades = db.execute('SELECT gradebook.correct, gradebook.attempts, '
                        'questions.q_id, questions.gametype, '
                        'questions.qinfo_1, questions.qinfo_2, '
                        'questions.qinfo_3, questions.answer '

                        'FROM gradebook '
                        'INNER JOIN questions '
                        'ON questions.q_id = gradebook.rq_id '
                        'WHERE ru_id = :ru_id',
                        {"ru_id": ru_id}).fetchall()
    return grades


# Changing database ojects to a JSON understandable format
def serialize_grades(item):
    return {
        'correct': int(item.correct),
        'attempts': int(item.attempts),
        'q_id': int(item.q_id),
        'gametype': item.gametype,
        'qinfo_1': item.qinfo_1,
        'qinfo_2': item.qinfo_2,
        'qinfo_3': item.qinfo_3,
        'answer': item.answer
    }


def serialize_question(item):
    return {
        'q_id': int(item.q_id),
        'qinfo_1': item.qinfo_1,
        'qinfo_2': item.qinfo_2,
        'qinfo_3': item.qinfo_3,
        'answer': item.answer,
        'choice_a': item.choice_a,
        'choice_b': item.choice_b,
        'choice_c': item.choice_c,
        'choice_d': item.choice_d,
        'example': item.example,
    }


def serialize_record(item):
    return {
        'r_id': int(item.r_id),
        'ru_id': int(item.ru_id),
        'rq_id': int(item.rq_id),
        'correct': int(item.correct),
        'attempts': int(item.attempts)
    }
