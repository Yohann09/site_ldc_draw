import random
import numpy as np
import copy


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
        self._dict_admissible_opponents = {}
        self.last_runner_drawn = " "

    def dict_admissible_opponents(self):
        return self._dict_admissible_opponents

    def set_dict_admissible_opponents(self, admissible_opponents, runner):
        self._dict_admissible_opponents[f"{runner}"] = admissible_opponents

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

    def admissible_opponents(self, runner_up):
        if runner_up in self.dict_admissible_opponents():
            return self.dict_admissible_opponents()[f"{runner_up}"]
        if self.length() > 2:
            admissible_opponents = {}
            for runner in self.runners_up():
                admissible_opponents[f"{runner}"] = self.graph()[
                    f"{runner}"][1:]
                if admissible_opponents[f"{runner}"] == []:
                    return "no opponents"

                for runner in admissible_opponents:
                    if len(admissible_opponents[f"{runner}"]) == 1:
                        for runner2 in admissible_opponents:
                            if runner2 == runner:
                                continue
                            else:
                                if admissible_opponents[f"{runner}"][0] in \
                                     admissible_opponents[f"{runner2}"]:
                                    admissible_opponents[
                                        f"{runner2}"].remove(
                                            admissible_opponents[
                                                f"{runner}"][0])
                for winner in self.winners():
                    if len(self.graph()[f"{winner}"]) == 2:
                        admissible_opponents[self.graph()[f"{winner}"][1]] = [
                            f"{winner}"]
                        for runner2 in admissible_opponents:
                            if runner2 == self.graph()[f"{winner}"][1]:
                                continue
                            else:
                                if winner in admissible_opponents[
                                     f"{runner2}"]:
                                    admissible_opponents[
                                        f"{runner2}"].remove(
                                            winner)
            self.set_dict_admissible_opponents(
                admissible_opponents[f"{runner_up}"], runner_up)
            return admissible_opponents[f"{runner_up}"]
        else:
            res = []
            if len(self.graph()[f"{runner_up}"]) == 2:
                res.append(self.graph()[f"{runner_up}"][1])
            else:
                return "prooblem"
            return res

    def subgraphs(self):
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
                            G_3.remove_2t(runner_up, opponent)
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
        adm_opp_i0 = self.admissible_opponents(i_0)
        if self.length() > 2:
            if i == i_0:
                if j in adm_opp_i0:
                    return round(1/len(adm_opp_i0), 4)
                else:
                    return 0
            else:
                prob = 0
                for j_0 in self.graph()[i_0][1:]:
                    if j_0 != j:
                        if j_0 in adm_opp_i0:
                            G_2 = self.copy_graph()
                            G_2.remove_2t(i_0, j_0)
                            prob += G_2.proba(i, j) / \
                                len(adm_opp_i0)
                        else:
                            prob += 0
            return prob
        else:
            if i == i_0:
                if j in adm_opp_i0:
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
                if self.length() % 2 == 0:
                    table[i].append(round(
                        self.proba(self.runners_up()[j - 1],
                                   self.winners()[i - 1])*100, 2))
                else:
                    table[i].append(round(self.proba_cond(
                        self.runners_up()[j - 1], self.winners()[i - 1],
                                    self.last_runner_drawn)*100, 2))
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

G_init.remove_2t("Frankfurt", "Napoli")
# G_init.remove_2t("Liverpool", "Chelsea")
G_init.remove_2t("Liverpool", "Benfica")
G_init.remove_2t("Leipzig", "Manchester City")
# G_init.remove_2t("AC Milan", "Porto")
# G_init.remove_1t("PSG")
print(G_init.matrix())
