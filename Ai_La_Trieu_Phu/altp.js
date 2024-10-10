const startButton = document.getElementById('start-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const resultMessageElement = document.getElementById('result-message');
const restartButton = document.getElementById('restart-btn');

let shuffledQuestions, currentQuestionIndex;

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

function startGame() {
    startButton.classList.add('hide');
    questionContainer.classList.remove('hide');
    currentQuestionIndex = 0;
    fetchQuestions();
}

function fetchQuestions() {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple&category=17') // Sửa category thành 17 (chủ đề khoa học)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Kiểm tra dữ liệu trả về
            if (data.results && data.results.length > 0) {
                shuffledQuestions = data.results.map(question => {
                    const formattedQuestion = {
                        question: question.question,
                        answers: []
                    };
                    const answerChoices = [...question.incorrect_answers];
                    formattedQuestion.answers = answerChoices.map(answer => ({ text: answer, correct: false }));
                    formattedQuestion.answers.push({ text: question.correct_answer, correct: true });
                    formattedQuestion.answers.sort(() => Math.random() - 0.5);
                    return formattedQuestion;
                });
                return translateQuestionsToVietnamese(shuffledQuestions);
            } else {
                throw new Error("Không có câu hỏi nào được tải về từ API.");
            }
        })
        .then(() => {
            setNextQuestion();
        })
        .catch(error => {
            console.error('Lỗi khi tải câu hỏi:', error);
        });
}

async function translateText(text, targetLang = 'vi') {
    const apiUrl = 'https://api.mymemory.translated.net/get';
    const url = `${apiUrl}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.responseData.translatedText;
}

async function translateQuestionsToVietnamese(questions) {
    const translations = await Promise.all(
        questions.map(async (question) => {
            question.question = await translateText(question.question);
            for (let i = 0; i < question.answers.length; i++) {
                question.answers[i].text = await translateText(question.answers[i].text);
            }
        })
    );
}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerHTML = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";

    showResultMessage(correct);

    if (correct) {
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledQuestions.length) {
            setNextQuestion();
        } else {
            setTimeout(() => {
                showRestartButton();
                console.log('Trò chơi kết thúc! Bạn đã hoàn thành tất cả câu hỏi.');
            }, 1000);
        }
    } else {
        setTimeout(() => {
            showRestartButton();
            console.log('Sai rồi, trò chơi kết thúc!');
        }, 1000);
    }
}

function showResultMessage(correct) {
    resultMessageElement.classList.remove('hide');
    if (correct) {
        resultMessageElement.textContent = "Chúc mừng, bạn đã trả lời đúng!";
        resultMessageElement.classList.add('correct');
        resultMessageElement.classList.remove('incorrect');
    } else {
        resultMessageElement.textContent = "Sai rồi, trò chơi kết thúc!";
        resultMessageElement.classList.add('incorrect');
        resultMessageElement.classList.remove('correct');
    }

    resultMessageElement.classList.add('show');
    setTimeout(() => {
        resultMessageElement.classList.remove('show');
    }, 2000);
}

function showRestartButton() {
    restartButton.classList.remove('hide');
}

function restartGame() {
    restartButton.classList.add('hide');
    startButton.classList.remove('hide');
    questionContainer.classList.add('hide');
}
