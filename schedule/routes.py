from flask import Flask , render_template , make_response , request , session , redirect
from . import core
from schedule.app import app
import json

db = core.database.Database()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template('adminlk.html')
    else:
        data = {}
        data['event_name'] = request.form.get('event_name')
        data['event_day'] = request.form.get('event_day')
        data['event-description'] = request.form.get('event-description')
        print(data)
        db.addEvent(data)
        return ''

@app.route("/getdata", methods=['GET', 'POST'])
def getdata():
    return json.dumps(db.loadEventsTable())