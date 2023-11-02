// Test du chargement des probas:

let xhr = new XMLHttpRequest();
xhr.overrideMimeType("application/json");
xhr.open("GET", "/static/resultat.json", false); // Notez-le "false" pour le mode synchrone
xhr.send();

let resultat;

if (xhr.status === 200) {
  resultat = JSON.parse(xhr.responseText);
  // Je peux maintenant utiliser myJSONData dans le reste du code
  console.log(resultat);
} else {
  console.error('Erreur de chargement du fichier JSON');
}

//console.log(resultat["('Liverpool', 'Brugge', 'Inter', 'Frankfurt', 'AC Milan', 'Leipzig', 'Dortmund', 'PSG'), ('Napoli', 'Porto', 'Bayern', 'Tottenham', 'Chelsea', 'Real Madrid', 'Manchester City', 'Benfica')"]["Brugge, Napoli, Dortmund"])

/*
let jsonData = null;

async function fetchData() {
  try {
    const response = await fetch("/static/resultat.json");
    jsonData = await response.json();
  } catch (error) {
    console.error('Erreur de chargement du fichier JSON :', error);
  }
}

async function main() {
  if (jsonData === null) {
    await fetchData();
  }
  return jsonData;
}

async function accederAuJson(indice,indice2) {
  const resultat = await main();
  const valeur = resultat[indice][indice2];
  return valeur;
}*/

// Nouveau test
/*
function loadJSONFile(url, callback) {
  let xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
}

let myJSONData; // Variable pour stocker le JSON

loadJSONFile("/static/resultat.json", function (data) {
  myJSONData = data;
  // Vous pouvez effectuer des opérations avec myJSONData ici
    console.log(myJSONData)
});
console.log(myJSONData)*/
// Test d'utilisation de la fonction accéder au JSON
/*
accederAuJson("('Liverpool', 'Brugge', 'Inter', 'Frankfurt', 'AC Milan', 'Leipzig', 'Dortmund', 'PSG'), ('Napoli', 'Porto', 'Bayern', 'Tottenham', 'Chelsea', 'Real Madrid', 'Manchester City', 'Benfica')", "Brugge, Napoli, Dortmund")
  .then(valeur => {
    console.log(valeur);
  })
  .catch(error => {
    console.error('Erreur :', error);
  });


async function afficherValeurDansCellule(celluleId,indice,indice2) {
  const valeur = await accederAuJson(indice,indice2);

  // Obtenez la référence de la cellule par son ID
  const cellule = document.getElementById(celluleId);

  // Assurez-vous que la cellule existe
  if (cellule) {
    // Affectez la valeur à la cellule
      let nombre = valeur*100;
      let nombre_arrondi = nombre.toFixed(2)
      cellule.textContent = String(nombre_arrondi)+" %";
  } else {
      console.error("La cellule n'existe pas.");
  }
}
*/


////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function() {
    // Sélectionnez l'élément h1 par son ID
    let monTitre = document.getElementById("mon-titre");
    // Modifiez le contenu du titre
    monTitre.textContent = "Tirage";
});

// Sélectionnez le conteneur des boutons
let boutonContainer = document.getElementById("bouton-container");

// Nom des équipes en un morceau plus pratique à manipuler
let Winners = ["Napoli", "Porto", "Bayern", "Tottenham", "Chelsea", "Real_Madrid", "Manchester_City", "Benfica"];
let Runners_up = ["Liverpool", "Brugge", "Inter", "Frankfurt", "AC_Milan", "Leipzig", "Dortmund", "PSG"]
// Liste des équipes comme elles sont écrites dans le fichier resultat.json
let runners_resultat = ['Liverpool', 'Brugge', 'Inter', 'Frankfurt', 'AC Milan', 'Leipzig', 'Dortmund', 'PSG']
let winners_resultat = ['Napoli', 'Porto', 'Bayern', 'Tottenham', 'Chelsea', 'Real Madrid', 'Manchester City', 'Benfica']
let affichage_winners = false  // pour savoir quel type de boutons est affiché

const default_cell_match = "........."

// Crée et ajoute les boutons au conteneur
let boutons_winners = []    // Ce sont les boutons qui sont toujours affichés sur le site
let boutons_runner = []     // cad les équipes qui n'ont pas été choisies
let chosen_team = []   // Crée la liste des équipes choisies qui sert pour l'instant pour le undo

