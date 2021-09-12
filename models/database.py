#!database.py
import psycopg2 as data
import bcrypt

def read_data():
    conn = data.connect("dbname= users user=clckwrk")
    cur = conn.cursor()
    cur.execute("SELECT * FROM users;")
    result = cur.fetchall()
    cur.close()
    conn.close()
    return result

def write_data():
    conn = data.connect("dbname= users user=clckwrk")
    cur = conn.cursor()
    cur.execute("SELECT * FROM users;")

print(read_data())