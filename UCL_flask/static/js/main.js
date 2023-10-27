document.addEventListener("DOMContentLoaded", function() {
    // Sélectionnez l'élément h1 par son ID
    let monTitre = document.getElementById("mon-titre");
    let monSousTitre = document.getElementById("sous-titre");

    // Modifiez le contenu du titre
    monTitre.textContent = "Le test Javascirpt fonctionne";
    monSousTitre.textContent = "Test affichage boutons selon clic";
});

// Sélectionnez le conteneur des boutons
let boutonContainer = document.getElementById("bouton-container");

// Créez un tableau de noms de boutons
let Winners = ["Napoli", "FC Porto", "FC Bayern", "Tottenham", "Chelsea FC", "Real Madrid", "Man. City", "Benfica"];
let Runners_up = ["Liverpool", "FC	Brugge", "Inter", "Frankfurt", "AC Milan", "Leipzig", "Dortmund", "Paris SG"]

let affichage_winners = true  // pour savoir quel type de boutons est affiché

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
// Fonction qui ajoute les équipes à la section affichant les matchs
let listTeam = document.getElementById("team-list")
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
    // Ajoute la liste des matchs en fonction des clics de l'utilisateur
    let nouvelleSection = document.createElement("div")
    nouvelleSection.id = "container " + String(chosen_team.length)
    nouvelleSection.textContent += bouton.textContent
    listTeam.appendChild(nouvelleSection)
}

// Fait disparaître les boutons quand on clique dessus
for(let i=0; i<boutons_winners.length; i++) {
    boutons_winners[i].addEventListener("click", function (event) {
        if(affichage_winners) {
            let bouton = event.target
            console.log(bouton.textContent)
            console.log(boutons_winners[i])
            disappear_bouton(bouton)
            add_team_to_list_match(bouton)
            affichage_winners = false
        }
    });
}
for(let i=0; i<boutons_runner.length; i++) {
    boutons_runner[i].addEventListener("click", function (event) {
        if(!affichage_winners) {
            let bouton = event.target
            console.log(bouton.textContent)
            disappear_bouton(bouton)
            add_team_to_list_match(bouton)
            affichage_winners = true
        }
    })
}

// Semble ne pas marcher
/*
if(affichage_winners){
    console.log("on entre dans le if")
    for(let i=0; i<boutons_winners.length; i++) {
        boutons_winners[i].addEventListener("click", function (event) {
            let bouton = boutons_winners[i]
            disappear_bouton(bouton)
            add_team_to_list_match(bouton)
            affichage_winners=false
            console.log(i<boutons_runner.length)
        });
    }
}else{
    console.log("On entre dans le else")
    for(let i=0; i<boutons_runner.length; i++) {
        console.log("dans la première boucle")
        boutons_runner[i].addEventListener("click", function (event) {
            let bouton = boutons_runner[i]
            console.log("dans la boucle")
            disappear_bouton(bouton)
            add_team_to_list_match(bouton)
            affichage_winners = true
        })
    }
}
*/
// Touche pour revenir en arrière, enlever la dernière équipe ajoutée
let undo_button = document.getElementById("undo")
undo_button.addEventListener("click", function(event){
    if(chosen_team.length !== 0){
        let last_team_chosen = chosen_team.pop()
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
        let sectionDeleted = document.getElementById("container "+String(chosen_team.length+1))
        sectionDeleted.remove()
    }
})

// Remplie la première ligne du tableau
let table = document.getElementById("proba-table")
let team_line = document.createElement("tr")
let vide = document.createElement("th")
team_line.appendChild(vide)
Winners.forEach(function(name){
    let team = document.createElement("th")
    team.textContent = name
    team_line.appendChild(team)
})
table.appendChild(team_line)

for(let i=0; i<Runners_up.length; i++){
    let line = document.createElement("tr")
    for(let j=0;j<Winners.length+1;j++){
        if(j===0) {
            let team = document.createElement("td")
            team.textContent = Runners_up[i]
            line.appendChild(team)
            console.log("dans le if")
        }else{
            let cell = document.createElement("td")
            cell.textContent = String(i)+String(j)
            line.appendChild(cell)
            console.log("dans le else")
        }
    }
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