// Game Dataset
let AKK = 1, MIX = 2, DAT = 3, GEN = 4;
let key = ["Nominative", "Accusative", "Two-way", "Dative", "Genitive"];
let set = [[1, "bis"], [1, "entlang"], [1, "durch"], [1, "ohne"], [1, "gegen"], [1, "um"], [1, "für"], 
            [2, "an"], [2, "auf"], [2, "in"], [2, "vor"], [2, "hinter"], [2, "über"], [2, "unter"], [2, "neben"], [2, "zwischen"],
            [3, "aus"], [3, "außer"], [3, "bei"], [3, "mit"], [3, "nach"], [3, "seit"], [3, "von"], [3, "zu"], 
            [4, "statt"], [4, "außerhalb"], [4, "innerhalb"], [4, "trotz"], [4, "während"], [4, "wegen"]]; // 30

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