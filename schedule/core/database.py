import email
from . import DATA_DST
import sqlite3
import time

class Database():
   def __init__(self):
      print('init database')

   def insert(self, table_name, data):
      columns = "' , '".join(data.keys())
      values = "' , '".join(data.values())
      sql =  f"""INSERT INTO {table_name} ('{columns}') 
         VALUES ('{values}')"""
      return sql

   def addEvent(self, data, author_id):
      with sqlite3.connect(DATA_DST) as cur:
         values = {
            'name' : data['event_name'],
            'author_id' : str(author_id),
            'date' : data['event_day'],
            'time' : str(time.time()),
            'description' : data['event-description']
         }
         cur.execute(self.insert('events', values))
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

   def updateEvents(self, data):
      with sqlite3.connect(DATA_DST) as cur:
         sql = f"""UPDATE events 
            SET name = '{data['new_name']}'
            WHERE id = '{data['event_id']}' """
         cur.execute(sql)
         cur.commit()
   
   def deleteEvents(self, event_id):
      with sqlite3.connect(DATA_DST) as cur:
         sql = f"""DELETE FROM event WHERE id = {event_id}"""
         cur.execute(sql)
         cur.commit()