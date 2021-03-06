#!comments.py

from database import sql_select , sql_write

def read_comment(url):
    results = sql_select("""SELECT comments.id ,  comment ,  username , date FROM comments 
                            INNER JOIN users ON users.id = comments.user_id 
                            WHERE comments.post= %s 
                            ORDER BY id DESC;""" , [url])
    all_comments = []
    for i in results:
       all_comments.append(i)
    return all_comments

# Member variable is a boolean
def write_comment(user_id , comment , post, date):
    sql_write("INSERT INTO comments ( user_id, comment, post, date) VALUES (%s, %s, %s, %s)",  [user_id , comment, post, date])
    
def edit_comment(user_id, comment_id, comment, date):
    sql_write("UPDATE comments SET comment = %s, date =%s WHERE comments.id = %s AND user_id= %s;" , [comment , date ,comment_id , user_id])

def delete_comment(comment_id):
    sql_write("DELETE FROM comments WHERE id = %s" , [comment_id])