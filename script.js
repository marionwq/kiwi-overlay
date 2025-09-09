function getParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadAPI(callback) {
  const server = getParam("server");
  if (!server) return;
  
  fetch(`https://kiwi-overlay-default-rtdb.europe-west1.firebasedatabase.app/server/${server}.json`)
    .then(r => r.json())
    .then(jsonData => callback(jsonData))
    .catch(e => console.error("Errore caricamento dati:", e));
}

function updateOverlay(data) {
  if (!data) return;

  const teams = data.teams;
  const scores = data.scores;
  const dif = data.dif;
  const win = data.win;
  const left = data.left;
  const teamNum = teams.length;

  const container = document.getElementById(`team-num-${teamNum}`);
  if (!container) return;

  container.style.display = "flex";

  container.querySelectorAll(".score").forEach((el, i) => el.innerText = scores[i]);
  container.querySelectorAll(".team-span").forEach((el, i) => el.innerText = teams[i]);

  if (teamNum === 2) {
    const scoreDif = container.querySelector(".score-dif");
    scoreDif.classList.remove("plus", "minus");
    scoreDif.classList.add(dif.startsWith("+") ? "plus" : "minus");
    scoreDif.innerText = dif;

    container.querySelector(".win").style.display = win ? "block" : "none";
    container.querySelector(".left-race").innerText = `残レース:${left}`;
  } else {
    container.querySelectorAll(".dif").forEach((el, i) => el.innerText = `+${scores[i] - (scores[i + 1] || 0)}`);
    container.querySelector(".left-race").innerText = `残${left}`;
  }
}

// Caricamento iniziale e refresh automatico
loadAPI(updateOverlay);
setInterval(() => loadAPI(updateOverlay), 10000);
