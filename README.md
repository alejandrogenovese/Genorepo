# AWS CLF-C02 Quiz Application 🚀

A modern, responsive quiz application for AWS Cloud Practitioner certification practice with a sleek, contemporary design.

## 🎨 Features

- **Modern UI Design**: Glassmorphism effects, smooth animations, and contemporary styling
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth hover effects and transitions
- **Progress Tracking**: Real-time progress bar and score tracking
- **Question Types**: Support for both single-choice and multiple-choice questions
- **Immediate Feedback**: Instant feedback with detailed explanations
- **Customizable**: Easy to add or modify questions
- **Keyboard Shortcuts**: Use number keys 1-4 to select answers quickly
- **Performance Optimized**: Fast loading and smooth animations

## 🛠️ Installation & Setup

### Option 1: Simple Setup (Recommended)
1. Download all files to a folder on your computer
2. Open `index.html` in your web browser
3. Start taking the quiz!

### Option 2: Web Server Setup
1. Place all files in your web server directory
2. Access through your web server (e.g., `http://localhost/quiz`)

### Option 3: Live Server (VS Code)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html` and select "Open with Live Server"

## 📁 File Structure

```
quiz-app/
├── index.html          # Main HTML file
├── style.css           # Modern CSS styles
├── script.js           # JavaScript functionality
├── questions.json      # Question data (optional)
└── README.md          # Documentation
```

## 🎮 How to Use

1. **Start Quiz**: Select the number of questions and click "Comenzar Quiz"
2. **Answer Questions**: 
   - Click on answers or use number keys (1-4)
   - For multiple choice, select exactly two answers
3. **Get Feedback**: Click "Verificar Respuesta" to see results
4. **Continue**: Click "Siguiente" to move to the next question
5. **View Results**: See your final score and performance analysis

## ⌨️ Keyboard Shortcuts

- **Number Keys (1-4)**: Select answer options quickly
- **Enter**: Submit answer or continue to next question
- **Escape**: Close alert modals

## 🔧 Customization

### Adding Questions

#### Method 1: Edit script.js
Modify the `sampleQuestions` array in `script.js`:

```javascript
const sampleQuestions = [
    {
        id: 1,
        question: "Your question text here?",
        type: "single", // or "multiple"
        answers: [
            "Option A",
            "Option B", 
            "Option C",
            "Option D"
        ],
        correct: 1, // For single choice (index)
        // correct: [0, 2], // For multiple choice (array of indices)
        explanation: "Detailed explanation here..."
    },
    // Add more questions...
];
```

#### Method 2: Load from JSON file
If you want to load questions from the `questions.json` file, modify the initialization in `script.js`:

```javascript
// Replace the sample questions loading with:
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
    });
```

### Question Format

Each question should follow this structure:

```json
{
    "id": 1,
    "question": "Question text",
    "type": "single|multiple",
    "answers": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correct": 1, // or [0, 2] for multiple choice
    "explanation": "Explanation text"
}
```

### Styling Customization

The CSS uses CSS custom properties (variables) that you can easily modify:

```css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #8b5cf6;
    --success-color: #22c55e;
    --error-color: #ef4444;
    --warning-color: #f59e0b;
}
```

## 🎨 Design Features

- **Glassmorphism Effects**: Modern blur and transparency effects
- **Gradient Backgrounds**: Animated gradient backgrounds with floating elements
- **Smooth Animations**: Cubic-bezier easing for professional feel
- **Interactive Feedback**: Visual feedback for correct/incorrect answers
- **Progress Visualization**: Animated progress bars with shimmer effects
- **Score Animation**: Animated score counter in results
- **Responsive Design**: Mobile-first approach with breakpoints

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Mobile Features

- Touch-friendly interface
- Responsive design
- Optimized for mobile interaction
- Swipe gestures support

## 🎯 Quiz Scoring

- **90%+**: Excellent! You master AWS very well 🏆
- **70-89%**: Good job! You have solid knowledge 👍
- **50-69%**: Good, but you can improve with more study 📚
- **<50%**: Keep studying, you can do better! 💪

## 🔒 Security Notes

- No data is stored permanently (privacy-friendly)
- All processing happens client-side
- No external API calls for core functionality

## 🚀 Performance

- Fast loading times
- Smooth animations at 60fps
- Optimized CSS and JavaScript
- Minimal external dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - feel free to use and modify as needed.

## 📞 Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Ensure all files are in the same directory
3. Verify that your browser supports modern JavaScript features
4. Try refreshing the page

## 🎉 Enjoy Your AWS Learning Journey!

This quiz application is designed to make your AWS certification preparation engaging and effective. Good luck with your studies! 

---

*Made with ❤️ for AWS learners worldwide*# Genorepo