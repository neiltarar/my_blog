#!database.py
import psycopg2

def sql_select(query, params):
    conn = psycopg2.connect("dbname=my_blog user = server")
    cur = conn.cursor()
    cur.execute(query, params)
    results = cur.fetchall()
    cur.close()
    conn.close()
    return results

def sql_write(query , params):
    conn = psycopg2.connect("dbname=my_blog user = server")
    cur = conn.cursor()
    cur.execute(query , params)
    conn.commit()
    cur.close()
    conn.close()

def sql_check(query):
    conn = psycopg2.connect("dbname=my_blog user = server")
    cur = conn.cursor()
    cur.execute(query)
    results = cur.fetchall()
    cur.close()
    conn.close()
    return results