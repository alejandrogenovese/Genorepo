#!/usr/bin/env python3
"""
AWS Quiz App - Servidor Flask para Raspberry Pi
Soporta preguntas con respuestas únicas y múltiples
"""

from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import random
import os
from datetime import datetime
import socket

app = Flask(__name__, static_folder='static')
CORS(app)

# Cargar preguntas
QUESTIONS_FILE = 'static/questions.json'

def load_questions():
    """Carga las preguntas desde el archivo JSON"""
    if os.path.exists(QUESTIONS_FILE):
        with open(QUESTIONS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

# Cargar preguntas al inicio
QUESTIONS = load_questions()

# Estadísticas globales
global_stats = {
    "total_sessions": 0,
    "total_questions_answered": 0,
    "total_correct": 0,
    "users": {}
}

@app.route('/')
def index():
    """Página principal con estadísticas"""
    hostname = socket.gethostname()
    accuracy = 0
    if global_stats['total_questions_answered'] > 0:
        accuracy = round((global_stats['total_correct'] / global_stats['total_questions_answered']) * 100, 1)
    
    return render_template(
        'index.html',
        hostname=hostname,
        question_count=len(QUESTIONS),
        stats=global_stats,
        accuracy=accuracy
    )

@app.route('/templates/quiz')
def quiz():
    """Página del quiz"""
    return render_template('quiz.html')

@app.route('/static/questions')
def get_questions():
    """Devuelve todas las preguntas"""
    questions = load_questions()
    return jsonify(questions)

@app.route('/api/questions/random')
def get_random_question():
    """Devuelve una pregunta aleatoria"""
    if QUESTIONS:
        question = random.choice(QUESTIONS)
        # No enviar la respuesta correcta
        question_client = {
            "id": question["id"],
            "question": question["question"],
            "answers": question["answers"],
            "type": question.get("type", "single")
        }
        return jsonify(question_client)
    return jsonify({"error": "No hay preguntas disponibles"}), 404

@app.route('/api/questions/<int:question_id>/check', methods=['POST'])
def check_answer(question_id):
    """Verifica una respuesta"""
    data = request.json
    user_answer = data.get('answer')
    
    # Buscar la pregunta
    question = next((q for q in QUESTIONS if q['id'] == question_id), None)
    
    if not question:
        return jsonify({"error": "Pregunta no encontrada"}), 404
    
    # Verificar respuesta
    correct = question['correct']
    is_correct = False
    
    if question.get('type') == 'multiple':
        is_correct = set(user_answer) == set(correct) if isinstance(user_answer, list) else False
    else:
        is_correct = user_answer == correct
    
    # Actualizar estadísticas
    global_stats['total_questions_answered'] += 1
    if is_correct:
        global_stats['total_correct'] += 1
    
    return jsonify({
        "correct": is_correct,
        "correct_answer": correct,
        "explanation": question.get('explanation', '')
    })

@app.route('/api/stats')
def get_stats():
    """Devuelve estadísticas globales"""
    return jsonify(global_stats)

@app.route('/health')
def health():
    """Endpoint de salud"""
    return jsonify({"status": "healthy", "questions": len(QUESTIONS)})

@app.route('/static/<path:path>')
def send_static(path):
    """Sirve archivos estáticos desde la carpeta 'static'"""
    return send_from_directory('static', path)

if __name__ == '__main__':
    # Asegurarse de que el archivo questions.json existe
    if not os.path.exists(QUESTIONS_FILE):
        print(f"⚠️ No se encontró {QUESTIONS_FILE}")
        QUESTIONS = []
    else:
        print(f"📚 Cargando preguntas desde {QUESTIONS_FILE}")
        QUESTIONS = load_questions()
        print(f"✅ {len(QUESTIONS)} preguntas cargadas")
    
    print("🚀 AWS Quiz App iniciado")
    print(f"🌐 Accede desde: http://localhost:5000")
    
    # Obtener IP local
    import subprocess
    try:
        ip = subprocess.check_output(['hostname', '-I']).decode().split()[0]
        print(f"📱 Desde otros dispositivos: http://{ip}:5000")
    except:
        pass
    
    app.run(host='0.0.0.0', port=5000, debug=False)

