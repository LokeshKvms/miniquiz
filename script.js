const defaultQuestions = [
  {
    question: "Which are known as the oceans from the following?",
    options: ["Pacific", "Nile", "Thames", "Arctic"],
    answer: [0, 3],
    type: "checkbox",
  },
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: 2,
    type: "radio",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: 1,
    type: "radio",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    answer: 3,
    type: "radio",
  },
  {
    question: "What is the chemical symbol for water?",
    options: ["O2", "H2O", "CO2", "H2"],
    answer: 1,
    type: "radio",
  },
  {
    question: "How many days in a week?",
    answer: 7,
    type: "text",
  },
  {
    question: "Who developed the theory of relativity?",
    options: [
      "Isaac Newton",
      "Albert Einstein",
      "Galileo Galilei",
      "Nikola Tesla",
    ],
    answer: 1,
    type: "radio",
  },
];

if (!localStorage.getItem("questions")) {
  localStorage.setItem("questions", JSON.stringify(defaultQuestions));
}

let questions = JSON.parse(localStorage.getItem("questions"));
let currentQuestion = parseInt(localStorage.getItem("currentQuestion")) || 0;
let score = parseInt(localStorage.getItem("score")) || 0;

function loadQuestion() {
  const question = questions[currentQuestion];
  document.getElementById("question-text").innerText = question.question;

  const optionsContainer = document.querySelector(".options");
  optionsContainer.innerHTML = "";

  if (question.type === "radio") {
    question.options.forEach((option, index) => {
      const optionHTML = `
        <input type="radio" name="option" id="option${index}" class="option" value="${index}">
        <label for="option${index}" id="option${index}-label">${option}</label><br>
      `;
      optionsContainer.innerHTML += optionHTML;
    });
  } else if (question.type === "checkbox") {
    question.options.forEach((option, index) => {
      const optionHTML = `
        <input type="checkbox" name="option" id="option${index}" class="option" value="${index}" style='display:none'>
        <label for="option${index}" id="option${index}-label">${option}</label><br>
      `;
      optionsContainer.innerHTML += optionHTML;
    });
  } else if (question.type === "text") {
    const optionHTML = `
    <label for="text-input">Enter your answer:</label><br>
      <input type="text" id="text-input" class="option">
    `;
    optionsContainer.innerHTML = optionHTML;
  }

  const options = document.querySelectorAll(".option");
  options.forEach((option) => (option.checked = false));

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  document.getElementById("progress").style.width = progress + "%";
}

function nextQuestion() {
  const question = questions[currentQuestion];
  let selectedAnswer = null;

  if (question.type === "radio") {
    const selectedOption = document.querySelector(
      'input[name="option"]:checked'
    );
    if (!selectedOption) return;
    selectedAnswer = parseInt(selectedOption.value);
  } else if (question.type === "checkbox") {
    const selectedOptions = Array.from(
      document.querySelectorAll('input[name="option"]:checked')
    );
    if (selectedOptions.length === 0) return;
    selectedAnswer = selectedOptions.map((option) => parseInt(option.value));
  } else if (question.type === "text") {
    const textInput = document.getElementById("text-input").value;
    if (!textInput) return;
    selectedAnswer = parseInt(textInput);
  }

  const correctAnswer = question.answer;
  if (Array.isArray(correctAnswer)) {
    if (selectedAnswer.sort().toString() === correctAnswer.sort().toString()) {
      score++;
    }
  } else {
    if (selectedAnswer === correctAnswer) {
      score++;
    }
  }

  localStorage.setItem("currentQuestion", currentQuestion + 1);
  localStorage.setItem("score", score);

  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("question-card").style.display = "none";
  document.getElementById("result-card").style.display = "block";
  document.getElementById("score").innerText = `${score} / ${questions.length}`;
}

function restartQuiz() {
  localStorage.removeItem("currentQuestion");
  localStorage.removeItem("score");
  localStorage.setItem("questions", JSON.stringify(defaultQuestions));

  questions = JSON.parse(localStorage.getItem("questions"));
  currentQuestion = 0;
  score = 0;

  document.getElementById("question-card").style.display = "block";
  document.getElementById("result-card").style.display = "none";
  loadQuestion();
}

document.getElementById("next-button").addEventListener("click", nextQuestion);
window.onload = loadQuestion;
