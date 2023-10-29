
import random
import numpy as np
import copy
import json


class team:
    def __init__(self, name, country, group, rank):
        self._name = name
        self._country = country
        self._group = group
        self._rank = rank
        pass

    def name(self):
        return self._name

    def country(self):
        return self._country

    def group(self):
        return self._group

    def rank(self):
        return self._rank


class GraphBipartite:
    def __init__(self, features):
        if features == []:
            self._graph = {}
            self.is_bipartite = True
            self._runners_up = []
            self._winners = []
            self._length = 0
        else:
            self._graph = features[0]
            self.is_bipartite = True
            self._runners_up = features[1]
            self._winners = features[2]
            self._length = features[3]
        self.last_runner_drawn = " "

    def graph(self):
        return self._graph

    def runners_up(self):
        return self._runners_up

    def winners(self):
        return self._winners

    def length(self):
        return self._length

    def set_length(self, num):
        self._length = num

    def add_neighbor_graph(self, team, neighbor):
        self._graph[team].append(neighbor)

    def copy_graph(self):
        # pour créer un autre graph avec les mêmes composants
        graph2 = copy.deepcopy(self.graph())
        runners_up2 = copy.deepcopy(self.runners_up())
        winners2 = copy.deepcopy(self.winners())
        length = self.length()
        new_graph = GraphBipartite(
            [graph2, runners_up2, winners2, length])
        return new_graph

    def add_vertex(self, team, set):
        # pour mettre les équipes au début
        if team.name() not in self.graph():
            self.graph()[team.name()] = []
            self.graph()[team.name()].append(set)
            self.set_length(self.length()+1)
        else:
            print(f"The team {team.name()} is already in the graph.")

    def add_edge(self, team1, team2):
        set1 = self.graph().get(team1.name())
        set2 = self.graph().get(team2.name())
        if set1 is None or set2 is None:
            print("The teams are not in the graph")
            return
        if set1 == set2:
            print("The teams have the same rank")
            self.is_bipartite = False
            return
        self.add_neighbor_graph(team1.name(), team2.name())
        self.add_neighbor_graph(team2.name(), team1.name())

    def add_winner(self, winner):
        self._winners.append(winner)

    def add_runner_up(self, runner_up):
        self._runners_up.append(runner_up)

    def print_graph(self):
        for vertex, neighbor in self.graph().items():
            print(f"{vertex} - Set : {neighbor[0]}, \
                  neighbors : {', '.join(neighbor[1:])}")

    def remove_2t(self, i_0, j_0):
        # enlever 2 club du graph
        if i_0 in self.graph() and j_0 in self.graph():
            del self._graph[i_0]
            del self._graph[j_0]
        else:
            print("not in dictionnary")
        self._runners_up.remove(i_0)
        self._winners.remove(j_0)
        for team in self.graph():
            if i_0 in self.graph()[team]:
                self._graph[team].remove(i_0)
            if j_0 in self.graph()[team]:
                self._graph[team].remove(j_0)
        self.set_length(self.length() - 2)
        self.last_runner_drawn = i_0

    def remove_1t(self, runner):
        self.set_length(self.length() - 1)
        self.last_runner_drawn = runner

    def random_pick(self):
        index_runner_up = random.randint(0, len(self.runners_up) - 1)
        runner_up = self.runners_up()[index_runner_up]

        admissible_opponents = self.admissible_opponents(runner_up)
        index_winner = random.randint(0, len(admissible_opponents) - 1)
        winner = admissible_opponents[index_winner]

        return runner_up, winner

    def matrix(self, data):
        table = []
        for i in range(len(self.winners()) + 1):
            table.append([])
        table[0].append(" ")
        for line in range(1, len(self.winners()) + 1):
            table[line].append(self.winners()[line - 1])
        for col in range(1, len(self.runners_up()) + 1):
            table[0].append(self.runners_up()[col - 1])
        key1 = f"{tuple(self.runners_up())}, {tuple(self.winners())}"
        runners = self.runners_up()
        winners = self.winners()
        for i in range(0, len(winners)):
            for j in range(0, len(runners)):
                if self.length() % 2 == 0:
                    key2 = f"{runners[i]}, {winners[j]}"
                    if key1 in data and key2 in data[key1]:
                        table[j+1].append(round(data[key1][key2]*100, 2))
                    else:
                        print(f"not, {key1}, {key2}")
                else:
                    key2 = \
                        f"{runners[i]}, {winners[j]}, {self.last_runner_drawn}"
                    if key1 in data and key2 in data[key1]:
                        table[j+1].append(round(data[key1][key2]*100, 2))
        matrix = np.array(table, dtype=object)
        return matrix


team_1 = team("Napoli", "Italy", "A", 1)
team_2 = team("Liverpool", "England", "A", 2)
team_3 = team("Porto", "Portugal", "B", 1)
team_4 = team("Brugge", "Belgium", "B", 2)
team_5 = team("Bayern", "Germany", "C", 1)
team_6 = team("Inter", "Italy", "C", 2)
team_7 = team("Tottenham", "England", "D", 1)
team_8 = team("Frankfurt", "Germany", "D", 2)
team_9 = team("Chelsea", "England", "E", 1)
team_10 = team("AC Milan", "Italy", "E", 2)
team_11 = team("Real Madrid", "Spain", "F", 1)
team_12 = team("Leipzig", "Germany", "F", 2)
team_13 = team("Manchester City", "England", "G", 1)
team_14 = team("Dortmund", "Germany", "G", 2)
team_15 = team("Benfica", "Portugal", "H", 1)
team_16 = team("PSG", "France", "H", 2)

teams = [team_1, team_2, team_3, team_4, team_5, team_6, team_7, team_8,
         team_9, team_10, team_11, team_12, team_13, team_14, team_15, team_16]
winners = []
runners_up = []

G_init = GraphBipartite([])

for team in teams:
    if team.rank() == 1:
        ensemble = "winner"
        G_init.add_winner(team.name())
        winners.append(team)
    else:
        ensemble = "runner_up"
        G_init.add_runner_up(team.name())
        runners_up.append(team)
    G_init.add_vertex(team, ensemble)

for team1 in winners:
    for team2 in runners_up:
        if team1.country() != team2.country() \
                and team1.group() != team2.group() \
                and team1.rank() != team2.rank():
            G_init.add_edge(team1, team2)

G_init.remove_2t("PSG", "Bayern")
G_init.remove_2t("AC Milan", "Benfica")
# G_init.remove_2t("Frankfurt", "Porto")
# G_init.remove_2t("Inter", "Manchester City")
# G_init.remove_2t("Leipzig", "Napoli")
# G_init.remove_1t("Dortmund")

with open("resultat.json", 'r') as fichier:
    donnees = json.load(fichier)

M = G_init.matrix(donnees)
print(M)

print(len(donnees))
