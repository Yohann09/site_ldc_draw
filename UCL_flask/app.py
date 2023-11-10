from flask import Flask, render_template, request, jsonify
from using_isom import *
import json

app = Flask(__name__, static_url_path='/static')

# test

fileObject = open("static/isom.json", "r")
jsonContent = fileObject.read()
data = json.loads(jsonContent)

#print(obj_python["[[1, 1, 1, 1, 1, 1, 1, 0], [1, 1, 0, 1, 0, 0, 0, 1], [1, 0, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 0, 1, 1], [1, 0, 1, 0, 0, 1, 1, 1], [1, 0, 1, 0, 1, 1, 1, 1], [1, 0, 0, 1, 1, 1, 1, 1], [0, 1, 1, 1, 1, 1, 1, 1]]"]["0, 4, 1"])

#G_init.remove_1t("Dortmund")
#G_init.remove_1t("Benfica")
"""
G_init.remove_2t("Dortmund","Benfica")
matrix = G_init.convert()
q, mat1, perm_row, perm_col = G_init.isom(matrix)
index_liv = G_init.index_eq_runner("Liverpool", perm_col)
index_nap = G_init.index_eq_winner("Porto", perm_row)

index_dort = G_init.index_eq_runner("Dortmund",perm_col)

print(data[f"{mat1}"][f"{index_liv}, {index_nap}"])"""

runners_resultat = ['Liverpool', 'Brugge', 'Inter', 'Frankfurt', 'AC Milan', 'Leipzig', 'Dortmund', 'PSG']
winners_resultat = ['Napoli', 'Porto', 'Bayern', 'Tottenham', 'Chelsea', 'Real Madrid', 'Manchester City', 'Benfica']
number = len(runners_resultat)
dict_proba = {}
for i in range(number):
    dict_proba[runners_resultat[i]] = {}
    for j in range(number):
        dict_proba[runners_resultat[i]][winners_resultat[j]] = -1

def intialisation(g):
    for team in teams:
        if team.rank() == 1:
            ensemble = "winner"
            g.add_winner(team.name())
            winners.append(team)
        else:
            ensemble = "runner_up"
            g.add_runner_up(team.name())
            runners_up.append(team)
        g.add_vertex(team, ensemble)
    for team1 in winners:
        for team2 in runners_up:
            if team1.country() != team2.country() \
                    and team1.group() != team2.group() \
                    and team1.rank() != team2.rank():
                g.add_edge(team1, team2)

@app.route("/proba_all", methods=["POST"])  # renvoie un dictionnaire entier avec les probas
def proba_all():
    graphe = GraphBipartite([])
    intialisation(graphe)
    donnee = request.get_json()
    teams_to_remove = donnee["team_to_remove"]
    # j'ai juste besoin de savoir s'il y a une proba conditionnelle, donc voir s'il y a une équipe ou pas
    for i in range(int(len(teams_to_remove)/2)):
        G_init.remove_2t(f"{teams_to_remove[2 * i]}", f"{teams_to_remove[2 * i + 1]}")
    matrix = graphe.convert()
    mat1, perm_row, perm_col = graphe.isom(matrix)
    for i in range(number):
        for j in range(number):
            index_run = graphe.index_eq_runner(runners_resultat[i], perm_col)
            index_win = graphe.index_eq_winner(winners_resultat[j], perm_row)
            if len(teams_to_remove) == 1:
                index_run_cond = graphe.index_eq_runner(teams_to_remove[-1])
                dict_proba[runners_resultat[i]][winners_resultat[j]] = data[f"{mat1}"][
                    f"{index_run}, {index_win}, {index_run_cond}"]
            else:
                dict_proba[runners_resultat[i]][winners_resultat[j]] = data[f"{mat1}"][
                    f"{index_run}, {index_win}"]
            print(dict_proba[runners_resultat[i]][winners_resultat[j]])
    return jsonify({'resultat': dict_proba})



