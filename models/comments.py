#!comments.py
import psycopg2 as data
from database import sql_select , sql_write_comment

def read_comment():
    results = sql_select("SELECT username, comment FROM users INNER JOIN comments ON users.id = comments.user_id;")
    print(results)
    user_name = []
    all_comments = []
    for i in results:
       all_comments.append(i)
    print(all_comments)
    return all_comments

# Member variable is a boolean
def write_comment(user_id , comment):
    sql_write_comment("INSERT INTO comments ( user_id, comment) VALUES (%s, %s)",  [user_id , comment])
    
# def edit_comment(user_id , comment):
#     sql_edit_comment("")
