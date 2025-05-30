// Test configuration for each subject
const testConfig = {
    math: {
        title: "Bài kiểm tra Toán học",
        time: 30,
        questions: 15
    },
    physics: {
        title: "Bài kiểm tra Vật lý",
        time: 25,
        questions: 12
    },
    chemistry: {
        title: "Bài kiểm tra Hóa học",
        time: 35,
        questions: 18
    },
    english: {
        title: "Bài kiểm tra Tiếng Anh",
        time: 40,
        questions: 20
    },
    literature: {
        title: "Bài kiểm tra Văn học",
        time: 45,
        questions: 10
    }
};

let currentTest = null;
let timer = null;
let timeRemaining = 0;

function openSubjectTest(subject) {
    if (!isLoggedIn()) {
        alert('Vui lòng đăng nhập để làm bài kiểm tra!');
        return;
    }

    const config = testConfig[subject];
    if (!config) return;

    currentTest = subject;
    document.getElementById('testTitle').textContent = config.title;
    document.getElementById('testTime').textContent = config.time;
    document.getElementById('testQuestions').textContent = config.questions;
    timeRemaining = config.time * 60;
    updateTimerDisplay();

    // Load test questions
    loadTestQuestions(subject);

    // Show modal
    document.getElementById('testModal').style.display = 'block';

    // Start timer
    startTimer();
}

function loadTestQuestions(subject) {
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = ''; // Clear previous content

    // TODO: Load actual questions from database
    // For now, using dummy questions
    for (let i = 1; i <= testConfig[subject].questions; i++) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        questionDiv.innerHTML = `
            <div class="question-header">
                <h3>Câu ${i}</h3>
            </div>
            <div class="question-content">
                <p>Đây là câu hỏi mẫu số ${i} cho môn ${subject}.</p>
                <div class="options">
                    <label>
                        <input type="radio" name="q${i}" value="A">
                        A. Đáp án A
                    </label>
                    <label>
                        <input type="radio" name="q${i}" value="B">
                        B. Đáp án B
                    </label>
                    <label>
                        <input type="radio" name="q${i}" value="C">
                        C. Đáp án C
                    </label>
                    <label>
                        <input type="radio" name="q${i}" value="D">
                        D. Đáp án D
                    </label>
                </div>
            </div>
        `;
        testContent.appendChild(questionDiv);
    }
}

function startTimer() {
    if (timer) clearInterval(timer);
    
    timer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timer);
            submitTest();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timeRemaining').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function submitTest() {
    if (timer) clearInterval(timer);
    
    // TODO: Implement actual test submission logic
    alert('Bài kiểm tra đã được nộp!');
    closeModal('testModal');
}

// Add this to your existing closeModal function in main.js
function closeModal(modalId) {
    if (modalId === 'testModal' && timer) {
        clearInterval(timer);
    }
    document.getElementById(modalId).style.display = 'none';
}

