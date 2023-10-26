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
let nomsBoutons = ["Real", "Man. City", "Bayern"];

// Crée et ajoute les boutons au conteneur
let boutons = []
let chosen_team = []   // Crée la liste des équipes choisies qui sert pour l'instant pour le undo
// Crée et affiche les boutons, leur donne un nom, et les ajoute aux listes de boutons
nomsBoutons.forEach(function(nom) {
    let bouton = document.createElement("button");
    bouton.textContent = nom;
    boutonContainer.appendChild(bouton);
    boutons.push(bouton)
});


// Fait disparaître les boutons quand on clique dessus
for(let i=0; i<boutons.length; i++) {
    boutons[i].addEventListener("click", function (event) {
        boutons[i].style.display = "none";
        //boutons[i].textContent = boutons[i].textContent + "_"
        chosen_team.push(boutons[i])
    });
}
// Touche pour revenir en arrière
let undo_button = document.getElementById("undo")
undo_button.addEventListener("click", function(event){
    if(chosen_team.length !== 0){
        let last_team_chosen = chosen_team.pop()
        last_team_chosen.style.display = "block"
    }
})


/* Boucle qui change le nom des boutons après un clic
for(let i=0; i<boutons.length; i++){
    boutons[i].addEventListener("click", function(event){
        if(i===0) {
            boutons[i].textContent = "Bouton" + String(i+1);
        }else{
            boutons[i].textContent = "Equipe" + String(i+1)};
        });
}*/
/* Différente manière de changer la valeur des boutons
boutons.forEach(function(bouton){
    bouton.addEventListener("click", function(event){
    bouton.textContent = "Nouveau nom"});
})
function test(bouton) {
    let nouveau_texte = String(10)
    bouton.textContent += nouveau_texte + "__"
}*/