// Initialise tous les boutons et affiche dans un premier temps les winners
let taille_boucle = Math.max(Winners.length,Runners_up.length)
for(let i=0; i<taille_boucle;i++){
    if(i<Winners.length){
        let bouton = document.createElement("button");
        bouton.textContent = Winners[i];
        bouton.className = "winner";
        boutonContainer.appendChild(bouton);
        boutons_winners.push(bouton);
        bouton.style.display="none";
    }
    if(i<Runners_up.length){
        let bouton = document.createElement("button");
        bouton.textContent = Runners_up[i];
        bouton.className = "runner_up";
        boutonContainer.appendChild(bouton);
        boutons_runner.push(bouton);

    }
}

// Fonction qui fait disparaître les boutons
function disappear_bouton(bouton){
    bouton.style.display = "none";
}

// Fonction qui change uppercase par espace
function change_bySpace(word){
    const new_word = word.replace(/_/g, ' ');
    return new_word;
}

// Fonction qui change la valeur de la cellule
function change_proba(cell,index,index2){
    if(cell){
        let nombre = resultat[index][index2]
        nombre = 100*nombre
        cell.textContent = String(nombre.toFixed(2))+"%"
    }else{
        console.log("erreur dans change proba")
    }
}

function verif_zero(){
    for(let i=0;i<Winners.length;i++){
        for(let j=0;j<Runners_up.length;j++){
            let id = Runners_up[i]+" "+Winners[j]
            let cell = document.getElementById(id)
            let content = cell.textContent
            let number = parseFloat(content.slice(0,-1))
            if(number===0){
                cell.style.backgroundColor = "rgba(138, 138, 138, 0.52)"
            }
        }
    }
    let max_index;
    if(chosen_team.length%2===0){max_index=chosen_team.length}
    else{max_index=chosen_team.length-1}
    for(let i=0;i<max_index/2;i++){
        let id = chosen_team[2*i].textContent+" "+chosen_team[2*i+1].textContent
        let cell = document.getElementById(id)
        cell.style.backgroundColor = "#50f3db"
        cell.textContent= "Match"
    }
}

function change_graphism(){
    // Illumine la colonne en jaune
    if(chosen_team.length%2===1){
        let last_team = chosen_team[chosen_team.length-1]
        let selecteur = "."+last_team.textContent
        let colorChange = document.querySelectorAll(selecteur)
        colorChange.forEach(function (element){
            element.style.backgroundColor = "rgba(253,253,104,0.82)"
        })
        if(chosen_team.length>1){
            for(let i=0; i<chosen_team.length-1;i++){
                let bouton = chosen_team[i]
                let selecteur = "."+bouton.textContent
                let colorChange = document.querySelectorAll(selecteur)
                let j=0
                colorChange.forEach(function (element){
                    if(j>0){
                        element.style.backgroundColor = "transparent"
                        element.textContent = "0.00%"
                    }else{
                        element.style.backgroundColor = "transparent"
                    }
                    j++
                })
            }
        }
    }else{
        for(let j=0;j<chosen_team.length;j++){
            let bouton = chosen_team[j]
            let selecteur = "."+bouton.textContent
            let colorChange = document.querySelectorAll(selecteur)
            let i=0
            colorChange.forEach(function (element){
                if(i>0){
                    element.style.backgroundColor = "transparent"
                    element.textContent = "0.00%"
                }else{
                    element.style.backgroundColor = "transparent"
                }
                i++
            })
        }
    }
}

function remove(list,elt_to_delete){
    let index = list.indexOf(elt_to_delete)
    list.splice(index, 1)
}
function remove_from_list(){ // Utilise les variables globales
    let runner = []
    let winner = []
    let max_index;
    runners_resultat.forEach(function(name){    // On copie les listes
        runner.push(name)
    })
    winners_resultat.forEach(function(name){
        winner.push(name)
    })
    if(chosen_team.length%2 === 1){max_index = chosen_team.length-1}
    else{max_index = chosen_team.length}
    for(let i=0;i<max_index;i++) {
        let name = change_bySpace(chosen_team[i].textContent)
        if (runner.includes(name)) {
            remove(runner, name)
        } else if (winner.includes(name)) {
            remove(winner, name)
        }else{console.log("on est dans le else avec: "+name)}
    }
    let index = "('" + runner[0] + "'"
    for(let i=1;i<runner.length-1;i++){
        index += ", '"+ runner[i]+"'"
    }
    index+= ", '"+runner[runner.length-1] +"'), ("
    index += "'"+winner[0]+"'"
    for(let i=1;i<winner.length-1;i++){
        index += ", '"+ winner[i]+"'"
    }
    index+= ", '"+winner[winner.length-1] +"')"
    return index
}

