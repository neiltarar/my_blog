#!signup_login.py
from database import sql_check, sql_write , sql_select

def signup_new_user(email, username , password_hash):
    sql_write("INSERT INTO users (email, username, password_hash, score) VALUES (%s , %s, %s, %s)",
    [email, username, password_hash, 0]) 

def login_check(email):
    results = sql_select("SELECT * FROM users WHERE email= %s" , [email])
    return results

########################### GAME SCORES #########################################

def score_save(score, user_id):
    sql_write("UPDATE users SET score = %s WHERE id = %s;", [score, user_id])

def get_score():
    result = sql_check("SELECT score, username FROM users ORDER BY score DESC LIMIT 1;")
    return result

def get_user_score(user_id):
    result = sql_select("SELECT score, username FROM users WHERE id= %s;" , [user_id])
    return result
