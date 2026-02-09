// ── Selectors ────────────────────────────────────────────────
const startBtn = document.querySelector(".strt_btn");
const rulesBox = document.querySelector(".rules");
const exitBtn = document.querySelector(".exit");
const continueBtn = document.querySelector(".continue");
const quizBox = document.querySelector(".app");
const questionEl = document.querySelector(".quest");
const optionList = document.querySelector(".option_list");
const nextBtn = document.querySelector(".next_que");
const queCountEl = document.querySelector(".que_count");
const totalQueEl = document.querySelector(".total_que");
const timerDisplay = document.querySelector(".timer");

let currentQuestion = 0;
let score = 0;
let hasAnswered = false;
let timeLeft = 15;
let timerInterval = null;

startBtn.onclick = () => {
  rulesBox.classList.add("rules_active");
  startBtn.style.display = "none";
};

exitBtn.onclick = () => {
  rulesBox.classList.remove("rules_active");
  startBtn.style.display = "block";
};

continueBtn.onclick = () => {
  rulesBox.classList.remove("rules_active");
  quizBox.classList.add("app_active");
  currentQuestion = 0;
  score = 0;
  showQuestion(currentQuestion);
};

function showQuestion(index) {
  const q = questions[index];

  clearInterval(timerInterval);
  optionList.innerHTML = "";
  nextBtn.disabled = true;
  hasAnswered = false;
  timeLeft = 15;
  updateTimerDisplay();

  questionEl.innerHTML = `<h3>${q.question}</h3>`;

  queCountEl.textContent = index + 1;
  totalQueEl.textContent = questions.length;

  q.options.forEach((optionText) => {
    const li = document.createElement("li");
    li.className = "list";
    li.textContent = optionText;

    li.addEventListener("click", () => {
      if (hasAnswered) return;
      hasAnswered = true;
      clearInterval(timerInterval);
      checkAnswer(li, optionText, q.answer);
      nextBtn.disabled = false;
    });

    optionList.appendChild(li);
  });

  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeIsUp();
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerDisplay.textContent = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
}

function timeIsUp() {
  hasAnswered = true;
  nextBtn.disabled = false;

  const allOptions = optionList.querySelectorAll(".list");
  const correctAnswer = questions[currentQuestion].answer;

  allOptions.forEach((li) => {
    li.style.pointerEvents = "none";

    if (li.textContent === correctAnswer) {
      li.classList.add("correct");
    }
  });

  questionEl.insertAdjacentHTML(
    "beforeend",
    '<p style="color:#dc3545; margin-top:0.8rem; font-size:0.95rem;">Time\'s up!</p>',
  );
}

function checkAnswer(selectedLi, selectedText, correctAnswer) {
  const allOptions = optionList.querySelectorAll(".list");

  allOptions.forEach((li) => {
    li.style.pointerEvents = "none";

    if (li.textContent === correctAnswer) {
      li.classList.add("correct");
    }

    if (li === selectedLi) {
      if (selectedText === correctAnswer) {
        li.classList.add("correct");
        score++;
      } else {
        li.classList.add("incorrect");
      }
    }
  });
}

nextBtn.onclick = () => {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion(currentQuestion);
  } else {
    quizBox.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem;">
        <h2>Quiz Completed!</h2>
        <p style="font-size: 1.5rem; margin: 2rem 0;">
          Your Score: <strong>${score}</strong> / <strong>${questions.length}</strong>
        </p>
        <button onclick="location.reload()" style="
          padding: 0.9rem 2.2rem;
          font-size: 1.15rem;
          background: rgb(127, 214, 255);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        ">
          Play Again
        </button>
      </div>
    `;
  }
};
