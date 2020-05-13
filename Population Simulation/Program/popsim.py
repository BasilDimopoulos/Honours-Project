#Imports
import simpy
import matplotlib.pyplot as plt
import csv
import sys
import os

#Starting Population
P0 = 19028802
SimYears = 11
printLabels = True

#Vars
graph_years = []
graph_popul = []

# variables for parsing the input data file
in_fileName = []
input_births = []
input_deaths = []
input_pop = []


if len(sys.argv) < 2:
    print("Please provide an input datafile \n Usage: popsim.py input_file.csv")
    exit(1)

# Parse CSV input file
in_fileName = sys.argv[1]
sanitised_filename = os.path.basename(in_fileName)
print("Reading from file: " + sanitised_filename + "...")

with open(in_fileName, mode = 'r') as csv_file:
    reader = csv.DictReader(csv_file)
    line_count = 0
    for row in reader:
        # headers line
        if line_count == 0:
            # print(f'Column names are {", ".join(row)}')
            line_count += 1
        if row["Measure"] == "Deaths":
            input_deaths.append((int(row["Time"]),int(row["Value"])))
        elif row["Measure"] == "Births":
            input_births.append((int(row["Time"]),int(row["Value"])))
        elif row["Measure"] == "Population":
            input_pop.append((int(row["Time"]),int(row["Value"])))


#Itteration
class Population():
    def __init__(self):
        self.year = 2000
        self.pop = P0
        graph_years.append(self.year)
        graph_popul.append(self.pop)
        print(self.year, self.pop)

    def simulate(self, count):
        for i in range(count):
            self.simyear()

    def  simyear(self):
        for year, value in input_deaths:
            if year == self.year:
                DeathRate = value / self.pop
                break

        for year, value in input_births:
            if year == self.year:
                BirthRate = value / self.pop
                break
            
        self.year = self.year + 1
        self.pop = self.pop + self.pop*BirthRate - self.pop*DeathRate
        graph_years.append(self.year)
        graph_popul.append(self.pop)
        print(self.year, int(self.pop))

sim = Population()
sim.simulate( SimYears )
plt.ticklabel_format(style='sci', axis='y', scilimits=(6,6), useMathText=True)
plt.plot(graph_years, graph_popul, 'bo-')
plt.ylabel('Population')
plt.xlabel('Year')

if printLabels:
    for x,y in zip(graph_years, graph_popul):
        label = "{:.2f}".format(y)
        plt.annotate(label, (x,y),textcoords="offset points", xytext=(0,10), ha='center')


truth_year = []
truth_pop = []
for year, value in input_pop:
    truth_year.append(year)
    truth_pop.append(value)

plt.plot(truth_year, truth_pop, 'ro-')

if printLabels:
    for x,y in zip(truth_year, truth_pop):
        label = "{:.2f}".format(y)
        plt.annotate(label, (x,y),textcoords="offset points", xytext=(0,10), ha='center')


plt.show()
