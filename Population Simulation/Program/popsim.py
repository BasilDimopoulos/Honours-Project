#Imports
import simpy
import matplotlib.pyplot as plt
import csv
import sys
import os
import argparse

# Default variables
P0 = 19028802
SimYears = 3
printLabels = True
in_fileName = ""

# Add command line arguments and inputs
parser = argparse.ArgumentParser(description='Run a population simulation on given input data.')
parser.add_argument('-i', '--input', type=str, nargs=1, required=True, help="Input file location (Required Value)")
parser.add_argument('-p', '--population', type=int, nargs=1, required=False, help="Provide an integer value for starting population")
parser.add_argument('-d', '--duration',type=int, nargs=1, required=False, help="Provide an integer value for number duration to run the simulate for, in years")
args = parser.parse_args()

# Set input csv filename from arguement
in_fileName = getattr(args, "input")[0]

# Set value of starting population
if type(None) != type(getattr(args, "population")):
    P0 = int(getattr(args, "population")[0])

# Set value of number of years to duration
if type(None) != type(getattr(args, "duration")):
    SimYears = int(getattr(args, "duration")[0])

# program vars
graph_years = []
graph_popul = []

# variables for parsing the input data file
input_births = []
input_deaths = []
input_pop = []

# Parse CSV input file
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
    
    # Constructor
    def __init__(self):
        self.year = 2000
        self.pop = P0
        graph_years.append(self.year)
        graph_popul.append(self.pop)
        print(self.year, self.pop)

    # Runs the simyear function for inputted number of years
    def simulate(self, count):
        for i in range(count):
            self.simyear()

    # Simulate Year
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

# Plot stuffs
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