function give_index2(winner,runner){ // Utilise des variables globales
    let index2 = change_bySpace(runner)+", "+change_bySpace(winner);
    if(affichage_winners){
        index2+=", "+change_bySpace(chosen_team[chosen_team.length-1].textContent)
    }
    return index2
}
function change_all(){
    for(let i=0;i<Winners.length;i++){
        for(let j=0;j<Runners_up.length;j++){
            let id = Runners_up[i]+" "+Winners[j]
            let cell = document.getElementById(id)
            let index = remove_from_list()
            //console.log(index)
            let index2 = give_index2(Winners[j],Runners_up[i])
            // console.log(index2)
            change_proba(cell,index,index2)
        }
    }
}

// Tableau où vont être affiché les matchs
let tableMatch = document.getElementById("match-table")
let tableTitle = document.createElement("caption")
tableTitle.textContent = "Matchs"
//tableMatch.insertBefore(tableTitle,tableMatch)
for(let i=-1;i<Winners.length;i++){
    let new_line = document.createElement("tr")
    if(i===-1){
        let new_cell = document.createElement("td")
        new_cell.textContent = "Matchs"
        new_cell.style.backgroundColor = "lightblue"
        new_cell.style.textAlign = 'center';
        new_line.appendChild(new_cell)
        tableMatch.appendChild(new_line)
    }else {
        for (let j = 0; j < 3; j++) {
            if (j === 1) {
                let new_cell = document.createElement("td")
                new_cell.textContent = " VS "
                new_line.appendChild(new_cell)
            } else {
                let new_cell = document.createElement("td")
                new_cell.textContent = default_cell_match
                // id pour récupérer ensuite la cellule et en modifier le contenu
                new_cell.id = String(i) + "_" + String(j)
                new_cell.className = "cell-match-table"
                new_line.appendChild(new_cell)
            }
        }
        new_line.className = "line-match-table"
        tableMatch.appendChild(new_line)
    }
}

// Fonction qui ajoute les équipes au tableau et change les boutons affichés
function add_team_to_list_match(bouton){
    //  Change les boutons
    let list=[]
    let other_list=[]
    if(boutons_winners.includes(bouton)){  // if affichage_winners
        list = boutons_winners
        other_list = boutons_runner    // Peut aussi se faire avec affichage_winners dans la condition
    }else{
        list = boutons_runner
        other_list = boutons_winners
    }
    let index = list.indexOf(bouton)
    list.splice(index, 1)     // On enlève l'équipe des équipes à proposer
    affichage_winners = !affichage_winners  // on affiche les autres équipes
    list.forEach(function(button){
        disappear_bouton(button)
    })
    other_list.forEach(function(button){
        // Si la proba du texte de ce button avec le dernier choisi: bouton est de 0 alors on n'affiche pas le button
        // car le match ne peut pas avoir lieu et donc pas de calcul de proba
        if(affichage_winners) {  // on vérifie que le bouton est un runner, dans ce cas on peut pas afficher tous les winners
            let cellule = document.getElementById(bouton.textContent+" "+button.textContent)
            let proba = parseFloat(cellule.textContent)
            if(proba !== 0){
                button.style.display="block"
            }
        }
        else{button.style.display="block"}
    })
    chosen_team.push(bouton)    // Rajoute l'équipe dans les équipes choisies
    // J'actualise toutes les probas
    if(chosen_team.length<Runners_up.length+Winners.length-3) {
        change_all()
    }
    change_graphism()
    // Ajoute la liste des matchs en fonction des clics de l'utilisateur
    let number = chosen_team.length
    let i = 1+(-1)**(number%2)
    let j = Math.floor((number-1)/2)
    let cell = document.getElementById(String(j)+"_"+String(i))
    cell.textContent=bouton.textContent
    verif_zero()
}
// Fait disparaître les boutons quand on clique dessus et les ajoute à liste des matchs
for(let i=0; i<boutons_winners.length; i++) {
    boutons_winners[i].addEventListener("click", function (event) {
        if(affichage_winners) {
            let bouton = event.target
            disappear_bouton(bouton)
            add_team_to_list_match(bouton)
            affichage_winners = false
        }
    });
} // Même utilité pour cette boucle
for(let i=0; i<boutons_runner.length; i++) {
    boutons_runner[i].addEventListener("click", function (event) {
        if(!affichage_winners) {
            let bouton = event.target
            disappear_bouton(bouton)
            add_team_to_list_match(bouton)
            affichage_winners = true
        }
    })
}

