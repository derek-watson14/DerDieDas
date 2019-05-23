// Game Dataset
let key = ["Accusative", "Dative", "Two-way", "Genitive"];
let set = [[0, "bis"], [0, "entlang"], [0, "durch"], [0, "ohne"], [0, "gegen"], [0, "um"], [0, "für"], 
            [1, "aus"], [1, "außer"], [1, "bei"], [1, "mit"], [1, "nach"], [1, "seit"], [1, "von"], [1, "zu"], 
            [2, "an"], [2, "auf"], [2, "in"], [2, "vor"], [2, "hinter"], [2, "über"], [2, "unter"], [2, "neben"], [2, "zwischen"],
            [3, "statt"], [3, "außerhalb"], [3, "innerhalb"], [3, "trotz"], [3, "während"], [3, "wegen"]]; // 20

let gameType = "preps";
let blank = "ist _____";

function answerDisplay(answer, correctness) {
  if (correctness) {
    document.querySelectorAll('.blank')[0].innerHTML = `ist <em class='correct'>${game.key[answer]}</em>`;
    document.querySelectorAll('.message')[0].innerHTML = `Correct! You chose <em class='correct'>${game.key[answer]}</em>.`;
  } else {
    document.querySelectorAll('.blank')[0].innerHTML = `ist <em class='incorrect'>${game.key[game.current[0]]}</em>`;
    document.querySelectorAll('.message')[0].innerHTML = `Incorrect. You chose <em class='incorrect'>${game.key[answer]}</em>.`;
  };
};