// Quản lý bài kiểm tra
const TestManager = {
    // Danh sách câu hỏi theo môn học
    questions: {
        math: [
            {
                id: 1,
                question: "Tính tổng các số từ 1 đến 10",
                options: ["45", "50", "55", "60"],
                correctAnswer: "55",
                explanation: "Tổng các số từ 1 đến 10 = (10 * 11) / 2 = 55"
            },
            {
                id: 2,
                question: "Giải phương trình: x² + 5x + 6 = 0",
                options: ["x = -2, x = -3", "x = 2, x = 3", "x = -1, x = -4", "x = 1, x = 4"],
                correctAnswer: "x = -2, x = -3",
                explanation: "x² + 5x + 6 = 0 => (x + 2)(x + 3) = 0 => x = -2 hoặc x = -3"
            },
            {
                id: 3,
                question: "Tính đạo hàm của hàm số f(x) = x² + 3x + 2",
                options: ["f'(x) = 2x + 3", "f'(x) = 2x + 2", "f'(x) = x + 3", "f'(x) = x + 2"],
                correctAnswer: "f'(x) = 2x + 3",
                explanation: "Đạo hàm của x² là 2x, đạo hàm của 3x là 3, đạo hàm của hằng số 2 là 0"
            }
        ],
        physics: [
            {
                id: 1,
                question: "Định luật Newton thứ nhất phát biểu rằng:",
                options: [
                    "Một vật sẽ giữ nguyên trạng thái đứng yên hoặc chuyển động thẳng đều nếu không có lực nào tác dụng lên nó",
                    "Lực tác dụng lên một vật tỷ lệ thuận với gia tốc của vật đó",
                    "Mọi lực tác dụng đều có phản lực ngược chiều và bằng độ lớn",
                    "Không có đáp án nào đúng"
                ],
                correctAnswer: "Một vật sẽ giữ nguyên trạng thái đứng yên hoặc chuyển động thẳng đều nếu không có lực nào tác dụng lên nó",
                explanation: "Đây là nội dung của định luật quán tính (định luật Newton thứ nhất)"
            },
            {
                id: 2,
                question: "Công thức tính vận tốc trung bình là:",
                options: [
                    "v = s/t",
                    "v = t/s",
                    "v = s*t",
                    "v = s²/t"
                ],
                correctAnswer: "v = s/t",
                explanation: "Vận tốc trung bình = quãng đường / thời gian"
            }
        ],
        chemistry: [
            {
                id: 1,
                question: "Công thức hóa học của axit sunfuric là:",
                options: ["H2SO4", "H2SO3", "H2S", "H2SO2"],
                correctAnswer: "H2SO4",
                explanation: "Axit sunfuric có công thức H2SO4, trong đó có 2 nguyên tử H, 1 nguyên tử S và 4 nguyên tử O"
            },
            {
                id: 2,
                question: "Kim loại nào sau đây tác dụng với nước ở nhiệt độ thường?",
                options: ["Na", "Fe", "Cu", "Ag"],
                correctAnswer: "Na",
                explanation: "Natri (Na) là kim loại kiềm, tác dụng mạnh với nước ở nhiệt độ thường"
            }
        ],
        english: [
            {
                id: 1,
                question: "Choose the correct sentence:",
                options: [
                    "I have been studying English for 5 years",
                    "I am studying English for 5 years",
                    "I study English for 5 years",
                    "I studied English for 5 years"
                ],
                correctAnswer: "I have been studying English for 5 years",
                explanation: "Present Perfect Continuous is used for actions that started in the past and continue to the present"
            },
            {
                id: 2,
                question: "Which word is a synonym of 'happy'?",
                options: ["Joyful", "Sad", "Angry", "Tired"],
                correctAnswer: "Joyful",
                explanation: "Joyful means feeling or expressing great happiness"
            }
        ],
        literature: [
            {
                id: 1,
                question: "Tác phẩm 'Tắt đèn' của nhà văn nào?",
                options: ["Ngô Tất Tố", "Nam Cao", "Vũ Trọng Phụng", "Nguyễn Công Hoan"],
                correctAnswer: "Ngô Tất Tố",
                explanation: "Tắt đèn là tiểu thuyết của nhà văn Ngô Tất Tố, xuất bản năm 1939"
            },
            {
                id: 2,
                question: "Thể thơ của bài thơ 'Tây Tiến' là:",
                options: ["Thất ngôn", "Lục bát", "Song thất lục bát", "Tự do"],
                correctAnswer: "Thất ngôn",
                explanation: "Bài thơ Tây Tiến của Quang Dũng được viết theo thể thơ thất ngôn"
            }
        ]
    },

    // Thời gian làm bài cho mỗi môn (tính bằng phút)
    timeLimits: {
        math: 30,
        physics: 25,
        chemistry: 35,
        english: 40,
        literature: 45
    },

    // Số câu hỏi cho mỗi môn
    questionCounts: {
        math: 15,
        physics: 12,
        chemistry: 18,
        english: 20,
        literature: 10
    },

    // Khởi tạo bài kiểm tra
    initTest: function(subject) {
        const questions = this.questions[subject];
        const timeLimit = this.timeLimits[subject];
        const questionCount = this.questionCounts[subject];

        // Lấy ngẫu nhiên số câu hỏi theo yêu cầu
        const selectedQuestions = this.getRandomQuestions(questions, questionCount);

        return {
            subject: subject,
            timeLimit: timeLimit,
            questions: selectedQuestions,
            startTime: new Date(),
            userAnswers: {}
        };
    },

    // Lấy ngẫu nhiên câu hỏi
    getRandomQuestions: function(questions, count) {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },

    // Kiểm tra đáp án
    checkAnswer: function(questionId, userAnswer, correctAnswer) {
        return userAnswer === correctAnswer;
    },

    // Tính điểm
    calculateScore: function(test) {
        let correctCount = 0;
        for (let question of test.questions) {
            if (this.checkAnswer(question.id, test.userAnswers[question.id], question.correctAnswer)) {
                correctCount++;
            }
        }
        return {
            total: test.questions.length,
            correct: correctCount,
            score: (correctCount / test.questions.length) * 10
        };
    }
};

