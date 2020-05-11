#Imports
import simpy
import matplotlib.pyplot as plt

#Starting Population
P0 = 100000000
BirthRate = 0.05
DeathRate = 0.04
Year = 2000

#Vars
graph_years = []
graph_popul = []

#Itteration
class Population():
    def __init__(self):
        self.year = Year
        self.pop = P0
        print(self.year, self.pop)

    def simulate(self, count):
        for i in range(count):
            self.simyear()
    
    def  simyear(self):
        self.year = self.year + 1
        self.pop = self.pop + self.pop*BirthRate - self.pop*DeathRate
        graph_years.append(self.year)
        graph_popul.append(self.pop)
        print(self.year, int(self.pop))
        

sim = Population()
sim.simulate( 10 )
plt.plot(graph_years, graph_popul)
plt.ylabel('Population')
plt.xlabel('Year')
plt.show()
