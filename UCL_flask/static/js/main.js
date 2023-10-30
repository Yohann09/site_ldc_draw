// Test du chargement des probas:

const resultat = fetch("/static/resultat7.json")
  .then(response => response.json())
  .then(data => {
    console.log(data); // Les données JSON sont disponibles ici
  })
  .catch(error => {
    console.error('Erreur de chargement du fichier JSON :', error);
  });

document.addEventListener("DOMContentLoaded", function() {
    // Sélectionnez l'élément h1 par son ID
    let monTitre = document.getElementById("mon-titre");
    // Modifiez le contenu du titre
    monTitre.textContent = "Tirage UCL";
});

// Sélectionnez le conteneur des boutons
let boutonContainer = document.getElementById("bouton-container");

// Créez un tableau de noms de boutons
let Winners = ["Napoli", "FC_Porto", "FC_Bayern", "Tottenham", "Chelsea_FC", "Real_Madrid", "Man_City", "Benfica"];
let Runners_up = ["Liverpool", "FC_Brugge", "Inter", "Frankfurt", "AC_Milan", "Leipzig", "Dortmund", "Paris_SG"]

let affichage_winners = true  // pour savoir quel type de boutons est affiché

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
    }
    if(i<Runners_up.length){
        let bouton = document.createElement("button");
        bouton.textContent = Runners_up[i];
        bouton.className = "runner_up";
        boutonContainer.appendChild(bouton);
        boutons_runner.push(bouton);
        bouton.style.display="none";
    }
}

// Fonction qui fait disparaître les boutons
function disappear_bouton(bouton){
    bouton.style.display = "none";
}


// Tableau où vont être affiché les matchs
let tableMatch = document.getElementById("match-table")
let tableTitle = document.createElement("caption")
tableTitle.textContent = "Matchs"
tableMatch.appendChild(tableTitle)
for(let i=0;i<Winners.length;i++){
    let new_line = document.createElement("tr")
    for(let j=0;j<3;j++){
        if(j===1){
            let new_cell = document.createElement("td")
            new_cell.textContent = " VS "
            new_line.appendChild(new_cell)
        }else{
            let new_cell = document.createElement("td")
            new_cell.textContent = default_cell_match
            // id pour récupérer ensuite la cellule et en modifier le contenu
            new_cell.id = String(i) +"_"+ String(j)
            new_cell.className = "cell-match-table"
            new_line.appendChild(new_cell)
        }
    }
    new_line.className = "line-match-table"
    tableMatch.appendChild(new_line)
}

// Fonction qui ajoute les équipes au tableau et change les boutons affichés
function add_team_to_list_match(bouton){
    //  Change les boutons
    let list=[]
    let other_list=[]
    if(boutons_winners.includes(bouton)){
        list = boutons_winners
        other_list = boutons_runner     // Peut aussi se faire avec affichage_winners dans la condition
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
        button.style.display="block"
    })
    chosen_team.push(bouton)    // Rajoute l'équipe dans les équipes choisies
    // Illumine la colonne en jaune
    let selecteur = "."+bouton.textContent
    let colorChange = document.querySelectorAll(selecteur)
    colorChange.forEach(function (element){
        element.style.backgroundColor = "#fdfd68"
    })
    // Ajoute la liste des matchs en fonction des clics de l'utilisateur
    let number = chosen_team.length
    let i = 1+(-1)**(number%2)
    let j = Math.floor((number-1)/2)
    let cell = document.getElementById(String(j)+"_"+String(i))
    cell.textContent=bouton.textContent
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

        colorChange.forEach(function (element){
            let chosen_team_text = []
            chosen_team.forEach(function(button){
                chosen_team_text.push(button.textContent)
            })
            console.log(element.classList)
            if(element.classList.length === 3) {
                let team_test = "defaut"
                if (element.classList[1] === last_team_chosen.textContent) {
                    team_test = element.classList[2]
                    console.log(team_test)
                } else {
                    team_test = element.classList[1]
                    console.log(team_test)
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
        //let sectionDeleted = document.getElementById("container "+String(chosen_team.length+1))
        //sectionDeleted.remove()
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
    team.textContent = name
    team.className = "team-cell " + name  // ajoute une classe pour que la cellule s'illumine quand équipe sélectionnée
    team_line.appendChild(team)
})
team_line.className = "team-line"
table.appendChild(team_line)
// Rempli le reste du tableau par des nombres arbitraire pour l'instant
for(let i=0; i<Runners_up.length; i++){
    let line = document.createElement("tr")
    for(let j=0;j<Winners.length+1;j++){
        if(j===0) {
            let team = document.createElement("td")
            team.textContent = Runners_up[i]
            team.className = "cell-team " + Runners_up[i] // ajoute une classe pour que la cellule s'illumine quand équipe sélectionnée
            line.appendChild(team)
        }else{
            let cell = document.createElement("td")
            cell.textContent = String(i)+String(j)
            cell.className = "proba-cell " + Winners[j-1] +" "+ Runners_up[i] // ajoute une classe pour que la cellule s'illumine quand équipe sélectionnée
            line.appendChild(cell)
        }
    }
    line.className = "proba-line"
    table.appendChild(line)
}

/* Différente manière de changer la valeur des boutons
boutons.forEach(function(bouton){
    bouton.addEventListener("click", function(event){
    bouton.textContent = "Nouveau nom"});
})
function test(bouton) {
    let nouveau_texte = String(10)
    bouton.textContent += nouveau_texte + "__"
}*/