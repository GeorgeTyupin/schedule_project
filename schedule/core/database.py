import email
from . import DATA_DST
import sqlite3
import time

class Database():
   def __init__(self):
      print('init database')

   # def insert(self, table_name, data):
   #    return f"""INSERT INTO {table_name} ({data['columns']}) 
   #       VALUES ('{data["values"]}')"""

   def addEvent(self, data, author_id):
      with sqlite3.connect(DATA_DST) as cur:
         # values = {}
         sql = f"""INSERT INTO events ('name' , 'author_id', 'date', 'time', 'description') 
            VALUES ('{data['event_name']}','{author_id}','{data['event_day']}','{time.time()}','{data['event-description']}')"""
         # values['columns'] = 'name' , 'author_id', 'date', 'time', 'description'
         # values["values"] = f"{data['event_name']}','{author_id}','{data['event_day']}','{time.time()}','{data['event-description']}"
         # event = self.insert('events', values)
         # cur.execute(event)
         cur.execute(sql)
         cur.commit()

   def loadEventsTable(self, author_id):
      with sqlite3.connect(DATA_DST) as cur:
         sql = f"SELECT * FROM events WHERE author_id = {author_id}"
         result = cur.execute(sql).fetchall()
         return result
   
   def loadUsersTable(self, login):
      with sqlite3.connect(DATA_DST) as cur:
         sql = f"SELECT * FROM users WHERE user_name = '{login}' "
         result = cur.execute(sql).fetchone()
         return result
   
   def addUser(self, login, password, email):
      with sqlite3.connect(DATA_DST) as cur:
         sql = f"""INSERT INTO users ('user_name' , 'password', 'email') 
            VALUES ('{login}','{password}','{email}')"""
         cur.execute(sql)
         cur.commit()
    