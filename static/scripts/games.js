// Create game type description that can pop up within overlay

// [0] q_id, [1] gametype, [2] - [4] question info, [5] answer, [6] - [9] choices, [10] example

class PageState {
    constructor(gameType, questions) {
      this.gameType = gameType;
      this.set = questions;
      this.setSize = questions.length;
      this.currentCorrectness;
      this.correct = 0;
      this.attempts = 0;
      this.answered = false;
      this.gameInfo = false;
      this.shown = [];
      this.current;
      this.hotkeys = [];
      this.setCurrent();
    };

    // Setting and Resetting the Page: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    setCurrent() {
      this.current = this.getCurrent();
      this.setView();
      this.generateHotkeyList();
    };
    resetFields() {
      // ISNT KEEPING GOOD TRACK OF PROGRESS
      if (this.shown.length < this.setSize) {
        this.hotkeys = [];
        if (this.answered) sendQuestionResults();
        document.querySelectorAll('.blank')[0].innerHTML = blank;
        document.querySelectorAll('.message')[0].innerHTML = "";
        document.querySelectorAll('.tip')[0].innerHTML = "";
        this.setCurrent();
        this.answered = false;
      } else {
        this.storeResults();
        window.location.href = "/results";
      }
    };
    storeResults() {
      localStorage.setItem("resultRecord", JSON.stringify(record.record));
      localStorage.setItem("score", JSON.stringify([this.correct, this.attempts, calcPercentage(this.correct, this.attempts)]));
      localStorage.setItem("gameType", JSON.stringify(this.gameType));
      localStorage.setItem("key", JSON.stringify(this.key));
    };

    // Operational and Mechanical Functions >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    getCurrent() {
      let current = this.set[randomElement(this.setSize)];
      if (this.shown.includes(current["q_id"])) {
        console.log("Already shown");
        return this.getCurrent();
      } else {
        if (this.answered || this.shown.length == 0) this.shown.push(current["q_id"]);
        return current;
      };
    };
    checkAnswer(answer) {
      if (!this.answered) {
        let correctness = this.testCorrectness(answer);
        this.currentCorrectness = (correctness ? 1 : 0);
        this.displayTip(correctness);
        this.displayAsnwer(answer, correctness);
        this.attempts += 1;
        this.displayScore();
        let question = this.questionText(this.current);
        record.addAttempt(this.current["q_id"], answer, this.current["answer"], question, correctness);
        this.answered = true;
      };
    };
    questionText(current) {
      let question = "";
      for (let index = 0; index < 3; index++) {
        if (current[`qinfo_${index}`]) question += `${current[`qinfo_${index}`]} `
      };
      return question.trim()
    };
    testCorrectness(answer) {
      if (answer == this.current["answer"]) {
        this.correct += 1;
        return true;
      } else return false;
    };
    interpretChoice(element) {
      this.checkAnswer(element.innerHTML.substr(3));
    };
    generateHotkeyList() {
      let hotkeys = this.hotkeys;
      document.querySelectorAll('.choice').forEach(function(choice) {
        hotkeys.push(choice.innerHTML.substr(3))
      });
    };

    // Display/View: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    setView() {
      this.displayCurrentWord();
      this.displayChoices(this.current);
      this.displayScore();
    }
    displayCurrentWord() {
      if (this.gameType == "gender" || this.gameType == "preps") {
        document.querySelectorAll('.current')[0].innerHTML = this.current["qinfo_1"];
      } else if (this.gameType == "endings") {
        document.querySelectorAll('.current')[0].innerHTML = this.current["qinfo_1"];
        document.querySelectorAll('.hint')[0].innerHTML = `z. B. "<strong>${this.current["example"]}</strong>"`;
      } else if (this.gameType == "articles") {
        document.querySelectorAll('.current')[0].innerHTML = generateQuestion(this.current);
      };
    };
    displayChoices(current) {
      let choices = ["choice_a", "choice_b", "choice_c", "choice_d"];
      document.querySelectorAll('.choice').forEach(function(choice, index) {
        choice.innerHTML = `${index + 1}. ${current[choices[index]]}`;
      });
    };
    displayAsnwer(answer, correctness) {
      if (correctness) {
        document.querySelectorAll('.blank')[0].innerHTML = this.prefix() + `<em class='correct'>${this.current["answer"]}</em>`;
        document.querySelectorAll('.message')[0].innerHTML = `Correct! You chose <em class='correct'>${answer}</em>.`;
      } else {
        document.querySelectorAll('.blank')[0].innerHTML = this.prefix() + `<em class='incorrect'>${this.current["answer"]}</em>`;
        document.querySelectorAll('.message')[0].innerHTML = `Incorrect. You chose <em class='incorrect'>${answer}</em>.`;
      }
    };
    prefix() {
      if (this.gameType == "endings") return ": ";
      else if (this.gameType == "preps") return "ist ";
      else return "";
    };
    displayScore() {
      document.querySelectorAll('.score')[0].innerHTML = `${this.correct}/${this.attempts}: ${calcPercentage(this.correct, this.attempts)}%`;
    };
    displayTip(isCorrect) {
      let tip = document.querySelectorAll('.tip')[0];
      if (!isCorrect) {
        if (this.gameType == "gender") tip.innerHTML = suffixDisplay();
        else if (this.gameType == "endings") tip.innerHTML = generateExample(game.current);
      } else {
        tip.innerHTML = "";
      };
    };
    toggleOverlay() {
      let overlay = document.querySelectorAll('.overlay')[0];
      if (game.gameInfo) overlay.style.display = "none";
      else overlay.style.display = "block";
      game.gameInfo = !game.gameInfo;
    };
};

class questionRecord {
    constructor() {
      this.record = [];
    };
    addAttempt(qID, guess, solution, word, correctness) {
      let attempt = [qID, guess, solution, word, correctness];
      this.record.push(attempt);
    };
};

// Extra Functions

function randomElement(setSize) {
  return Math.floor(Math.random() * setSize);
};

function calcPercentage(correct, attempts) {
  if (attempts > 0) return Math.round((correct / attempts) * 100);
  else return 0;
};

function setHotkeys() {
  setChoiceHotkeys();
  setOverlayHotkeys();
  setNextHotkey();
};

function setChoiceHotkeys() {
  choice = document.querySelectorAll('.choice')
  for (let index = 0, key = 49; index < game.hotkeys.length; index++, key++) {
    window.addEventListener("keyup", function(event) {
      if (event.keyCode == key) game.checkAnswer(choice[index].innerHTML.substr(3));
    });
  };
};

function setNextHotkey() {
  window.addEventListener("keyup", function(event) {
    if (event.keyCode == 13) game.resetFields();
  });
};

function setOverlayHotkeys() {
  window.addEventListener("keyup", function(event) {
    if (event.keyCode == 79 && !game.gameInfo) {
      document.querySelectorAll('.overlay')[0].style.display = "block";
      game.gameInfo = true;
    } else if (event.keyCode == 79 && game.gameInfo) {
      document.querySelectorAll('.overlay')[0].style.display = "none";
      game.gameInfo = false;
    };
  });
};
function sendQuestionResults() {
  if (user_id) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/update_grades");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
      if (!JSON.parse(xhr.responseText)) console.log(JSON.parse(xhr.responseText))
    }
    xhr.send(JSON.stringify({q_id: game.current["q_id"], u_id: user_id, correct: game.currentCorrectness}));
  };
};