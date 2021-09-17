#!signup_login.py

from logging import log
import psycopg2 as data
from database import login, sql_write

def signup_new_user(email, username , password_hash):
    sql_write("INSERT INTO users (email, username, password_hash) VALUES (%s , %s, %s)",
    [email, username, password_hash]) 

def login_check(email):
    results = login("SELECT * FROM users WHERE email= %s" , [email])
    return results