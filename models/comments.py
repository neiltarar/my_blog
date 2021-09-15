#!comments.py
import psycopg2 as data
from database import sql_select , sql_write_comment

def read_comment():
    results = sql_select("SELECT comment FROM comments")
    all_comments = []
    for i in results:
       all_comments.append(i[0])
    return all_comments

# Member variable is a boolean
def write_comment(user_id , comment, member):
    sql_write_comment("INSERT INTO comments ( user_id, comment) VALUES (%s, %s)",  [user_id , comment])
    
