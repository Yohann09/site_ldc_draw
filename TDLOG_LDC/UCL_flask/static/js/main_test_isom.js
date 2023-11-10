
/*
    Fichier où j'essaie d'utiliser le fichier de résultat isom
*/

/////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function() {
    // Sélectionnez l'élément h1 par son ID
    let monTitre = document.getElementById("mon-titre");
    // Modifiez le contenu du titre
    monTitre.textContent = "Tirage test isom";
});

// Sélectionne le conteneur des boutons des équipes
let boutonContainer = document.getElementById("bouton-container");
let buttonTeamContainer = document.createElement("div")
buttonTeamContainer.id = "team-button"
boutonContainer.appendChild(buttonTeamContainer)
let nameSection = document.createElement("p")
nameSection.id = "section-team-button"
nameSection.textContent = "Draw teams: "
buttonTeamContainer.appendChild(nameSection)

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
        bouton.textContent = change_bySpace(Winners[i]);
        bouton.className = "winner";
        buttonTeamContainer.appendChild(bouton);
        boutons_winners.push(bouton);
        bouton.style.display="none";
    }
    if(i<Runners_up.length){
        let bouton = document.createElement("button");
        bouton.textContent = change_bySpace(Runners_up[i]);
        bouton.className = "runner_up";
        buttonTeamContainer.appendChild(bouton);
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

function changeSpaceby_(word){
    const new_word = word.replace(/\s/g,'_')
    return new_word
}


// Fonction qui change la valeur de la cellule
function change_proba(cell,index,index2, aff_cond){
    fetch('/proba', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'team_to_remove': index, 'teams_match': index2})
            })
            .then(response => response.json())
            .then(data => {
                if (data.resultat) {
                    let nombre = data.resultat
                    if(nombre===-2){
                    cell.textContent = String(0)+"%"
                    }else{
                    //nombre = 100*nombre
                    cell.textContent = String(nombre)+"%"//.toFixed(2))+"%"
                    }
                } else {
                    cell.textContent = 'Erreur';
                }
            });
}

// Fonction asynchrone qui change les valeurs de toutes les cellules
function proba_all(){
    let index= []
    chosen_team.forEach(function (button){
        index.push(change_bySpace(button.textContent))
    })
    let request = new XMLHttpRequest();
    request.open('POST', '/proba_all', false);  // false indique une requête synchrone
    request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    request.send(JSON.stringify(index));

    if (request.status === 200) {
        // Traitement des données si la requête est réussie
        let responseData = JSON.parse(request.responseText);
        let dict = responseData
        for (let i = 0; i < Winners.length; i++) {
            for (let j = 0; j < Runners_up.length; j++) {
                let id = Runners_up[i] + " " + Winners[j]
                let cell = document.getElementById(id)
                console.log(runners_resultat[i]+winners_resultat[j] + ": "+dict[runners_resultat[i]][winners_resultat[j]])
                cell.textContent = String(dict[runners_resultat[i]][winners_resultat[j]]) + "%"
            }
        }
    } else {
        // Gérer les erreurs ici
        console.error('Erreur lors de la requête:', request.statusText);
    }
}
function proba_hybride(){
    let index= []
    chosen_team.forEach(function (button){
        index.push(change_bySpace(button.textContent))
    })
    fetch('/proba_all', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'team_to_remove': index })
    })
    .then(response => response.json())
            .then(data => {
                if (data.resultat) {
                    let dict = data.resultat
                    for (let i = 0; i < Winners.length; i++) {
                        for (let j = 0; j < Runners_up.length; j++) {
                            let id = Runners_up[i] + " " + Winners[j]
                            let cell = document.getElementById(id)
                            console.log(runners_resultat[i]+winners_resultat[j] + ": "+dict[runners_resultat[i]][winners_resultat[j]])
                            cell.textContent = String(dict[runners_resultat[i]][winners_resultat[j]]) + "%"
                        }
                    }
                }
                verif_zero()
            })
}

function verif_zero(){
    for(let i=0;i<Winners.length;i++){
        for(let j=0;j<Runners_up.length;j++){
            let id = Runners_up[i]+" "+Winners[j]
            let cell = document.getElementById(id)
            let content = cell.textContent
            let number = parseFloat(content.slice(0,-1))
            console.log(number)
            if(number===0){
                cell.style.backgroundColor = "rgb(182,182,182)"
            }
        }
    }
    let max_index;
    if(chosen_team.length%2===0){max_index=chosen_team.length}
    else{max_index=chosen_team.length-1}
    for(let i=0;i<max_index/2;i++){
        let id = changeSpaceby_(chosen_team[2*i].textContent)+" "+changeSpaceby_(chosen_team[2*i+1].textContent)
        let cell = document.getElementById(id)
        cell.style.backgroundColor = "#50f3db"
        cell.textContent= "Match"
    }
}

