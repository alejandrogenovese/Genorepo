// Global variables
let currentQuestion = 0;
let score = 0;
let selectedQuestions = [];

// DOM elements
const configSection = document.getElementById('config-section');
const questionSection = document.getElementById('question-section');
const resultsSection = document.getElementById('results-section');
const progressSection = document.querySelector('.progress-section');
const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const customAlert = document.getElementById('custom-alert');
const alertMessage = document.getElementById('alert-message');
const alertClose = document.getElementById('alert-close');
const alertOk = document.getElementById('alert-ok');

// Sample AWS questions - replace with your actual question data
// Función para cargar las preguntas desde el archivo JSON
async function loadQuestions() {
    try {
        const response = await fetch('static/questions.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo de preguntas');
        }
        const questions = await response.json();
        return questions;
    } catch (error) {
        console.error('Error cargando preguntas:', error);
        // Usar preguntas de respaldo en caso de error
        return [];
    }
}

// Variable para almacenar las preguntas
let questions = [];

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', async function() {
    // Cargar preguntas desde el archivo JSON
    questions = await loadQuestions();
    
    if (questions.length === 0) {
        showCustomAlert('No se pudieron cargar las preguntas. Por favor, intenta más tarde.');
        return;
    }
    
    // Event listeners
    startBtn.addEventListener('click', startQuiz);
    submitBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    alertClose.addEventListener('click', hideCustomAlert);
    alertOk.addEventListener('click', hideCustomAlert);
    
    // Close alert when clicking outside
    customAlert.addEventListener('click', function(e) {
        if (e.target === customAlert) {
            hideCustomAlert();
        }
    });
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load questions (in a real app, this would come from an API or JSON file)
    questions = sampleQuestions;
    
    // Event listeners
    startBtn.addEventListener('click', startQuiz);
    submitBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    alertClose.addEventListener('click', hideCustomAlert);
    alertOk.addEventListener('click', hideCustomAlert);
    
    // Close alert when clicking outside
    customAlert.addEventListener('click', function(e) {
        if (e.target === customAlert) {
            hideCustomAlert();
        }
    });
});

// Start the quiz
function startQuiz() {
    const numQuestions = document.getElementById('numQuestions').value;
    selectedQuestions = selectQuestions(numQuestions);
    currentQuestion = 0;
    score = 0;
    
    // Show quiz sections
    configSection.style.display = 'none';
    questionSection.style.display = 'block';
    progressSection.style.display = 'block';
    
    showQuestion();
}

// Select questions for the quiz
function selectQuestions(num) {
    let shuffled = [...questions].sort(() => 0.5 - Math.random());
    return num === 'all' ? shuffled : shuffled.slice(0, parseInt(num));
}

// Display current question
function showQuestion() {
    const question = selectedQuestions[currentQuestion];
    const isMultipleChoice = question.type === 'multiple';
    
    // Update question info
    document.getElementById('question-badge').textContent = `Pregunta ${currentQuestion + 1}`;
    document.getElementById('question-type').textContent = isMultipleChoice ? 'Opción múltiple' : 'Opción única';
    document.getElementById('question-text').textContent = question.question;
    
    // Show/hide instruction text for multiple choice
    const instructionText = document.getElementById('instruction-text');
    if (isMultipleChoice) {
        instructionText.style.display = 'block';
    } else {
        instructionText.style.display = 'none';
    }
    
    // Create answer choices
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';
    
    question.answers.forEach((choice, index) => {
        const choiceDiv = document.createElement('div');
        choiceDiv.className = 'choice';
        choiceDiv.innerHTML = `
            <input type="${isMultipleChoice ? 'checkbox' : 'radio'}" 
                   name="choice" 
                   value="${index}" 
                   id="choice-${index}">
            <label for="choice-${index}">${choice}</label>
        `;
        
        // Add click handler for the entire choice div
        choiceDiv.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox' && e.target.type !== 'radio') {
                const input = this.querySelector('input');
                if (input.type === 'radio') {
                    // For radio buttons, clear all selections first
                    document.querySelectorAll('.choice').forEach(c => c.classList.remove('selected'));
                    input.checked = true;
                } else {
                    // For checkboxes, toggle selection
                    input.checked = !input.checked;
                }
                
                this.classList.toggle('selected', input.checked);
            } else {
                // Direct input interaction
                this.classList.toggle('selected', e.target.checked);
                
                // For radio buttons, clear other selections
                if (e.target.type === 'radio') {
                    document.querySelectorAll('.choice').forEach(c => {
                        if (c !== this) c.classList.remove('selected');
                    });
                }
            }
        });
        
        choicesContainer.appendChild(choiceDiv);
    });
    
    // Update progress
    updateProgress();
    
    // Reset UI state
    document.getElementById('feedback').style.display = 'none';
    submitBtn.style.display = 'block';
    nextBtn.style.display = 'none';
    
    // Remove any previous answer styling
    setTimeout(() => {
        document.querySelectorAll('.choice').forEach(choice => {
            choice.classList.remove('correct', 'incorrect');
        });
    }, 100);
}

