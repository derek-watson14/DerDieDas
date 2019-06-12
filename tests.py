from game_data import (prepKey, prepSet, articleKey, a_types, a_genders,
                       a_cases, def_articles, indef_articles, articleSet,
                       endingKey, endingSet, genderKey, genderSet)
from models import Question, Base
from random import randint, shuffle
from queries import (engine, session_scope, register_user, update_gradebook,
                     get_questions, profile_table, search_users, grades_for)


# Reset Database
def recreate_database():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)


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
        pa = artList[randint(0, 5)]
        if pa not in ansList:
            ansList.append(pa)
    return ansList


def load_list(the_list):
    with session_scope() as s:
        for item in the_list:
            s.add(item)


def test_all_sql():
    foo = get_questions("preps")
    print(type(foo))

    register_user("derek2", "pppoo")
    register_user("anni5", "dogs")
    print(search_users("derek2")["u_id"])

    update_gradebook(1, 100, 1)  # new_user_record(ru_id, rq_id, correct)
    update_gradebook(1, 100, 0)  # update_exsisting(r_id, correct)
    update_gradebook(2, 100, 0)
    update_gradebook(1, 100, 1)
    print(grades_for(1)[0]["rq_id"])
    print(profile_table(1)[0]["qinfo_1"])


def add_all_questions():
    add_gender_qs()
    add_prep_qs()
    add_ending_qs()
    add_article_qs()


if __name__ == '__main__':
    if input("Recreate database? y/n: ") == "y":
        recreate_database()
        add_all_questions()
    test_all_sql()
