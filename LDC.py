class team:
    def __init__(self):
        pass

    def features(self, country, group, rank, drawn):
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


class GraphBipartite:
    def __init__(self):
        self.graph = {}
        self.is_bipartite = True

    def add_vertex(self, vertex, set):
        if vertex not in self.graph:
            self.graph[vertex] = []
            self.graph[vertex].append(set)
        else:
            print(f"The vertex {vertex} is already in the graph.")

    def add_edge(self, vertex1, vertex2):
        set1 = self.graph.get(vertex1)
        set2 = self.graph.get(vertex2)
        if set1 is None or set2 is None:
            print("The vertices are not in the graph")
            return

        if set1 == set2:
            print("The vertices are in the same set")
            self.is_bipartite = False
            return

        self.graph[vertex1].append(vertex2)
        self.graph[vertex2].append(vertex1)

    def print_graph(self):
        for vertex, neighbor in self.graph.items():
            print(f"{vertex} - Set {neighbor[0]} : {', '.join(neighbor[1:])}")


team_1, team_2, team_3, team_4, team_5, team_6, team_7, team_8, team_9, \
    team_10, team_11, team_12, team_13, team_14, team_15, team_16 = team

teams = [team_1, team_2, team_3, team_4, team_5, team_6, team_7, team_8,
         team_9, team_10, team_11, team_12, team_13, team_14, team_15, team_16]

G_init = GraphBipartite
for team in teams:
    if team.rank() == 1:
        ensemble = "group_winner"
    else:
        ensemble = "group_runner_up"
    G_init.add_vertex("{team}", ensemble)

for team1 in teams:
    for team2 in teams:
        if team1.country() != team2.country() \
                and team1.group() != team2.group() \
                and team1.rank() != team2.rank():
            G_init.add_edge("{team1}", "{team2}")
