import random
import numpy as np
import copy


# si ça s'affiche c est que j'ai réussi à git push
class team:
    def __init__(self, name, country, group, rank, drawn):
        self._name = name
        self._country = country
        self._group = group
        self._rank = rank
        self.isdrawn = drawn
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
        new_graph = GraphBipartite([graph2, runners_up2, winners2, length])
        return new_graph

    def add_vertex(self, team, set):
        # pour mettre les équipes au début
        if team.name() not in self.graph():
            self.graph()[team.name()] = []
            self.graph()[team.name()].append(set)
            self.set_length(self.length() + 1)

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

    def remove(self, i_0, j_0):
        # enlever 2 club du graph
        if i_0 in self.graph() and j_0 in self.graph():
            del self._graph[i_0]
            del self._graph[j_0]
        else:
            print("not in dictionnary")

        if i_0 in self.winners():
            self._winners.remove(i_0)
        elif i_0 in self.runners_up():
            self._runners_up.remove(i_0)
        if j_0 in self.winners():
            self._winners.remove(j_0)
        elif j_0 in self.runners_up():
            self._runners_up.remove(j_0)

        for team in self.graph():
            if i_0 in self.graph()[team]:
                self._graph[team].remove(i_0)
            if j_0 in self.graph()[team]:
                self._graph[team].remove(j_0)
        self.set_length(self.length() - 2)

    def admissible_opponents(self, runner_up):
        # ils disent d'utiliser des techniques de maximisation de flux
        # j'ai essayé de vesqui pck jsp ce que c'est
        # # mais il y a des failles qd y a bcp d'équipes
        # ca doit être pour ça qu'on obtient pas exactement les bonnes proba
        if self.length() > 2:
            admissible_opponents = {}
            for runner in self.runners_up():
                admissible_opponents[f"{runner}"] = self.graph()[
                    f"{runner}"][1:]
                if admissible_opponents[f"{runner}"] == []:
                    return "no opponents"

            def end_cond(admissible_opponents):
                for runner in admissible_opponents:
                    if len(admissible_opponents[f"{runner}"]) == 1:
                        for runner2 in admissible_opponents:
                            if runner == runner2:
                                continue
                            else:
                                if admissible_opponents[f"{runner}"][0] in \
                                   admissible_opponents[f"{runner2}"]:
                                    return False
                                else:
                                    continue
                return True

            if end_cond(admissible_opponents) is True:
                return admissible_opponents[f"{runner_up}"]
            else:
                while end_cond(admissible_opponents) is False:
                    for runner in admissible_opponents:
                        # il faut enlever quand runner = runner up?
                        if len(admissible_opponents[f"{runner}"]) == 1:
                            for runner2 in admissible_opponents:
                                if runner2 == runner:
                                    continue
                                else:
                                    if admissible_opponents[f"{runner}"][0] \
                                       in admissible_opponents[f"{runner2}"]:
                                        admissible_opponents[
                                            f"{runner2}"].remove(
                                                admissible_opponents[
                                                    f"{runner}"][0])
                return admissible_opponents[f"{runner_up}"]
        else:
            res = []
            if len(self.graph()[f"{runner_up}"]) == 2:
                res.append(self.graph()[f"{runner_up}"][1])
            elif len(self.graph()[f"{runner_up}"]) == 1:
                return res
            else:
                return "prooblem"
            return res

    def is_perfect_matching(self):
        # sert à rien pour l'intant, je l'ai pas fini
        matching = []
        for team in self.runners_up():
            matching.append((team, self.admissible_opponents(team)[0]))
        return matching

    def subgraphs(self):
        # sert à rien pour l'instant
        G = {}
        i = self.length()
        G[f"{i}"] = [self.copy_graph()]
        G["trash"] = []
        while i > 2:
            i -= 2
            G[f"{i}"] = []
            s = i+2
            for graph in G[f"{s}"]:
                for runner_up in graph.runners_up():
                    if type(graph.admissible_opponents(runner_up)) == str:
                        G["trash"].append([])
                    else:
                        for opponent in graph.admissible_opponents(runner_up):
                            G_3 = graph.copy_graph()
                            G_3.remove(runner_up, opponent)
                            G[f"{i}"].append(G_3)
        return G

    def all_admissible_opponents(self):        # sert à rien pour l'instant
        all_admissible_opponents = {}
        for subgraph in self.subgraphs():
            all_admissible_opponents[subgraph] = []
            for runner in self.subgraphs()[subgraph].runners_up:
                all_admissible_opponents[subgraph].append(self.subgraphs()[
                    subgraph].admissible_opponents(runner))
        return all_admissible_opponents

    def random_pick(self):
        index_runner_up = random.randint(0, len(self.runners_up) - 1)
        runner_up = self.runners_up()[index_runner_up]

        admissible_opponents = self.admissible_opponents(runner_up)
        index_winner = random.randint(0, len(admissible_opponents) - 1)
        winner = admissible_opponents[index_winner]

        return runner_up, winner

    def proba_cond(self, i, j, i_0):
        if self.length() > 2:
            if i == i_0:
                if j in self.admissible_opponents(i_0):
                    return round(1/len(self.admissible_opponents(i_0)), 4)
                else:
                    return 0
            else:
                prob = 0
                for j_0 in self.graph()[i_0][1:]:
                    if j_0 != j:
                        if j_0 in self.admissible_opponents(i_0):
                            G_2 = self.copy_graph()
                            G_2.remove(i_0, j_0)
                            prob += G_2.proba(i, j) / \
                                len(self.admissible_opponents(i_0))
                        else:
                            prob += 0
            return prob
        else:
            if i == i_0:
                if j in self.admissible_opponents(i):
                    return 1
                else:
                    return 0
            else:
                print("problem")

    def proba(self, i, j):
        sum = 0
        for i_0 in self.runners_up():
            sum += self.proba_cond(i, j, i_0)
        return sum/len(self.runners_up())

    def matrix(self):
        table = []
        for i in range(len(self.winners()) + 1):
            table.append([])
        table[0].append(" ")
        for line in range(1, len(self.winners()) + 1):
            table[line].append(self.winners()[line - 1])
        for col in range(1, len(self.runners_up()) + 1):
            table[0].append(self.runners_up()[col - 1])
        for i in range(1, len(self.winners()) + 1):
            for j in range(1, len(self.runners_up()) + 1):
                table[i].append(round(self.proba(self.runners_up()[j - 1],
                                self.winners()[i - 1])*100, 2))
        matrix = np.array(table, dtype=object)
        return matrix