// Xử lý sự kiện mở bài kiểm tra
function openSubjectTest(subject) {
    const test = TestManager.initTest(subject);
    localStorage.setItem('currentTest', JSON.stringify(test));
    
    // Hiển thị modal bài kiểm tra
    const modal = document.getElementById('testModal');
    const title = document.getElementById('testTitle');
    const timeDisplay = document.getElementById('testTime');
    const questionsDisplay = document.getElementById('testQuestions');
    const content = document.getElementById('testContent');
    
    // Cập nhật thông tin bài kiểm tra
    title.textContent = `Bài kiểm tra ${getSubjectName(subject)}`;
    timeDisplay.textContent = test.timeLimit;
    questionsDisplay.textContent = test.questions.length;
    
    // Hiển thị câu hỏi
    content.innerHTML = test.questions.map((q, index) => `
        <div class="question-container">
            <div class="question-header">
                <span class="question-number">Câu ${index + 1}:</span>
                <span class="question-text">${q.question}</span>
            </div>
            <div class="options-container">
                ${q.options.map((opt, optIndex) => `
                    <label class="option">
                        <input type="radio" name="q${q.id}" value="${opt}" 
                               onchange="handleAnswer(${q.id}, '${opt}')">
                        <span class="option-text">${opt}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    // Hiển thị modal
    modal.style.display = 'block';
    
    // Bắt đầu đếm thời gian
    startTimer(test.timeLimit);
}

// Xử lý đáp án
function handleAnswer(questionId, answer) {
    const test = JSON.parse(localStorage.getItem('currentTest'));
    test.userAnswers[questionId] = answer;
    localStorage.setItem('currentTest', JSON.stringify(test));
}

// Nộp bài
function submitTest() {
    const test = JSON.parse(localStorage.getItem('currentTest'));
    const result = TestManager.calculateScore(test);
    
    // Hiển thị kết quả
    const content = document.getElementById('testContent');
    content.innerHTML = `
        <div class="test-result">
            <h3>Kết quả bài kiểm tra</h3>
            <div class="result-details">
                <p>Tổng số câu: ${result.total}</p>
                <p>Số câu đúng: ${result.correct}</p>
                <p>Điểm số: ${result.score.toFixed(1)}/10</p>
            </div>
            <div class="answers-review">
                ${test.questions.map((q, index) => `
                    <div class="answer-item ${test.userAnswers[q.id] === q.correctAnswer ? 'correct' : 'incorrect'}">
                        <div class="question-text">Câu ${index + 1}: ${q.question}</div>
                        <div class="answer-details">
                            <p>Đáp án của bạn: ${test.userAnswers[q.id] || 'Chưa trả lời'}</p>
                            <p>Đáp án đúng: ${q.correctAnswer}</p>
                            <p class="explanation">Giải thích: ${q.explanation}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Dừng đếm thời gian
    clearInterval(timerInterval);
}

// Đếm thời gian
let timerInterval;
function startTimer(minutes) {
    let timeLeft = minutes * 60;
    const timerDisplay = document.getElementById('timeRemaining');
    
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitTest();
        }
        
        timeLeft--;
    }, 1000);
}

// Lấy tên môn học
function getSubjectName(subject) {
    const names = {
        math: 'Toán học',
        physics: 'Vật lý',
        chemistry: 'Hóa học',
        english: 'Tiếng Anh',
        literature: 'Văn học'
    };
    return names[subject] || subject;
}

// Thêm style cho bài kiểm tra
const testStyle = document.createElement('style');
testStyle.textContent = `
    .question-container {
        background: #fff;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .question-header {
        margin-bottom: 15px;
    }

    .question-number {
        font-weight: bold;
        color: #4a90e2;
        margin-right: 10px;
    }

    .question-text {
        font-size: 1.1em;
        color: #333;
    }

    .options-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .option {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .option:hover {
        background: #f5f5f5;
    }

    .option input[type="radio"] {
        margin-right: 10px;
    }

    .test-result {
        padding: 20px;
    }

    .result-details {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
    }

    .answer-item {
        background: #fff;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
        border-left: 4px solid #e0e0e0;
    }

    .answer-item.correct {
        border-left-color: #28a745;
    }

    .answer-item.incorrect {
        border-left-color: #dc3545;
    }

    .explanation {
        color: #666;
        font-style: italic;
        margin-top: 10px;
    }
`;
document.head.appendChild(testStyle); 