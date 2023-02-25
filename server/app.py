from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
import requests
from config import ApplicationConfig
from models import db, Task
from dotenv import load_dotenv
import os

load_dotenv()

API_ENDPOINT = 'https://discord.com/api'
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = '' # redirect uri for your website

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

cors = CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)


with app.app_context():
    db.create_all()


@app.route("/auth")
def auth():
    code = request.args.get('code')
    if not code:
        return
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    r = requests.post(API_ENDPOINT + '/oauth2/token',
                      data=data, headers=headers)
    r.raise_for_status
    res = r.json()
    if "access_token" in res.keys():
        session["access_token"] = res['access_token']
        session["refresh_token"] = res['refresh_token']
        return jsonify("Logged in")
    return jsonify({'error': "Unauthorized"}), 401


@app.route("/logout")
def logout():
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'token': session.get('access_token')
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    r = requests.post(API_ENDPOINT + '/oauth2/token/revoke',
                      data=data, headers=headers)
    r.raise_for_status
    session.clear()
    return jsonify("logged out"), 200


def get_user_from_discord(access_token):
    headers = {
        'authorization': 'Bearer ' + access_token
    }
    r = requests.get(API_ENDPOINT + '/users/@me', headers=headers)
    r.raise_for_status
    if r.status_code == 401:
        refresh_token(session.get('refresh_token'))
        return get_user_from_discord(session.get('access_token'))
    res = r.json()
    session['user_id'] = res['id']
    return res


def refresh_token(refresh_token):
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    r = requests.post('%s/oauth2/token' %
                      API_ENDPOINT, data=data, headers=headers)
    r.raise_for_status()
    res = r.json()
    session["access_token"] = res['access_token']
    session["refresh_token"] = res['refresh_token']
    return


@app.route("/@me")
def get_current_user():
    access_token = session.get('access_token')
    if not access_token:
        return jsonify({'error': "Unauthorized"}), 401
    return get_user_from_discord(access_token)


@app.route("/@me/tasks")
def get_tasks():
    user_id = session.get('user_id')
    if not user_id:
        access_token = session.get('access_token')
        if not access_token:
            return jsonify({'error': "Unauthorized"}), 401
        get_user_from_discord(access_token)
        user_id = session.get('user_id')

    tasks = Task.query.filter(Task.user_id == user_id).all()
    tsk = []
    for task in tasks:
        t = {
            'id': task.id,
            'task': task.task
        }
        tsk.append(t)
    return jsonify(tsk)


@app.route("/@me/task", methods=["POST", "DELETE"])
def add_delete_task():
    user_id = session.get('user_id')
    if not user_id:
        access_token = session.get('access_token')
        if not access_token:
            return jsonify({'error': "Unauthorized"}), 401
        get_user_from_discord(access_token)
        user_id = session.get('user_id')

    if request.method == 'POST':
        task = request.get_json()['task']
        new_task = Task(user_id=user_id, task=task)
        db.session.add(new_task)
        db.session.commit()

    elif request.method == 'DELETE':
        id = request.get_json()['id']
        task = Task.query.filter_by(id=id).first()
        db.session.delete(task)
        db.session.commit()

    tasks = Task.query.filter(Task.user_id == user_id).all()
    tsk = []
    for task in tasks:
        t = {
            'id': task.id,
            'task': task.task
        }
        tsk.append(t)
    return jsonify(tsk)


if __name__ == "__main__":
    # app.run(debug=True)
    app.run(threaded=True, port=5000)
