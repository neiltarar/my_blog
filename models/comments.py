#!comments.py
import psycopg2 as data
from database import sql_select , sql_write_comment

def read_comment():
    results = sql_select("SELECT comments FROM comments")
    return results

# Member variable is a boolean
def write_comment(user_id , comment, member):
    sql_write_comment("INSERT INTO comments ( user_id, comment) VALUES (%s, %s)",  [user_id , comment])
    
