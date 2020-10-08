# Epidemic Model Backend
import itertools
import numpy as np
import os
from scipy.integrate import odeint
import sys
import time
from datetime import datetime


class Application:
    # --- Instance Members ---
    cellCount = 0
    initAt = datetime.today()
    # list of all cells
    cells = []
    timeStep = 0
    duration = 0
    time = 0

    # --- End Instance Members ---

    def __init__(self):
        self.initAt = datetime.now()

app = Application()

class Cell:
    # --- Static members ---
    newId = itertools.count().__next__

    # --- End Static Members ---

    # -- Instance members --
    name = ""

    # initial values for population and SEIRDS
    initN = 0
    initS = 0
    initE = 0
    initI = 0
    initR = 0
    initD = 0

    # incubation rate
    sigma = 0
    # recovery rate
    gamma = 0
    # death rate
    mu = 0
    # reproductive number
    R0 = 0
    # effective infection rate
    beta = 0
    # Return to susceptibility rate
    x = 0

    # outputs
    S = float(0)
    E = float(0)
    I = float(0)
    R = float(0)
    D = float(0)
    N = 0
    sol = []

    # number of days to calulate epidemic functions over, default 1.
    # timeStep = 1

    # --- End Instance Members ---


    def __init__(self, name):
        self.id = Cell.newId()
        self.name = name
    

    def print(self):
        print("id: " + str(self.id) + "\t" + self.name + "\t")
        print("Initial Conditions: " + str(self.getInitCond()))
        print("Equation Parameters: " + str(self.getEquationParams()))
        print("Outputs: " + str(self.getOutputs()))
        print("Pop: " + str(self.initN))
        print()

    def setInitCond(self, initConditions):
        if len(initConditions) != 5:
            sys.exit("Invalid list of input conditions")

        self.initE, self.initI, self.initR, self.initD, self.initN  = initConditions
        self.initS = self.initN - (self.initE + self.initI + self.initR + self.initD)


    # returns the inital conditions in list in order of EIRND
    def getInitCond(self):
        initConditions = []
        initConditions = self.initE, self.initI,self.initR, self.initN, self.initD
        return initConditions

    # in order of beta, sigma, gamma, mu, x
    def setEquationParams(self, equationParams):
        if len(equationParams) != 5:
            sys.exit("Invalid list of equation parameters")

        self.beta, self.sigma, self.gamma, self.mu, self.x = equationParams

    # return a list of the equatin params in order of
    # beta, sigma, gamma, mu, x
    def getEquationParams(self):
        equationParams = []
        equationParams = self.beta, self.sigma, self.gamma, self.mu, self.x
        return equationParams

    # def setTimeStep(self, step):
    #     self.timeStep = step

    # def getTimeStep(self):
    #     return self.timeStep

    def updateOutputs(self):
        print("Updating outputs for: " + self.name)
        tspan = np.arange(0, app.timeStep, 1)
        initial_conditions = self.getInitCond()
        params = self.getEquationParams()
        self.sol = ode_solver(tspan, initial_conditions, params)
        S, E, I, R, D = self.sol[:, 0], self.sol[:, 1], self.sol[:, 2], self.sol[:, 3], self.sol[:, 4]
        self.S = S[-1]
        self.E = E[-1]
        self.I = I[-1]
        self.R = R[-1]
        self.D = D[-1]
        self.setInitCond([self.E, self.I, self.R, self.D, self.initN])

    def getOutputs(self):
        outputs = self.S, self.E, self.I, self.R, self.D
        return outputs

    # outputs param in form EIRND
    def setOutputs(self, outputs):
        self.E = outputs[0]
        self.I = outputs[1]
        self.R = outputs[2]
        self.D = outputs[4]
        self.S = outputs[3] - (outputs[0] + outputs[1] + outputs[2] + outputs[4])

    def getPopulation(self):
        if type(self.initN) != type(None):
            return self.initN


def ode_model(z, t, beta, sigma, gamma, mu, x):
    """
    Reference https://www.idmod.org/docs/hiv/model-seir.html
    """
    #x is the return to susceptibility rate
    #mu is death rate 
    S, E, I, R, D = z
    N = S + E + I + R + D
    dSdt = -beta*S*I/N  + x*R
    dEdt = beta*S*I/N - sigma*E
    dIdt = sigma*E - gamma*I - mu*I
    dRdt = gamma*I - x*R
    dDdt = mu*I
    return [dSdt, dEdt, dIdt, dRdt, dDdt]

def ode_solver(t, initial_conditions, params):
    initE, initI, initR, initN, initD = initial_conditions
    beta, sigma, gamma, mu, x = params
    initS = initN - (initE + initI + initR + initD)
    res = odeint(ode_model, [initS, initE, initI, initR, initD], t, args=(beta, sigma, gamma, mu,x))
    return res


def initApp(data):
    response = {}
    # set the timestep and duration of the simulation
    app.timeStep = data['timestep']
    app.duration = data['duration']
    # Set the number of cells, create their objects and set their variables
    app.cellCount = len(data['cells'])

    cellsList = data['cells']

    tempIt = 0
    for cell in cellsList:
        app.cells.append(Cell(cell['name']))
        initConds = [cell['exposed'], cell['infected'], cell['recovered'], cell['deaths'], cell['population']]
        equationParams = [cell['beta'], cell['sigma'], cell['gamma'], cell['mu'], cell['x']]
        # set the intial conditions
        app.cells[tempIt].setInitCond(initConds)
        # set the outputs to the initial conditions (same for t=0)
        app.cells[tempIt].setOutputs(app.cells[tempIt].getInitCond())
        # set the epidemic equation parameters
        app.cells[tempIt].setEquationParams(equationParams)
        app.cells[tempIt].print()

        tempIt = tempIt + 1

        
    print("Created %d cells" % app.cellCount)
    print("Time step: %d" % app.timeStep)
    print("Duration: %d" % app.duration)

    if app.cellCount == len(app.cells):
        response['status'] = "Successfully initalised application instance"
    else:
        response['status'] = "Error occured when creating cell objects"
        
    return response

def nextStep(data):
    response = {}
    for cell in app.cells:
        cell.updateOutputs()

    response['status'] = "Sucessfully progressed to next step"

    return response

def getAllCells(data):
    response = {}

    response['cells'] = []
    for cell in app.cells:
        cellData = {}
        cellData['name'] = cell.name
        cellData['population'] = cell.getPopulation()
        # list in format SEIRD
        epiOutputs = cell.getOutputs()
        cellData['susceptibles'] = epiOutputs[0]
        cellData['exposed'] = epiOutputs[1]
        cellData['infected'] = epiOutputs[2]
        cellData['recovered'] = epiOutputs[3]
        cellData['deaths'] = epiOutputs[4]

        response['cells'].append(cellData)



    response['status'] = "Successfully returned all cells"

    return response


def main():
    # main execution loop
    app.timeStep = 2

    c1 = Cell("SA")
    c2 = Cell("VIC")
    c3 = Cell("NSW")

    # E I R D N
    c1.setInitCond([12,3,2,1,50])
    c1.setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
    # c1.setTimeStep(2)

    c2.setInitCond([5,30,12,20,70])
    c2.setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
    # c2.setTimeStep(2)

    c3.setInitCond([12,15,18,10,80])
    c3.setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
    # c3.setTimeStep(2)

    c1.print()
    c2.print()
    c3.print()


    print("Calculate step...\n")
    c1.updateOutputs()
    c2.updateOutputs()
    c3.updateOutputs()
    c1.print()
    c2.print()
    c3.print()

if __name__ == '__main__':
    main()