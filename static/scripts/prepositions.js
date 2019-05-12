// Game Dataset
let AKK = 1, MIX = 2, DAT = 3, GEN = 4;
let key = ["nominative", "accusative", "two-way", "dative", "genitive"];
let set = [[1, "bis"], [1, "entlang"], [1, "durch"], [1, "ohne"], [1, "gegen"], [1, "um"], [1, "für"], 
            [2, "an"], [2, "auf"], [2, "in"], [2, "vor"], [2, "hinter"], [2, "über"], [2, "unter"], [2, "neben"], [2, "zwischen"],
            [3, "aus"], [3, "außer"], [3, "bei"], [3, "mit"], [3, "nach"], [3, "seit"], [3, "von"], [3, "zu"], 
            [4, "statt"], [4, "außerhalb"], [4, "innerhalb"], [4, "trotz"], [4, "während"], [4, "wegen"]]; // 30
let setSize = set.length;
let gameType = "preps";
let blank = "ist _____";

// Event Listeners: 
document.querySelectorAll('.akk')[0].onclick = function() {
  checkAnswer(AKK, key);
};

document.querySelectorAll('.mix')[0].onclick = function() {
  checkAnswer(MIX, key);
};

document.querySelectorAll('.dat')[0].onclick = function() {
  checkAnswer(DAT, key);
};

document.querySelectorAll('.gen')[0].onclick = function() {
  checkAnswer(GEN, key);
};

addEventListener("keyup", function(event) {
  if (event.keyCode === 13) resetFields();
  else if (event.keyCode === 49) checkAnswer(AKK, key);
  else if (event.keyCode === 50) checkAnswer(DAT, key);
  else if (event.keyCode === 51) checkAnswer(MIX, key);
  else if (event.keyCode === 52) checkAnswer(GEN, key);
});