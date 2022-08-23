from . import DATA_DST
import sqlite3
import time

class Database():
   def __init__(self):
      print('init database')

   def addEvent(self, data):
      with sqlite3.connect(DATA_DST) as cur:
            sql = f"""INSERT INTO events ('name' , 'author_id', 'date', 'time', 'description') 
               VALUES ('{data['event_name']}','1','{data['event_day']}','{time.time()}','{data['event-description']}')"""
            cur.execute(sql)
            cur.commit()

   def loadEventsTable(self):
        with sqlite3.connect(DATA_DST) as cur:
            sql = f"SELECT * FROM events"
            result = cur.execute(sql).fetchall()
            return result
    