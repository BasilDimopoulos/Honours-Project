#Imports
import simpy
import matplotlib.pyplot as plt

#Starting Population
P0 = 19028802
BirthRate = 13.1 / 1000
DeathRate = 6.7 / 1000
Year = 2000
SimYears = 16

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
sim.simulate( SimYears )
plt.plot(graph_years, graph_popul, 'bo-')
plt.ylabel('Population')
plt.xlabel('Year')
for x,y in zip(graph_years, graph_popul):
    
    label = "{:.2f}".format(y)
    plt.annotate(label, (x,y),textcoords="offset points", xytext=(0,10), ha='center')

plt.show()
