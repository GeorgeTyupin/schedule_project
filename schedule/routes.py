from flask import Flask , render_template , make_response , request , session , redirect
from . import core
from schedule.application import application
import json

db = core.database.Database()

@application.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        if session:
            return render_template('adminlk.html')
        else:
            return render_template('auth.html')
    else:
        data = {}
        data['event_name'] = request.form.get('event_name')
        data['event_date'] = request.form.get('event_date')
        data['event-description'] = request.form.get('event-description')
        # print(data)
        db.addEvent(data, session['id'])
        return ''

@application.route('/auth', methods=['GET', 'POST'])
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
            return 'Неправильный логин или пароль'

@application.route('/reg', methods=['GET', 'POST'])
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
        response = make_response(redirect(f"/"))
        return response

@application.route("/get_data", methods=['GET', 'POST'])
def get_data():
    return json.dumps(db.loadEventsTable(session['id']))

@application.route("/exit", methods=['GET', 'POST'])
def exit():
    session = {}
    return ''

@application.route("/changing_events", methods=['POST'])
def changing_events():
    data = {}
    data['event_id'] = request.form.get('event_id')
    data['changed_name'] = request.form.get('changed_name')
    data['changed_description'] = request.form.get('changed_description')
    db.updateEvents(data)
    return '1'

@application.route("/delete_event", methods=['GET', 'POST'])
def delete_event():
    event_id = request.form.get('event_id')
    # print(event_id)
    # print(type(event_id))
    db.deleteEvents(event_id, session['id'])
    return event_id

@application.route("/create_category", methods=['GET', 'POST'])
def create_category():
    category_name = request.form.get('category_name')
    print(category_name)
    db.createCategory(category_name, session['id'])
    return ''

@application.route("/get_categories", methods=['GET', 'POST'])
def get_categories():
    return json.dumps(db.loadCategoryTable(session['id']))

@application.route("/create_categories_and_events", methods=['GET', 'POST'])
def create_categories_and_events():
    event_id = request.form.get('event_id')
    category_ids = request.form.getlist('category_ids[]')
    if category_ids:
        for category_id in category_ids:
            db.createCategoryAndEvent(event_id, category_id)
        db.resemblanceСheckCategoryAndEvent(event_id, category_ids)
    return ''

@application.route("/delete_category", methods=['GET', 'POST'])
def delete_category():
    category_id = request.form.get('category_id')
    db.deleteCategory(category_id)
    return category_id

@application.route("/save_code", methods=['GET', 'POST'])
def save_code():
    code = request.form.get('code')
    # print(code)
    db.saveCode(code, session['id'])
    return  ''

@application.route("/save_code_to_event", methods=['GET', 'POST'])
def save_code_to_event():
    code = request.form.get('code')
    event_id = request.form.get('event_id')
    result = db.loadCodesTable(code)
    if not result:
        return 'Данного кода не существует'
    db.saveCodeToEvent(code, event_id)
    return  ''