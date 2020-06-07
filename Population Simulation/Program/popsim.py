#Imports
import simpy
import matplotlib.pyplot as plt
import csv
import sys
import os
import argparse

# Default variables
SimYears = 3
printLabels = False
in_fileName = ""
if_migration = False
input_migration = []

# Add command line arguments and inputs
parser = argparse.ArgumentParser(description='Run a population simulation on given input data.')
parser.add_argument('-i', '--input', type=str, nargs=1, required=True, help="Input file location (Required Value)")
# parser.add_argument('-m', '--migration', action='store_true', help="Calculate migration data (Requires migraion data in input csv")
parser.add_argument('-p', '--population', type=int, nargs=1, required=False, help="Provide an integer value for starting population")
parser.add_argument('-d', '--duration',type=int, nargs=1, required=False, help="Provide an integer value for number duration to run the simulate for, in years")
parser.add_argument('-l', '--labels', action='store_true', help="Enable Labels on output graph")
parser.add_argument('-s', '--save', type=str, nargs=1, required=False, help="Output file (.png)")
parser.add_argument('-nd', '--nodisplay', action='store_false', help="Disables gui output")
args = parser.parse_args()

# Set input csv filename from arguement
in_fileName = getattr(args, "input")[0]

# Set label toggle
if args.labels:
    printLabels = True

# Migration:
# if args.migration:
#     if_migration = True


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
            line_count += 1
        if row["Measure"] == "Deaths":
            input_deaths.append((int(row["Time"]),int(row["Value"])))
        elif row["Measure"] == "Births":
            input_births.append((int(row["Time"]),int(row["Value"])))
        elif row["Measure"] == "Population":
            input_pop.append((int(row["Time"]),int(row["Value"])))
        elif row["Measure"] == "Migration":
            input_migration.append((int(row["Time"]),int(row["Value"])))

# Custom sort function to sort input data by years
def sortYears(elem):
    return elem[0]

# Sort all the input data by ascending years
input_births.sort(key=sortYears)
input_deaths.sort(key=sortYears)
input_pop.sort(key=sortYears)
input_migration.sort(key=sortYears)

# Set starting population
P0 = input_pop[0][1]

# Set value of starting population if paramater set
if type(None) != type(getattr(args, "population")):
    P0 = int(getattr(args, "population")[0])


prev_birthRate = 0
prev_deathRate = 0
prev_migration = 0

# Iteration
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
        global prev_birthRate
        global prev_deathRate
        global prev_migration

        found = False
        for countYear, value in input_deaths:
            if countYear == self.year:
                deathRate = value / self.pop
                found = True
                break
        if found:
            prev_deathRate = deathRate
        else:
            deathRate = prev_deathRate

        found = False
        for countYear, value in input_births:
            if countYear == self.year:
                birthRate = value / self.pop
                found = True
                break
        if found:
            prev_birthRate = birthRate
        else:
            birthRate = prev_birthRate

        found = False
        for countYear, value in input_migration:
            if countYear == self.year:
                migration = value
                found = True
                break
        if found:
            prev_migration = migration
        else:
            migration = prev_migration
            
        self.year = self.year + 1
        self.pop = self.pop + self.pop*birthRate - self.pop*deathRate + migration
        graph_years.append(self.year)
        graph_popul.append(self.pop)
        print(self.year, int(self.pop))

# Plot stuffs
sim = Population()
sim.simulate( SimYears )
plt.ticklabel_format(style='sci', axis='y', scilimits=(6,6), useMathText=True)
plt.plot(graph_years, graph_popul, 'bo-', label="Estimated")
plt.ylabel('Population')
plt.xlabel('Year')

if printLabels:
    for x,y in zip(graph_years, graph_popul):
        label = "{:.2f}".format(y)
        plt.annotate(label, (x,y),textcoords="offset points", xytext=(0,10), ha='center')


truth_year = []
truth_pop = []

migration_year = []
migration_pop = []

# Calculate Truth Data
for year, value in input_pop:
    truth_year.append(year)
    truth_pop.append(value)
    if if_migration:

        # Calculate Migration
        for year_m, value_m in input_migration:
            if year == year_m:
                migration_year.append(year)
                migration_pop.append(value-value_m)

# Plot out all of the truth data
plt.plot(truth_year, truth_pop, 'ro-', label="Truth Data")
if if_migration:
    plt.plot(migration_year, migration_pop, 'mo-', label="Migration Truth Data")
plt.legend()

# Show labels
if printLabels:
    for x,y in zip(truth_year, truth_pop):
        label = "{:.2f}".format(y)
        plt.annotate(label, (x,y),textcoords="offset points", xytext=(0,10), ha='center')


# Save figure to file depending on console arguement
if args.save:
    plt.savefig(getattr(args, "save")[0] + ".png", dpi=400)

# Disable output display
if args.nodisplay:   
    plt.show()