// Touche pour revenir en arrière, enlever la dernière équipe ajoutée
let undo_button = document.getElementById("undo")
undo_button.addEventListener("click", function(event){
    if(chosen_team.length !== 0){
        let last_team_chosen = chosen_team.pop()
        let selecteur = "."+last_team_chosen.textContent
        let colorChange = document.querySelectorAll(selecteur)
        // Pour enlever le surlignage
        colorChange.forEach(function (element){
            let chosen_team_text = []
            chosen_team.forEach(function(button){
                chosen_team_text.push(button.textContent)
            })
            if(element.classList.length === 3) {
                let team_test = "defaut"
                if (element.classList[1] === last_team_chosen.textContent) {
                    team_test = element.classList[2]
                } else {
                    team_test = element.classList[1]
                }
                if (!(chosen_team_text.includes(team_test))) {
                    element.style.backgroundColor = "transparent"
                }
            }else if(element.classList.length===2){element.style.backgroundColor = "transparent"}
        })
        //last_team_chosen.style.display = "block"    // on affiche de nouveau l'équipe
        if(affichage_winners){
            boutons_runner.push(last_team_chosen)   // on la remet dans la liste des boutons affichés correspondante
        }else{
            boutons_winners.push(last_team_chosen)
        }
        affichage_winners = !affichage_winners      // on rebascule sur l'affichage des autres teams
        boutons_winners.forEach(function(bouton){   // on change les modes d'affichage des boutons
            if(affichage_winners){
                bouton.style.display="block"
            }else{
                disappear_bouton(bouton)
            }
        })
        boutons_runner.forEach(function(bouton){
            if(!affichage_winners){
                bouton.style.display="block"
            }else{
                disappear_bouton(bouton)
            }
        })
        let number = chosen_team.length + 1     // On enlève les équipes du tableau
        let i = 1+(-1)**(number%2)
        let j = Math.floor((number-1)/2)
        let cell = document.getElementById(String(j)+"_"+String(i))
        cell.textContent= default_cell_match
        change_all()
        change_graphism()
        verif_zero()
    }
})

// Rempli le tableau des probas
// Rempli la première ligne avec les équipes
let table = document.getElementById("proba-table")
let team_line = document.createElement("tr")
let vide = document.createElement("th")
team_line.appendChild(vide)
Winners.forEach(function(name){
    let team = document.createElement("th")
    team.textContent = change_bySpace(name)
    team.className = "team-cell " + name  // ajoute une classe pour que la cellule s'illumine quand équipe sélectionnée
    team_line.appendChild(team)
})
team_line.className = "team-line"
table.appendChild(team_line)
// Rempli le reste du tableau par les probas initiales
for(let i=0; i<Runners_up.length; i++){
    let line = document.createElement("tr")
    for(let j=0;j<Winners.length+1;j++){
        if(j===0) {
            let team = document.createElement("td")
            team.textContent = change_bySpace(Runners_up[i])
            team.className = "cell-team " + Runners_up[i] // ajoute une classe pour que la cellule s'illumine quand équipe sélectionnée
            line.appendChild(team)
        }else{
            let cell = document.createElement("td")
            // cell.textContent = String(i)+String(j)   // ce que je faisais avant de mettre les probas
            // code pour l'id des cellules de proba: runners_up en premier, puis winner séparé par un espace
            cell.id =  Runners_up[i]+" "+ Winners[j-1]
            cell.className = "proba-cell " + Winners[j-1] +" "+ Runners_up[i] // ajoute une classe pour que la cellule s'illumine quand équipe sélectionnée
            console.log(cell.id)
            change_proba(cell,"('Liverpool', 'Brugge', 'Inter', 'Frankfurt', 'AC Milan', 'Leipzig', 'Dortmund', 'PSG'), ('Napoli', 'Porto', 'Bayern', 'Tottenham', 'Chelsea', 'Real Madrid', 'Manchester City', 'Benfica')",change_bySpace(Runners_up[i])+", "+change_bySpace(Winners[j-1]))
            line.appendChild(cell)
        }
    }
    line.className = "proba-line"
    table.appendChild(line)
}
verif_zero()


/* Différente manière de changer la valeur des boutons
boutons.forEach(function(bouton){
    bouton.addEventListener("click", function(event){
    bouton.textContent = "Nouveau nom"});
})
function test(bouton) {
    let nouveau_texte = String(10)
    bouton.textContent += nouveau_texte + "__"
}*/