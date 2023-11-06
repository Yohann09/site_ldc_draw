from flask import Flask, render_template, request
import LDC


app = Flask(__name__, static_url_path='/static')


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
@app.route("/calculate", methods=["POST"])
def proba():
    try:
        a = float(request.form["num"])
        b = float(request.form["denom"])
        result = a / b
    except:
        result = "Erreur de calcul"
    return render_template("page_ucl.html", result=result)


""" liste_equipe = ["Napoli","Liverpool","Porto","Brugge", "Bayern", "Inter",
                "Tottenham","Frankfurt","Chelsea","AC Milan","Real Madrid","Leipzig",
                "Manchester City","Dortmund","Benfica","PSG"]"""

"""liste_equipe = {'equipe1': {'nom': 'Équipe 1', 'ville': 'Ville 1', 'couleur': 'Rouge'},
                'equipe2': {'nom': 'Équipe 2', 'ville': 'Ville 2', 'couleur': 'Bleu'},
                'equipe3': {'nom': 'Équipe 3', 'ville': 'Ville 3', 'couleur': 'Vert'}
}

liste_equipe= {}
for team in LDC.teams:
    liste_equipe["nom"] = team.name()
    liste_equipe["country"] = team.country()
    liste_equipe["group"] = team.group()
    liste_equipe["rank"] = team.rank()"""

# fonction pour lancer le site quand on exécute ce fichier
if __name__ == '__main__':
    app.run()
