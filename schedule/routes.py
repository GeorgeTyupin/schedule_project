from flask import Flask , render_template , make_response , request , session , redirect
from . import core
from schedule.app import app
import json

db = core.database.Database()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        if session:
            return render_template('adminlk.html')
        else:
            return render_template('auth.html')
    else:
        data = {}
        data['event_name'] = request.form.get('event_name')
        data['event_day'] = request.form.get('event_day')
        data['event-description'] = request.form.get('event-description')
        print(data)
        db.addEvent(data, session['id'])
        return ''

@app.route('/auth', methods=['GET', 'POST'])
def auth():
    if request.method == 'GET':
        return render_template('auth.html')
    else:
        login = request.form.get('user_name')
        password = request.form.get('user_password')
        result = db.loadUsersTable(login)
        if (result and result[2] == password):
            session['id'] = result[0]
            session['login'] = result[1]
            session['email'] = result[3]
            session['auth'] = True
            response = make_response(redirect(f"/"))
            return response
        else:
            return render_template('auth.html')

@app.route('/reg', methods=['GET', 'POST'])
def reg():
    if request.method == 'GET':
        return render_template('reg.html')
    else:
        login = request.form.get('user_name')
        email = request.form.get('user_email')
        password = request.form.get('user_password')
        result = db.loadUsersTable(login)
        if result:
            return "Такой пользователь уже существует"
        db.addUser(login, password, email)
        result = db.loadUsersTable(login)
        session['id'] = result[0]
        session['login'] = login
        session['email'] = result[3]
        session['auth'] = True
        response = make_response(redirect("/"))
        return response

@app.route("/getdata", methods=['GET', 'POST'])
def getdata():
    return json.dumps(db.loadEventsTable(session['id']))