#!database.py
import psycopg2

def sql_select(query):
    conn = psycopg2.connect("dbname=my_blog user = clckwrk")
    cur = conn.cursor()
    cur.execute(query)
    results = cur.fetchall()
    cur.close()
    conn.close()
    return results

def sql_write_comment(query , params):
    conn = psycopg2.connect("dbname=my_blog user = clckwrk")
    cur = conn.cursor()
    cur.execute(query , params)
    conn.commit()
    cur.close()
    conn.close()


def sign_up(query , params):
    conn = psycopg2.connect("dbname=my_blog user = clckwrk")
    cur = conn.cursor()
    cur.execute(query , params)
    conn.commit()
    cur.close()
    conn.close()

def login(query , params):
    conn = psycopg2.connect("dbname=my_blog user = clckwrk")
    cur = conn.cursor()
    cur.execute(query , params)
    results = cur.fetchall()
    cur.close()
    conn.close()
    return results