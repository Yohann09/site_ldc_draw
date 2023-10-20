from flask import Flask, render_template, request

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
    return render_template("page_el.html")


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


# fonction pour lancer le site quand on exécute ce fichier
if __name__ == '__main__':
    app.run()
