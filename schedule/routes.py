from flask import Flask , render_template , make_response , request , session , redirect
from . import core
from schedule.app import app


@app.route('/')
def index():
    return render_template('adminlk.html')
