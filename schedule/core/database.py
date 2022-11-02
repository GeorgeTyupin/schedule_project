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
         event_id_list = []
         events = []
         sql = f"SELECT * FROM events WHERE author_id = {author_id}"
         result = cur.execute(sql).fetchall()
         for event in result:
            event_id_list.append(str(event[0]))
         event_categories = self.loadCategoryAndEvent(event_id_list)
         for event in result:
            event = list(event)
            if event[0] in event_categories.keys():
               event.append(event_categories[event[0]])
            events.append(event)
         return events
   
   def loadUsersTable(self, login):
      with sqlite3.connect(DATA_DST) as cur:
         sql = f"SELECT * FROM users WHERE user_name = '{login}' "
         result = cur.execute(sql).fetchone()
         print(result)
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
            SET name = '{data['changed_name']}'
            WHERE event_id = {data['event_id']} """
         cur.execute(sql)
         cur.commit()
   
   def deleteEvents(self, event_id):
      with sqlite3.connect(DATA_DST) as cur:
         sql = f"""DELETE FROM events WHERE event_id = {event_id}"""
         cur.execute(sql)
         cur.commit()

   def createCategory(self, category_name, user_id):
      with sqlite3.connect(DATA_DST) as cur:
         sql = f"""INSERT INTO categories ('user_id' , 'name') 
            VALUES ('{user_id}','{category_name}')"""
         cur.execute(sql)
         cur.commit()

   def loadCategoryTable(self, user_id):
      with sqlite3.connect(DATA_DST) as cur:
         sql = f"SELECT * FROM categories WHERE user_id = '{user_id}' "
         result = cur.execute(sql).fetchall()
         return result
   
   def createCategoryAndEvent(self, event_id, category_id):
      with sqlite3.connect(DATA_DST) as cur:
         sql1 = f"SELECT * FROM categories_and_events WHERE event_id = '{event_id}' AND category_id='{category_id}'"
         result = cur.execute(sql1).fetchall()
         if len(result) == 0:
            sql2 = f"""INSERT INTO categories_and_events ('event_id' , 'category_id') 
               VALUES ('{event_id}','{category_id}')"""
            cur.execute(sql2)
            cur.commit()
   
   def resemblanceСheckCategoryAndEvent(self, event_id, category_ids):
      with sqlite3.connect(DATA_DST) as cur:
         sql1 = f"SELECT * FROM categories_and_events WHERE event_id = '{event_id}'"
         result = cur.execute(sql1).fetchall()
         if len(category_ids) != len(result):
            for i in range(len(result)):
                  if not str(result[i][2]) in category_ids:
                     sql2 = f"""DELETE FROM categories_and_events WHERE id = {result[i][0]}"""
                     cur.execute(sql2)
                     cur.commit()

   def loadCategoryAndEvent(self, event_id_list):
      with sqlite3.connect(DATA_DST) as cur:
         event_categories = {}
         sql = f"SELECT ce.*,c.name FROM categories_and_events ce LEFT JOIN categories c ON c.id = ce.category_id WHERE ce.event_id in ({','.join(event_id_list)}) "
         result = cur.execute(sql).fetchall()
         for i in result:
            key = i[1]
            if key not in event_categories:
               event_categories[key] = []
            event_categories[key].append(i)
         return event_categories