# Trouver une proba
@app.route("/proba", methods=["POST"])
def proba_single():
    """try:
        # Il faut que j'ai les équipes à remove et esnuite les deux ou trois dernières
        # Il faut donc que je fasse une nouvelle fonction pour trouver les fonctions à remove
        # et les fonctions à mettre dans le data selon la parité

        donnee = request.get_json()
        teams_to_remove = donnee["team_to_remove"]
        #print(teams_to_remove)
        liste2 = donnee["teams_match"]
        if len(liste2) == 3:  # c'est que team_chosen est de longueur impaire
            equipe1 = liste2[0]
            equipe2 = liste2[1]
            equipe3 = liste2[2]
            for i in range(int((len(teams_to_remove)-1)/2)):  # Rebesoin de faire une disjonction de cas selon la partié
                G_init.remove_2t(f"{teams_to_remove[2 * i]}", f"{teams_to_remove[2 * i + 1]}")
            matrix = G_init.convert()
            q, mat1, perm_row, perm_col = G_init.isom(matrix)
            index_run = G_init.index_eq_runner(equipe1, perm_col)
            index_win = G_init.index_eq_winner(equipe2, perm_row)
            index_run_cond = G_init.index_eq_runner(equipe3,perm_col)
            proba = data[f"{mat1}"][f"{index_run}, {index_win}, {index_run_cond}"]
        elif len(liste2) == 2:
            equipe1 = str(liste2[0])
            equipe2 = str(liste2[1])
            for i in range(int(len(teams_to_remove)/2)):
                print(teams_to_remove[2 * i], teams_to_remove[2 * i + 1])
                print(type(teams_to_remove[2 * i]))
                G_init.remove_2t(f"{teams_to_remove[2 * i]}", f"{teams_to_remove[2 * i + 1]}")
            matrix = G_init.convert()
            q, mat1, perm_row, perm_col = G_init.isom(matrix)
            index_run = G_init.index_eq_runner(equipe1, perm_col)
            index_win = G_init.index_eq_winner(equipe2, perm_row)
            proba = data[f"{mat1}"][f"{index_run}, {index_win}"]
        else:
            print("PB: pas la bonne longueur: ",len(liste2))
            proba = "problem"
    except Exception as e:
        print(f"Une exception a été levée : {e}")
        proba = "zeub"
    """
    donnee = request.get_json()
    teams_to_remove = donnee["team_to_remove"]
    # print(teams_to_remove)
    liste2 = donnee["teams_match"]
    if len(liste2) == 3:  # c'est que team_chosen est de longueur impaire
        equipe1 = liste2[0]
        equipe2 = liste2[1]
        equipe3 = liste2[2]
        for i in range(int((len(teams_to_remove) - 1) / 2)):  # Rebesoin de faire une disjonction de cas selon la partié
            G_init.remove_2t(f"{teams_to_remove[2 * i]}", f"{teams_to_remove[2 * i + 1]}")
        matrix = G_init.convert()
        mat1, perm_row, perm_col = G_init.isom(matrix)
        index_run = G_init.index_eq_runner(equipe1, perm_col)
        index_win = G_init.index_eq_winner(equipe2, perm_row)
        index_run_cond = G_init.index_eq_runner(equipe3, perm_col)
        proba = data[f"{mat1}"][f"{index_run}, {index_win}, {index_run_cond}"]
    elif len(liste2) == 2:
        equipe1 = str(liste2[0])
        equipe2 = str(liste2[1])
        for i in range(int(len(teams_to_remove) / 2)):
            print(teams_to_remove[2 * i], teams_to_remove[2 * i + 1])
            print(type(teams_to_remove[2 * i+1]))
            G_init.remove_2t(f"{teams_to_remove[2 * i]}", f"{teams_to_remove[2 * i + 1]}")
        matrix = G_init.convert()
        mat1, perm_row, perm_col = G_init.isom(matrix)
        index_run = G_init.index_eq_runner(equipe1, perm_col)
        index_win = G_init.index_eq_winner(equipe2, perm_row)
        proba = data[f"{mat1}"][f"{index_run}, {index_win}"]
    else:
        print("PB: pas la bonne longueur: ", len(liste2))
        proba = "problem"
    if proba==0.0: proba = -2
    return jsonify({'resultat': proba})


# definition des routes pour les différentes pages
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/page_ucl')
def page_ucl():
    return render_template("page_ucl.html")


@app.route('/page_el')
def page_el():
    equipe1 = None
    equipe2 = None

    if request.method == "POST":
        equipe1 = request.form["equipe1"]
        equipe2 = request.form["equipe2"]

    return render_template("page_el.html", liste_equipe=liste_equipe, equipe1=equipe1, equipe2=equipe2)

@app.route('/page_elconf')
def page_elconf():
    return render_template("page_elconf.html")


# test de fonction de calcul
"""@app.route("/calculate", methods=["POST"])
def proba():
    try:
        a = float(request.form["num"])
        b = float(request.form["denom"])
        result = a / b
    except:
        result = "Erreur de calcul"
    return render_template("page_ucl.html", result=result)"""


# fonction pour lancer le site quand on exécute ce fichier
if __name__ == '__main__':
    app.run()
