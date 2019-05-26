// Make page state into a prototype, and make subclasses for each gametype that add features as needed!
// Create relational database with the data and load necessary info with python application
// Design for mobile with media queries, update overall look
// Create game type description that can pop up within overlay
// 

class PageState {
    constructor(gameType, set, key) {
      this.gameType = gameType;
      this.set = set;
      this.setSize = set.length;
      this.key = key;
      this.keySize = key.length;
      this.correct = 0;
      this.attempts = 0;
      this.answered = false;
      this.gameInfo = false;
      this.shown = [];
      this.current;
      this.hotkeys = [];
      this.setCurrent();
      this.setHotkeys();
    };

    // Setting and Resetting the Page: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    setCurrent() {
      this.current = this.getCurrent();
      console.log(this.current);
      this.setView();
      this.setButtons();
      this.generateHotkeyList();
    };
    resetFields() {
      if (this.attempts < this.setSize) {
        this.hotkeys = [];
        document.querySelectorAll('.blank')[0].innerHTML = blank;
        document.querySelectorAll('.message')[0].innerHTML = "";
        document.querySelectorAll('.tip')[0].innerHTML = "";
        this.answered = false;
        this.setCurrent();
      } else {
        this.storeResults();
      }
    };
    storeResults() {
      localStorage.setItem("resultRecord", JSON.stringify(record.record));
      localStorage.setItem("score", JSON.stringify([this.correct, this.attempts, calcPercentage(this.correct, this.attempts)]));
      localStorage.setItem("gameType", JSON.stringify(this.gameType));
      localStorage.setItem("key", JSON.stringify(this.key));
    };

    // Operational and Mechanical Functions >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    checkAnswer(answer) {
      console.log(answer);
      if (!this.answered) {
        let correctness = this.testCorrectness(answer);
        this.displayTip(correctness);
        answerDisplay(answer, correctness);
        this.attempts += 1;
        this.displayScore();
        record.addAttempt(answer, this.current[0], this.current[1], correctness);
        this.answered = true;
      };
    };
    testCorrectness(answer) {
      if (answer == this.current[0]) {
        this.correct += 1;
        return true;
      } else return false;
    };
    getCurrent() {
      let current = this.set[randomElement(this.setSize)];
      console.log("gen function", current);
      if (this.shown.includes(current)) {
        return this.getCurrent();
      } else {
        this.shown.push(this.current);
        return current;
      };
    };

    // Display/View: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    setView() {
      this.displayCurrentWord();
      this.displayChoices();
      this.displayScore();
    }
    displayCurrentWord() {
      if (this.gameType == "gender" || this.gameType == "preps") {
        document.querySelectorAll('.current')[0].innerHTML = this.current[1];
      } else if (this.gameType == "endings") {
        document.querySelectorAll('.current')[0].innerHTML = this.current[1];
        document.querySelectorAll('.hint')[0].innerHTML = generateHint(this.current);
      } else if (this.gameType == "articles") {
        document.querySelectorAll('.current')[0].innerHTML = generateQuestion(this.current);
      };
    };
    displayChoices() {
      if (this.gameType == "articles") {
        this.randomChoices();
      } else {
        this.presetChoices();
      };
    };
    randomChoices() {
      let options = this.generateRandomChoices();
      document.querySelectorAll('.choice').forEach(function(choice, index) {
        choice.innerHTML = `${index + 1}. ${options.splice(randomElement(options.length), 1)}`;
      });
    };
    generateRandomChoices() {
      let options = [this.key[this.current[0]]];
      while (options.length < document.querySelectorAll('.choice').length) {
        let falseChoice = this.key[randomElement(this.keySize)];
        if (!options.includes(falseChoice)) options.push(falseChoice);
      };
      return options;
    };
    presetChoices() {
      let counter = 0;
      let key = this.key; 
      document.querySelectorAll('.choice').forEach(function(button) {
        button.innerHTML = `${counter + 1}. ${key[counter]}`;
        counter++;
      });
    };
    displayScore() {
      document.querySelectorAll('.score')[0].innerHTML = `${this.correct}/${this.attempts}: ${calcPercentage(this.correct, this.attempts)}%`;
    };
    displayTip(isCorrect) {
      if (!isCorrect) {
        if (this.gameType == "gender") {
          document.querySelectorAll('.tip')[0].innerHTML = suffixDisplay();
        } else if (this.gameType == "endings") {
          document.querySelectorAll('.tip')[0].innerHTML = generateExample(game.current);
        } else if (this.gameType == "preps") {
          document.querySelectorAll('.tip')[0].innerHTML = "";
        };
      } else {
        document.querySelectorAll('.tip')[0].innerHTML = "";
      };
    };

    // Hotkey Related Functions >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    setHotkeys() {
      this.setChoiceHotkeys();
      this.setControlHotkeys();
    };
    generateHotkeyList() {
      let hotkeys = this.hotkeys;
      document.querySelectorAll('.choice').forEach(function(choice) {
        hotkeys.push(choice.innerHTML.substr(3))
      });
    };
    setChoiceHotkeys() {
      for (let index = 0, key = 49; index < this.hotkeys.length; index++, key++) {
        window.addEventListener("keyup", function(event) {
          if (event.keyCode == key) game.checkAnswer(game.key.indexOf(game.hotkeys[index]));
        });
      };
    };
    setControlHotkeys() {
      window.addEventListener("keyup", function(event) {
        if (event.keyCode == 13) game.resetFields();
      });
      window.addEventListener("keyup", function(event) {
        if (event.keyCode == 79 && game.gameInfo == false) {
          document.querySelectorAll('.overlay')[0].style.display = "block";
          game.gameInfo = true;
        } else if (event.keyCode == 79 && game.gameInfo == true) {
          document.querySelectorAll('.overlay')[0].style.display = "none";
          game.gameInfo = false;
        };
      });
    };

    // Button Related Functions >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    setButtons() {
      this.setChoiceButtons();
      this.setControlButtons();
    }
    setChoiceButtons() {
      document.querySelectorAll('.choice').forEach(function(choice) {
        choice.onclick = function() { game.checkAnswer(game.key.indexOf(choice.innerHTML.substr(3))) };
      });
    };
    setControlButtons() {
      document.querySelectorAll('.next')[0].onclick = function() {
        game.resetFields();
      };
      document.querySelectorAll('.results')[0].onclick = function() {
        game.displayResults();
      };
      document.querySelectorAll('.info-btn')[0].onclick = function() {
        if (game.gameInfo == false) {
          document.querySelectorAll('.overlay')[0].style.display = "block";
          game.gameInfo = true;
        };
      };
      document.querySelectorAll('.overlay')[0].onclick = function() {
        if (game.gameInfo == true) {
          document.querySelectorAll('.overlay')[0].style.display = "none";
          game.gameInfo = false;
        }
      };
    };
};

class questionRecord {
    constructor() {
      this.record = [];
    };
    addAttempt(guess, solution, word, correctness) {
      let attempt = [guess, solution, word, correctness];
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