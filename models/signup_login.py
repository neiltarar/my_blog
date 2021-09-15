#!signup_login.py

from logging import log
import psycopg2 as data
from database import sign_up, login

def signup_new_user(email, username , password_hash):
    sign_up("INSERT INTO users (email, username, password_hash) VALUES (%s , %s, %s)",
    [email, username, password_hash]) 

def login_check(email):
    results = login("SELECT * FROM users WHERE email= %s" , [email])
    return results