// Check the answer
function checkAnswer() {
    const selectedChoices = document.querySelectorAll('input[name="choice"]:checked');
    
    if (!selectedChoices.length) {
        showCustomAlert('Por favor selecciona una respuesta antes de continuar.');
        return;
    }

    const question = selectedQuestions[currentQuestion];
    const isMultipleChoice = question.type === 'multiple';
    
    // Validate multiple choice selection count
    if (isMultipleChoice && selectedChoices.length !== 2) {
        showCustomAlert('Por favor selecciona exactamente dos respuestas para esta pregunta de opción múltiple.');
        return;
    }

    const selectedAnswers = Array.from(selectedChoices).map(choice => parseInt(choice.value));
    let correct;
    
    // Check if answer is correct
    if (isMultipleChoice) {
        correct = arraysEqual(selectedAnswers.sort(), question.correct.sort());
    } else {
        correct = selectedAnswers[0] === question.correct;
    }

    // Show visual feedback on choices
    const choices = document.querySelectorAll('.choice');
    choices.forEach((choice, index) => {
        const input = choice.querySelector('input');
        if (isMultipleChoice) {
            if (question.correct.includes(index)) {
                choice.classList.add('correct');
            } else if (input.checked) {
                choice.classList.add('incorrect');
            }
        } else {
            if (index === question.correct) {
                choice.classList.add('correct');
            } else if (input.checked && index !== question.correct) {
                choice.classList.add('incorrect');
            }
        }
    });

    // Show feedback
    const feedback = document.getElementById('feedback');
    feedback.style.display = 'block';
    feedback.className = `feedback ${correct ? 'correct' : 'incorrect'}`;
    feedback.innerHTML = `
        <strong>${correct ? '🎉 ¡Correcto!' : '❌ Incorrecto'}</strong><br><br>
        <strong>Explicación:</strong> ${question.explanation}
    `;

    // Update score
    if (correct) {
        score++;
    }

    // Update UI
    submitBtn.style.display = 'none';
    nextBtn.style.display = 'block';
    
    updateProgress();
    
    // Auto-advance after showing feedback (optional)
    // setTimeout(nextQuestion, 3000);
}

// Move to next question
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < selectedQuestions.length) {
        showQuestion();
    } else {
        showFinalResults();
    }
}

// Display final results
function showFinalResults() {
    questionSection.style.display = 'none';
    progressSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    const percentage = Math.round((score / selectedQuestions.length) * 100);
    
    // Update score display
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-total').textContent = `de ${selectedQuestions.length}`;
    document.getElementById('final-percentage').textContent = `${percentage}%`;
    
    // Set score message based on performance
    const scoreMessage = document.getElementById('score-message');
    if (percentage >= 90) {
        scoreMessage.textContent = '🏆 ¡Excelente! Dominas muy bien AWS';
        scoreMessage.style.color = '#15803d';
    } else if (percentage >= 70) {
        scoreMessage.textContent = '👍 ¡Buen trabajo! Tienes buenos conocimientos';
        scoreMessage.style.color = '#0369a1';
    } else if (percentage >= 50) {
        scoreMessage.textContent = '📚 Bien, pero puedes mejorar con más estudio';
        scoreMessage.style.color = '#ea580c';
    } else {
        scoreMessage.textContent = '💪 Sigue estudiando, ¡tú puedes hacerlo mejor!';
        scoreMessage.style.color = '#dc2626';
    }
    
    // Animate the score counter
    animateScoreCounter();
}

// Animate score counter
function animateScoreCounter() {
    const scoreElement = document.getElementById('final-score');
    const targetScore = score;
    let currentScore = 0;
    const duration = 1000; // 1 second
    const stepTime = duration / targetScore;
    
    const timer = setInterval(() => {
        currentScore++;
        scoreElement.textContent = currentScore;
        
        if (currentScore >= targetScore) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Restart the quiz
function restartQuiz() {
    resultsSection.style.display = 'none';
    configSection.style.display = 'block';
    progressSection.style.display = 'none';
    
    // Reset variables
    currentQuestion = 0;
    score = 0;
    selectedQuestions = [];
}

// Update progress bar and text
function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const scoreText = document.getElementById('score-text');
    
    const progress = ((currentQuestion + 1) / selectedQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Pregunta ${currentQuestion + 1} de ${selectedQuestions.length}`;
    scoreText.textContent = `Puntuación: ${score}`;
}

// Helper function to compare arrays
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => val === b[idx]);
}

// Show custom alert
function showCustomAlert(message) {
    alertMessage.textContent = message;
    customAlert.style.display = 'flex';
    customAlert.style.animation = 'fadeIn 0.3s ease';
}

// Hide custom alert
function hideCustomAlert() {
    customAlert.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        customAlert.style.display = 'none';
    }, 300);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key to submit or continue
    if (e.key === 'Enter') {
        if (submitBtn.style.display !== 'none') {
            checkAnswer();
        } else if (nextBtn.style.display !== 'none') {
            nextQuestion();
        }
    }
    
    // Escape key to close alert
    if (e.key === 'Escape' && customAlert.style.display === 'flex') {
        hideCustomAlert();
    }
    
    // Number keys 1-4 to select answers (only when question is visible)
    if (questionSection.style.display === 'block' && !document.getElementById('feedback').style.display) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4) {
            const choice = document.getElementById(`choice-${num - 1}`);
            if (choice) {
                choice.click();
            }
        }
    }
});

// Add some fun console messages
console.log('🚀 AWS Quiz App loaded successfully!');
console.log('💡 Tip: Use number keys 1-4 to select answers quickly!');
console.log('⌨️  Press Enter to submit answers or continue to next question');

// Performance monitoring (optional)
window.addEventListener('load', function() {
    console.log('⚡ App loaded in', performance.now().toFixed(2), 'ms');
});