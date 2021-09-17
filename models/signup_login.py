#!signup_login.py

from logging import log
import psycopg2 as data
from database import sql_check, sql_write , sql_select

def signup_new_user(email, username , password_hash):
    sql_write("INSERT INTO users (email, username, password_hash) VALUES (%s , %s, %s)",
    [email, username, password_hash]) 

def login_check(email):
    results = sql_select("SELECT * FROM users WHERE email= %s" , [email])
    return results

########################### GAME SCORES #########################################

def score_save(score, user_id):
    sql_write("UPDATE users SET score = %s WHERE id = %s;", [score, user_id])

def get_score():
    result = sql_check("SELECT score, username FROM users ORDER BY score DESC LIMIT 1;")
    return result