team_1 = team("Napoli", "Italy", "A", 1, 0)
team_2 = team("Liverpool", "England", "A", 2, 0)
team_3 = team("Porto", "Portugal", "B", 1, 0)
team_4 = team("Brugge", "Belgium", "B", 2, 0)
team_5 = team("Bayern", "Germany", "C", 1, 0)
team_6 = team("Inter", "Italy", "C", 2, 0)
team_7 = team("Tottenham", "England", "D", 1, 0)
team_8 = team("Frankfurt", "Germany", "D", 2, 0)
team_9 = team("Chelsea", "England", "E", 1, 0)
team_10 = team("AC Milan", "Italy", "E", 2, 0)
team_11 = team("Real Madrid", "Spain", "F", 1, 0)
team_12 = team("Leipzig", "Germany", "F", 2, 0)
team_13 = team("Manchester City", "England", "G", 1, 0)
team_14 = team("Dortmund", "Germany", "G", 2, 0)
team_15 = team("Benfica", "Portugal", "H", 1, 0)
team_16 = team("PSG", "France", "H", 2, 0)

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

G_init.remove("PSG", "Manchester City")
G_init.remove("Liverpool", "Benfica")
G_init.remove("Frankfurt", "Napoli")
G_init.remove("Brugge", "Bayern")
G_init.remove("AC Milan", "Porto")

"""
S = G_init.subgraphs()    #  test
print(len(S["trash"]))

"""
print(G_init.matrix())
