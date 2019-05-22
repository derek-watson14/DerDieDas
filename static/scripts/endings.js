let DER = 0, DIE = 1, DAS = 2;
let key = ["Maskulin", "Feminin", "Neutral"];
let articles = ["der", "die", "das"];
// \[\d, \"[\wä -]+"\],      <-- RegEx to select one entry 

let set =  [[0, "Jahreszeiten", "Sommer"], [0, "Himmelsrichtungen", "Süden"], [0, "Tage", "Freitag"], [0, "Monate", "August"], [0, "-schluss", "Abschluss"], [0, "-schlag", "Umschlag"],  
            [0, "-ismus", "Kapitalismus"], [0, "-ling", "Zwilling"], [0, "-name", "Vorname"], [0, "-gang", "Ausgang"], [0, "-fall", "Unfall"], [0, "-tag", "Nachmittag"], 
            [0, "-zug", "Anzug"], [0, "-ent", "Moment"], [0, "-ich", "Bereich"], [0, "-ist", "Geist"], [0, "-or", "Motor"], [0, "-us", "Bus"], [0, "-er", "Pfeffer"], 
            [0, "-ig", "Essig"], [0, "-er", "Bäcker"], [1, "-schaft", "Freundschaft"], [1, "-nummer", "Hausnummer"], [1, "-heit", "Sicherheit"], [1, "-keit", "Ähnlichkeit"], 
            [1, "-bahn", "Straßenbahn"], [1, "-nis", "Erlaubnis"], [1, "sis", "Basis"] [1, "-ion", "Religion"], [1, "-tät", "Realität"], [1, "-ung", "Prüfung"], [1, "-enz", "Präsenz"], 
            [1, "-anz", "Toleranz"], [1, "-ei", "Brauerei"], [1, "-ie", "Theorie"], [1, "-ik", "Keramik"], [1, "-ur", "Kultur"], [1, "-e", "Seite"], 
            [2, "Nomen Infivitiven", "Laufen"], [2, "-zimmer", "Schlafzimmer"], [2, "-mittel", "Verkehrsmittel"],[2, "-chen", "Mädchen"], [2, "-lein", "Vöglein"], [2, "-ment", "Element"], [2, "-haus", "Hochhaus"],
            [2, "-zeug", "Werkzeug"], [2, "-land", "Heimatland"], [2, "-rad", "Fahrrad"], [2, "-weh", "Heimweh"], [2, "-amt", "Postamt"], [2, "-tum", "Datum"], [2, "-ma", "Thema"], [2, "-ing", "Meeting"]];

let gameType = "endings";
let blank = "";

function generateExample(current) {
  return `z. B. <strong>${articles[current[0]]} ${current[2]}</strong>`;
};

function generateHint(current) {
  return `z. B. "<strong>${current[2]}</strong>"`;  
};

function answerDisplay(answer, correctness) {
  if (correctness) {
    document.querySelectorAll('.blank')[0].innerHTML = `: <em class='correct'>${game.key[answer]}</em>`;
    document.querySelectorAll('.message')[0].innerHTML = `Correct! You chose <em class='correct'>${game.key[answer]}</em>.`;
  } else {
    document.querySelectorAll('.blank')[0].innerHTML = `: <em class='incorrect'>${game.key[game.current[0]]}</em>`;
    document.querySelectorAll('.message')[0].innerHTML = `Incorrect. You chose <em class='incorrect'>${game.key[answer]}</em>.`;
  };
};