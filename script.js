// Game State
let categoriesList = null;
let currentCategory = null;
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

// DOM Elements
const categoryScreen = document.getElementById('category-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const categoryList = document.getElementById('category-list');
const questionText = document.getElementById('question-text');
const answerOptions = document.getElementById('answer-options');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreDisplay = document.getElementById('score');
const questionNumber = document.getElementById('question-number');
const totalQuestions = document.getElementById('total-questions');
// Shuffle array function (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array]; // Create a copy
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Load categories list from categories.json
async function loadCategories() {
    try {
        const response = await fetch('data/categories.json');
        categoriesList = await response.json();
        
        // Check if there's no URL parameter before displaying
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.get('category')) {
            displayCategories();
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('Failed to load trivia categories. Please try again.');
    }
}

// Display category selection
function displayCategories() {
    categoryList.innerHTML = '';
    
    categoriesList.categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <h3>${category.name}</h3>
            <p>${category.description}</p>
        `;
        categoryCard.addEventListener('click', () => loadCategoryQuestions(category));
        categoryList.appendChild(categoryCard);
    });
}

// Load questions for selected category
async function loadCategoryQuestions(category) {
    try {
        const response = await fetch(category.file);
        const data = await response.json();
        
        // Create category object with shuffled questions
		currentCategory = {
    		id: category.id,
    		name: category.name,
    		description: category.description,
    		questions: shuffleArray(data.questions)
	};
        
        startQuiz();
    } catch (error) {
        console.error('Error loading category questions:', error);
        alert('Failed to load questions for this category. Please try again.');
    }
}

// Start quiz with loaded category
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    
    // Update UI
    scoreDisplay.textContent = score;
    totalQuestions.textContent = currentCategory.questions.length;
    
    // Switch screens
    categoryScreen.classList.remove('active');
    quizScreen.classList.add('active');
    
    // Load first question
    loadQuestion();
}

// Load current question
function loadQuestion() {
    selectedAnswer = null;
    submitBtn.style.display = 'block';
    nextBtn.style.display = 'none';
    
    const question = currentCategory.questions[currentQuestionIndex];
    questionNumber.textContent = currentQuestionIndex + 1;
    questionText.textContent = question.question;
    
    // Clear previous answers
    answerOptions.innerHTML = '';
    
    if (question.type === 'multiple_choice') {
        displayMultipleChoice(question);
    } else if (question.type === 'short_answer') {
        displayShortAnswer(question);
    }
}

// Display multiple choice options
function displayMultipleChoice(question) {
    question.options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'answer-option';
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', () => selectAnswer(optionDiv, option));
        answerOptions.appendChild(optionDiv);
    });
}

// Display short answer input
function displayShortAnswer(question) {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'short-answer-input';
    input.placeholder = 'Type your answer here...';
    input.addEventListener('input', (e) => {
        selectedAnswer = e.target.value.trim();
    });
    answerOptions.appendChild(input);
}

// Select an answer (multiple choice)
function selectAnswer(optionDiv, answer) {
    // Remove previous selection
    document.querySelectorAll('.answer-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Mark new selection
    optionDiv.classList.add('selected');
    selectedAnswer = answer;
}

// Submit answer
submitBtn.addEventListener('click', () => {
    if (!selectedAnswer) {
        alert('Please select or enter an answer!');
        return;
    }
    
    const question = currentCategory.questions[currentQuestionIndex];
    const isCorrect = checkAnswer(selectedAnswer, question.correct_answer);
    
    if (isCorrect) {
        score++;
        scoreDisplay.textContent = score;
    }
    
    // Show feedback
    showFeedback(isCorrect, question);
    
    // Disable further selection
    disableAnswerOptions();
    
    // Show next button
    submitBtn.style.display = 'none';
    nextBtn.style.display = 'block';
});

// Check if answer is correct
function checkAnswer(userAnswer, correctAnswer) {
    // Case-insensitive comparison, trimmed
    return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
}

// Show feedback (correct/incorrect)
function showFeedback(isCorrect, question) {
    if (question.type === 'multiple_choice') {
        const options = document.querySelectorAll('.answer-option');
        options.forEach(option => {
            if (option.textContent === question.correct_answer) {
                option.classList.add('correct');
            } else if (option.classList.contains('selected') && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
    } else {
        const input = document.getElementById('short-answer-input');
        if (isCorrect) {
            input.style.borderColor = '#2ecc71';
        } else {
            input.style.borderColor = '#e74c3c';
            // Show correct answer
            const correctDiv = document.createElement('div');
            correctDiv.style.color = '#2ecc71';
            correctDiv.style.marginTop = '10px';
            correctDiv.style.fontSize = '1.2em';
            correctDiv.textContent = `Correct answer: ${question.correct_answer}`;
            answerOptions.appendChild(correctDiv);
        }
    }
}

// Disable answer options after submission
function disableAnswerOptions() {
    const options = document.querySelectorAll('.answer-option');
    options.forEach(option => {
        option.classList.add('disabled');
        option.style.pointerEvents = 'none';
    });
    
    const input = document.getElementById('short-answer-input');
    if (input) {
        input.disabled = true;
    }
}

// Next question
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentCategory.questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Show final results
function showResults() {
    quizScreen.classList.remove('active');
    resultsScreen.classList.add('active');
    
    const finalScore = document.getElementById('final-score');
    const finalTotal = document.getElementById('final-total');
    const percentage = document.getElementById('percentage');
    
    finalScore.textContent = score;
    finalTotal.textContent = currentCategory.questions.length;
    
    const percentValue = Math.round((score / currentCategory.questions.length) * 100);
    percentage.textContent = percentValue;
}

// Restart game
restartBtn.addEventListener('click', () => {
    resultsScreen.classList.remove('active');
    categoryScreen.classList.add('active');
    displayCategories();
});

// Return home button with confirmation
document.addEventListener('DOMContentLoaded', () => {
    const homeBtn = document.getElementById('home-btn');
    
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            const confirmExit = confirm('Are you sure you want to quit this game? Your progress will be lost.');
            
            if (confirmExit) {
                // Reset game state
                currentCategory = null;
                currentQuestionIndex = 0;
                score = 0;
                selectedAnswer = null;
                
                // Return to category screen
                quizScreen.classList.remove('active');
                categoryScreen.classList.add('active');
                
                // Reset displays
                scoreDisplay.textContent = '0';
            }
        });
    }
});

// Check for category parameter in URL and auto-load
async function initializeGame() {
    await loadCategories();
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        if (categoryParam === 'random') {
            // Pick random category
            const randomIndex = Math.floor(Math.random() * categoriesList.categories.length);
            const randomCategory = categoriesList.categories[randomIndex];
            loadCategoryQuestions(randomCategory);
        } else {
            // Load specific category
            const category = categoriesList.categories.find(cat => cat.id === categoryParam);
            if (category) {
                loadCategoryQuestions(category);
            } else {
                // Category not found, show selection screen
                displayCategories();
            }
        }
    } else {
        // No parameter, show category selection
        displayCategories();
    }
}

// Initialize game on page load
initializeGame();