function change_graphism(){
    // Illumine la colonne en jaune
    if(chosen_team.length%2===1){
        let last_team = chosen_team[chosen_team.length-1]
        let selecteur = "."+changeSpaceby_(last_team.textContent)
        let colorChange = document.querySelectorAll(selecteur)
        colorChange.forEach(function (element){
            element.style.backgroundColor = "rgba(255,255,112,0.93)"
        })
        if(chosen_team.length>1){
            for(let i=0; i<chosen_team.length-1;i++){
                let bouton = chosen_team[i]
                let selecteur = "."+changeSpaceby_(bouton.textContent)
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
            let selecteur = "."+changeSpaceby_(bouton.textContent)
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
    let runner_winner= []
    chosen_team.forEach(function (button){
        runner_winner.push(change_bySpace(button.textContent))
    })
    return runner_winner
}

function give_index2(winner,runner){ // Utilise des variables globales
    let index2 = []
    index2.push(change_bySpace(String(runner)))
    index2.push(change_bySpace(String(winner)))
    if(affichage_winners){
        index2.push(change_bySpace(chosen_team[chosen_team.length-1].textContent))
    }
    return index2
}
function change_all(){
    // Il faut que je fasse une fonction renvoyant les équipes à remove soit les équipes de chosen_team
    // en enlevant peut être la dernière
    for(let i=0;i<Winners.length;i++){
        for(let j=0;j<Runners_up.length;j++){
            let id = Runners_up[i]+" "+Winners[j]
            let cell = document.getElementById(id)
            //console.log(cell.id)
            let index = remove_from_list() // renvoie la liste complète des équipes à remove dans proba_single
            //console.log(index)
            let index2 = give_index2(Winners[j],Runners_up[i])
            //console.log(index2)
            let aff_cond = false;
            if(chosen_team.length%2===1){aff_cond=true}
            change_proba(cell,index,index2,aff_cond)
        }
    }
}

// Tableau où vont être affiché les matchs
let tableMatch = document.getElementById("match-table")
for(let i=0;i<Winners.length;i++){
    let new_line = document.createElement("th")
    for (let j = 0; j < 3; j++) {
        if (j === 1) {
            let new_cell = document.createElement("td")
            new_cell.textContent = " VS "
            new_cell.className = "cell-center"
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
            let cellule = document.getElementById(changeSpaceby_(bouton.textContent)+" "+changeSpaceby_(button.textContent))
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
        //change_all()
        proba_hybride()
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
let optionsContainer = document.createElement("div")
optionsContainer.id="options-container"
boutonContainer.appendChild(optionsContainer)
let undo_button = document.createElement("button")
undo_button.id="undo"
undo_button.textContent="Undo"
optionsContainer.appendChild(undo_button)
let undoSection = document.createElement("p")
undoSection.id ="undo-name-section"
undoSection.textContent="Options: "
optionsContainer.appendChild(undoSection)
undo_button.addEventListener("click", function(event){
    if(chosen_team.length !== 0){
        let last_team_chosen = chosen_team.pop()
        let selecteur = "."+changeSpaceby_(last_team_chosen.textContent)
        let colorChange = document.querySelectorAll(selecteur)
        // Pour enlever le surlignage
        colorChange.forEach(function (element){
            let chosen_team_text = []
            chosen_team.forEach(function(button){
                chosen_team_text.push(changeSpaceby_(button.textContent))
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
        //change_all()
        proba_hybride()
        change_graphism()
        verif_zero()
    }
})

// ------------------------- Test du bouton restart -------------------- //
let restart_button = document.createElement("button")
restart_button.id = "restart-button"
restart_button.textContent = "Restart"
undoSection.appendChild(restart_button)
restart_button.addEventListener("click",function(event){
    let chosen_team_name=[]
    chosen_team.forEach(function(button){
        chosen_team_name.push(button.textContent)
    })
    fetch('/proba', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'liste': chosen_team_name})
            })
            .then(response => response.json())
            .then(data => {
                if (data.resultat) {
                    console.log("Je suis dans la boucle")
                    document.getElementById('restart-button').textContent = data.resultat;
                    console.log("ID du truc")
                } else {
                    document.getElementById('restart-button').textContent = 'Erreur';
                }
            });
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
            //change_proba(cell,"('Liverpool', 'Brugge', 'Inter', 'Frankfurt', 'AC Milan', 'Leipzig', 'Dortmund', 'PSG'), ('Napoli', 'Porto', 'Bayern', 'Tottenham', 'Chelsea', 'Real Madrid', 'Manchester City', 'Benfica')",change_bySpace(Runners_up[i])+", "+change_bySpace(Winners[j-1]))
            cell.textContent = -1
            line.appendChild(cell)
        }
    }
    line.className = "proba-line"
    table.appendChild(line)
}
//change_all()
proba_all()

