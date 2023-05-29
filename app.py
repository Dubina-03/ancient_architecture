from flask import Flask, render_template, jsonify, request, abort, redirect, url_for, make_response
from flask_login import LoginManager, UserMixin
import uuid
import json

app = Flask(__name__)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def current_user():
    user_id = request.cookies.get('user_id')
    current_user = False
    if user_id:
        # Retrieve user information using the user ID (assuming you have a user database or data source)
        with open('users.json', 'r') as json_file:
            users = json.load(json_file)
            
            # Print the loaded users for verification
            print("Loaded users:", users)
            
            for user in users:
                if str(user['id']) == user_id:
                    current_user = True
                    break
    return current_user

# Assuming your user data is stored in a 'users.json' file
USERS_FILE_PATH = 'users.json'

class User(UserMixin):
    def __init__(self, user_id, username, password):
        self.id = user_id
        self.username = username
        self.password = password

@login_manager.user_loader
def load_user(user_id):
    with open(USERS_FILE_PATH, 'r') as file:
        users = json.load(file)

        for user in users:
            if user['id'] == user_id:
                return User(user['id'], user['username'], user['password'])

    return None  # Return None if user not found

def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/page1')
def page1():
    return render_template('page1.html')

@app.route('/page2')
def page2():
    return render_template('page2.html')

@app.route('/page3')
def page3():
    return render_template('page3.html')

@app.route('/account')
def account():
    # Retrieve the user ID from the cookie
    user_id = request.cookies.get('user_id')
    
    if user_id:
        # Retrieve user information using the user ID (assuming you have a user database or data source)
        with open('users.json', 'r') as json_file:
            users = json.load(json_file)
            
            # Print the loaded users for verification
            print("Loaded users:", users)
            
            for user in users:
                if str(user['id']) == user_id:
                    # User found, pass user information to the template
                    print("User found:", user)  # Add a print statement to check the user information
                    return render_template('account.html', user=user)

        # If user ID is not found or user does not exist, redirect to the login page
        print("User not found")
        return redirect(url_for('login'))
    else:
        # User ID cookie is not present, redirect to the login page
        print("No user ID in cookie")
        return redirect(url_for('login'))

@app.route('/articles')
def get_articles():
    json_file_path = 'articles.json'
    articles = read_json_file(json_file_path)
    return jsonify(articles)

@app.route('/articles_page2')
def get_articles_page2():
    json_file_path = 'articles_page2.json'
    articles = read_json_file(json_file_path)
    return jsonify(articles)

@app.route('/excursions')
def get_excursions():
    with open('excursions.json', 'r') as f:
        excursions = json.load(f)
    return jsonify(excursions)

@app.route('/log_in', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']

        with open('users.json', 'r') as json_file:
            users = json.load(json_file)
            for user in users:
                if user['username'] == username and user['password'] == password:
                    user_id = user['id']
                    response = make_response(jsonify({'success': True, 'message': 'Login successful.'}))
                    response.set_cookie('user_id', str(user_id))  # Set the user ID as a cookie
                    next_page = request.args.get('next')
                    if next_page and next_page.endswith('/page3'):
                        return redirect(url_for('page3'))
                    return response
        
        return jsonify({'success': False, 'message': 'Invalid username or password.'})
    else:
        # Handle GET request for login page
        referrer = request.referrer
        if referrer and referrer.endswith('/page3'):
            return render_template('log_in.html', referrer=referrer)
        return render_template('log_in.html')

@app.route('/log_out')
def logout():
    response = make_response(redirect(url_for('index')))
    response.delete_cookie('user_id')
    return response

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']

        users = []  # Initialize an empty list for users

        try:
            with open('users.json', 'r') as json_file:
                users = json.load(json_file)
        except FileNotFoundError:
            pass  # Ignore the error if the file doesn't exist (empty file)

        for user in users:
            if user['username'] == username:
                return jsonify({'success': False, 'message': 'Username already exists.'})

        user_id = str(uuid.uuid4())  # Generate a unique user ID

        new_user = {'id': user_id, 'username': username, 'password': password, 'liked_excursions': []}
        users.append(new_user)

        with open('users.json', 'w') as json_file:
            json.dump(users, json_file)

        return jsonify({'success': True, 'message': 'Registration successful.'})
    else:
        # Handle GET request for registration page
        return render_template('register.html')
    
@app.route('/<int:excursion_id>')
def excursion(excursion_id):
    with open('excursions.json') as f:
        excursions_data = json.load(f)

    # Check if excursion_id is out of range
    if excursion_id < 0 or excursion_id >= len(excursions_data):
        return 'Excursion not found'

    excursion = excursions_data[excursion_id]
    return render_template('excursion.html', excursion=excursion)

@app.route('/comments', methods=['GET'])
def get_comments():
    user_id = request.cookies.get('user_id')
    with open('excursions.json', 'r') as file:
        excursions = json.load(file)

    user_comments = []
    for excursion in excursions:
        user_excursion_comments = []
        comments = excursion.get('comments', [])
        for comment in comments:
            if comment["user_id"] == user_id:
                user_excursion_comments.append(comment)
        if user_excursion_comments:
            user_comments.append({"id": excursion["id"], "comments": user_excursion_comments})

    return jsonify(user_comments)


@app.route('/<int:excursion_id>/comment', methods=['POST'])
def submit_comment(excursion_id):
    if not current_user():
        return jsonify({'success': False, 'message': 'User not authenticated.'})

    user_id = request.cookies.get('user_id')
    comment = request.json.get('comment')  # Use request.json to retrieve the comment from the request body

    with open('excursions.json', 'r') as file:
        excursions = json.load(file)

    for excursion in excursions:
        if excursion['id'] == excursion_id:
            if 'comments' not in excursion:
                excursion['comments'] = []  # Add an empty comments list if it doesn't exist
            
            if comment:
                excursion['comments'].append({"user_id": user_id, "comment": comment})  # Add the comment to the excursion's comments list
                break

    with open('excursions.json', 'w') as file:
        json.dump(excursions, file, indent=2)  # Write the modified excursion data back to the file

    return jsonify({'success': True, 'comment': comment})

@app.route('/like_excursion', methods=['POST'])
def like_excursion():
    if not current_user():
        return jsonify({'success': False, 'message': 'User not authenticated.'})

    try:
        excursion_id = request.json['excursionId']
    except KeyError:
        return jsonify({'success': False, 'message': 'Excursion ID not provided.'})

    with open('users.json', 'r') as json_file:
            users = json.load(json_file)

    user_id = request.cookies.get('user_id')
    for user in users:
        if str(user['id']) == user_id and  excursion_id not in user['liked_excursions']:
            # User found, update liked_excursions field
            user['liked_excursions'].append(int(excursion_id))
            break
    
    with open('users.json', 'w') as file:
        json.dump(users, file, indent=2)
 
    return jsonify({'success': True})

@app.route('/like_excursion', methods=['GET'])
def get_liked_excursions():
    with open('users.json', 'r') as json_file:
        users = json.load(json_file)
    user_id = request.cookies.get('user_id')

    with open('excursions.json', 'r') as file:
        excursions = json.load(file)

    for user in users:
        if str(user['id']) == user_id:
            liked_excursions = [excursion for excursion in excursions if excursion["id"] in user["liked_excursions"]]
            break
    
    return jsonify({'success': True, 'containers': liked_excursions})

if __name__ == '__main__':
    app.secret_key = 'supersecretkey'
    app.run(debug=True)