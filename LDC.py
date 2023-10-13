import random


class team:
    def __init__(self):
        pass

    def features(self, name, country, group, rank, drawn):
        self.country = country
        self.group = group
        self.rank = rank
        self.isdrawn = drawn

    def country(self):
        return self.country

    def rank(self):
        return self.rank

    def group(self):
        return self.group

    def name(self):
        return self.name


class GraphBipartite:
    def __init__(self):
        self.graph = {}
        self.is_bipartite = True
        self.runners_up = []
        self.winners = []
        self.lenght = 0

    def add_vertex(self, team, set):
        if team.name not in self.graph:
            self.graph[team.name] = []
            self.graph[team.name].append(set)

        else:
            print(f"The team {team.name} is already in the graph.")

    def add_edge(self, team1, team2):
        set1 = self.graph.get(team1.name)
        set2 = self.graph.get(team2.name)
        if set1 is None or set2 is None:
            print("The teams are not in the graph")
            return

        if set1 == set2:
            print("The teams have the same rank")
            self.is_bipartite = False
            return

        self.graph[team1.name].append(team2.name)
        self.graph[team2.name].append(team1.name)

    def add_winner(self, winner):
        self.winners.append(winner)

    def add_runner_up(self, runner_up):
        self.runners_up.append(runner_up)

    def print_graph(self):
        for vertex, neighbor in self.graph.items():
            print(f"{vertex} - Set {neighbor[0]} : {', '.join(neighbor[1:])}")

    def admissible_opponents(self, runner_up):
        admissible_opponents = []
        for neighbor in self.graph[runner_up][1:]:
            is_admissible = True
            for other_runner_up in self.runners_up:
                if self.graph[other_runner_up][1:] == [neighbor]:
                    is_admissible = False
            if is_admissible is True:
                admissible_opponents.append(neighbor)
        return admissible_opponents

    def random_pick(self):
        index_runner_up = random.randint(0, len(self.runners_up) - 1)
        runner_up = self.runners_up[index_runner_up]

        admissible_opponents = self.admissible_opponents(self, runner_up)
        index_winner = random.randint(0, len(admissible_opponents) - 1)
        winner = admissible_opponents[index_winner]

        return runner_up, winner


team_1, team_2, team_3, team_4, team_5, team_6, team_7, team_8, team_9, \
    team_10, team_11, team_12, team_13, team_14, team_15, team_16 = team

teams = [team_1, team_2, team_3, team_4, team_5, team_6, team_7, team_8,
         team_9, team_10, team_11, team_12, team_13, team_14, team_15, team_16]

G_init = GraphBipartite

for team in teams:
    if team.rank == 1:
        ensemble = "winner"
        G_init.add_winner(team.name)
    else:
        ensemble = "runner_up"
        G_init.add_runner_up(team.name)
    G_init.add_vertex("{team.name}", ensemble)

for team1 in teams:
    for team2 in teams:
        if team1.country != team2.country \
                and team1.group != team2.group \
                and team1.rank != team2.rank:
            G_init.add_edge("{team1.name}", "{team2.name}")
