from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

# Store todos in memory (you can later upgrade to a database)
todos = {
    'personal': [],
    'work': [],
    'shopping': []
}

@app.route('/')
def index():
    return render_template('index.html', todos=todos)

@app.route('/api/todos', methods=['GET'])
def get_todos():
    return jsonify(todos)

@app.route('/api/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    category = data.get('category')
    task = data.get('task')
    
    if category and task:
        todos[category].append(task)
        return jsonify({'success': True})
    return jsonify({'success': False})

@app.route('/api/todos', methods=['DELETE'])
def delete_todo():
    data = request.get_json()
    category = data.get('category')
    task = data.get('task')
    
    if category and task and task in todos[category]:
        todos[category].remove(task)
        return jsonify({'success': True})
    return jsonify({'success': False})

if __name__ == '__main__':
    app.run(debug=True) 