#Imports
import simpy
import matplotlib.pyplot as plt
import csv
import sys
import os

#Starting Population
P0 = 19028802
BirthRate = 13.1 / 1000
DeathRate = 6.7 / 1000
Year = 2000
SimYears = 16

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


print("size of input_deaths: " + str(len(input_deaths)))
print(input_deaths[0][0])
x = input_deaths[0]
print(x[0])
print(x[1])
for year, value in input_deaths:
    print(year, value)
#
# sim = Population()
# sim.simulate( SimYears )
# plt.plot(graph_years, graph_popul, 'bo-')
# plt.ylabel('Population')
# plt.xlabel('Year')
# for x,y in zip(graph_years, graph_popul):
#
#     label = "{:.2f}".format(y)
#     plt.annotate(label, (x,y),textcoords="offset points", xytext=(0,10), ha='center')
#
# plt.show()
