# Epidemic Model Backend
import itertools
import numpy as np
import os
from scipy.integrate import odeint
import sys
import time
from datetime import datetime
import json.decoder
from operator import add


class Application:
    # --- Instance Members ---
    cellCount = 0
    initAt = datetime.today()
    combinedCells = None
    
    # number of days to calulate epidemic functions over, default 2 (= 1 day)
    timeStep = 2
    # number of days the simulation will run for
    duration = 30
    # the current time of the simulation
    time = 0

    # --- End Instance Members ---

    def __init__(self):
        self.initAt = datetime.now()
        # list of all cells
        self.cells = []
        # list of all policies initialised in the exercise setup
        self.policies = []
        
    # Return the cell representing the combination of all cells.
    def getCombined(self):
        combinedCell = app.combinedCells
        if type(app.combinedCells) != type(None):
            if combinedCell.name == "All (Combined cells)":
                return combinedCell
        else: 
            return None
        

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

    sol = []

    # number of days to calulate epidemic functions over, default 1.
    # timeStep = 1

    # --- End Instance Members ---


    def __init__(self, name):
        self.id = Cell.newId()
        self.name = name
        self.S = []
        self.E = []
        self.I = []
        self.R = []
        self.D = []
        self.N = []

    def print(self):
        print("id: " + str(self.id) + "\t" + self.name + "\t")
        print("Initial Conditions: " + str(self.getInitCond()))
        print("Equation Parameters: " + str(self.getEquationParams()))
        print("Outputs: " + str(self.getOutputs()))
        print("Pop: " + str(self.N))
        print()

    # Set the 
    def setInitCond(self, initConditions):
        if len(initConditions) != 5:
            sys.exit("Invalid list of input conditions")

        self.E.append(float(initConditions[0]))
        self.I.append(float(initConditions[1]))
        self.R.append(float(initConditions[2]))
        self.D.append(float(initConditions[3]))
        self.N.append(float(initConditions[4]))
        self.S.append(float(initConditions[4]) - (float(initConditions[0]) + float(initConditions[1]) + float(initConditions[2]) + float(initConditions[3])))

    # returns the inital conditions in list in order of EIRND
    # which are taken from the latest SEIRD outputs
    def getInitCond(self):
        initConditions = []
        initConditions = self.E[-1], self.I[-1],self.R[-1], self.N[-1], self.D[-1]
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

    def updateOutputs(self, step, epiMults):
        # print("Updating outputs for: " + self.name)
        tspan = np.arange(0, step, 1)
        initial_conditions = self.getInitCond()
        params = self.getEquationParams()

        # handle adherence values, current not in use
        # policyPop = initial_conditions
        # remainingPop = initial_conditions

        if len(epiMults) > 0:
            print("Epidemic Multipliers to be applied")
            print(epiMults)
            policiesToApply = []
            for policy in epiMults:
                for objPol in app.policies:
                    if policy['policyId'] == objPol.id:
                        policiesToApply.append(objPol)

            # Apply the policy multipliers to the epidemic factors
            if len(policiesToApply) > 0:
                print("before applying: " + str(params))
                for policy in policiesToApply:
                    params = [a * b for a,b in zip(params, policy.getPolicy()[2:7])]
                    print("after applying: "+ policy.policyName)
                    print(params)
            
            print()

        self.sol = ode_solver(tspan, initial_conditions, params)
        S, E, I, R, D = self.sol[:, 0], self.sol[:, 1], self.sol[:, 2], self.sol[:, 3], self.sol[:, 4]
        self.S.extend(S[1:].tolist())
        self.E.extend(E[1:].tolist())
        self.I.extend(I[1:].tolist())
        self.R.extend(R[1:].tolist())
        self.D.extend(D[1:].tolist())

    def getOutputs(self):
        outputs = self.S, self.E, self.I, self.R, self.D
        return outputs
        

    # outputs param in form EIRND
    def setOutputs(self, outputs):
        self.E.append(outputs[0])
        self.I.append(outputs[1])
        self.R.append(outputs[2])
        self.D.append(outputs[4])
        self.S.append(outputs[3] - (outputs[0] + outputs[1] + outputs[2] + outputs[4]))

    def getPopulation(self):
        if len(self.N) != 0:
            return self.N[-1]

class Policy:
    # --- Start member variables ---
    newId = itertools.count().__next__
    policyName = ""
    betaMult = float(0)
    sigmaMult = float(0)
    gammaMult = float(0)
    muMult = float(0)
    xMult = float(0)
    defaultAhderence = 0

    # --- End member variables ---

    def __init__(self, name):
        self.id = Policy.newId()
        self.policyName = name

    def setPolicyDetails(self, details):
        self.betaMult, self.sigmaMult, self.gammaMult, self.muMult, self.xMult, self.defaultAhderence = details

    def getPolicy(self):
        policyDetails = [self.id, self.policyName, self.betaMult, self.sigmaMult, self.gammaMult, self.muMult, self.xMult, self.defaultAhderence]
        return policyDetails

    def print(self):
        print("id: " + str(self.id) + "\t" + self.policyName + "\t")
        print("Policy Details: " + str(self.getPolicy()[2:]))
        print()


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
    app.timeStep = data['timestep'] + 1
    app.duration = data['duration']

    # Create policy objects with their speicifed details
    policyList = data['policies']

    tempIt = 0
    for policy in policyList:
        app.policies.append(Policy(policy['name']))
        policyDetails = [policy['betaMult'], policy['sigmaMult'], policy['gammaMult'], policy['muMult'], policy['xMult'], policy['adherence']]
        # set the policy details
        app.policies[tempIt].setPolicyDetails(policyDetails)
        app.policies[tempIt].print()

        tempIt = tempIt + 1

    if len(app.policies) == len(policyList):
        if 'status' in response:
            response['status'] = "Successfully initalised policies\n"
    else:
        if 'status' in response:
            response['status'] += ". Error occured when creating policy objects"
        else:
            response['status'] = "Error occured when creating policy objects"

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
        # app.cells[tempIt].setOutputs(app.cells[tempIt].getInitCond())
        # set the epidemic equation parameters
        app.cells[tempIt].setEquationParams(equationParams)
        app.cells[tempIt].print()

        tempIt = tempIt + 1

    # app.cells.append(Cell("All (Combined cells)"))
    app.combinedCells = Cell("All (Combined cells)")
    initCombined = [0,0,0,0,0]
    app.combinedCells.setInitCond(initCombined)
    # app.cellCount = app.cellCount + 1

    # Element wise summation all other cells
    for cell in app.cells:
        app.combinedCells.S = list(map(add, app.combinedCells.S, cell.S))
        app.combinedCells.E = list(map(add, app.combinedCells.E, cell.E))
        app.combinedCells.I = list(map(add, app.combinedCells.I, cell.I))
        app.combinedCells.R = list(map(add, app.combinedCells.R, cell.R))
        app.combinedCells.D = list(map(add, app.combinedCells.D, cell.D))
        app.combinedCells.N = list(map(add, app.combinedCells.N, cell.N))

    # print(str(app.combinedCells.name))
    app.combinedCells.print()

    app.initAt = datetime.now()

    print("Created %d cells" % (len(app.cells) + 1))
    print("Time step: %d" % app.timeStep)
    print("Duration: %d" % app.duration)

    if app.cellCount == len(app.cells):
        response['status'] = "Successfully initalised application instance"
    else:
        if 'status' in response:
            response['status'] = response['status'] + ". Error occured when creating cell objects"
        else:
            response['status'] = "Error occured when creating cell objects"
        
    return response

def nextStep(data):
    response = {}
    allCellPolicies = []
    if 'cells' in data:
        allCellPolicies = data['cells']

    obj_key = 'timestep'
    cellPolicies = []
    if obj_key in data:
        print("Custom timestep of %d day(s) provided, using this" % int(data['timestep']))
        customStep = int(data['timestep']) + 1
        for cell in app.cells:
            cellPolicies = []
            for currCellPols in allCellPolicies:
                if cell.name == currCellPols['name']:
                    cellPolicies = currCellPols['policies']
                    break
                else:
                    cellPolicies = []
            print(cell.name)
            cell.updateOutputs(customStep, cellPolicies)

        app.time = app.time + (customStep - 1)
        response['status'] = "Sucessfully progressed " + str(customStep-1) +  " day(s)"

    else:
        print("Using default timestep of %d day(s)" % int(app.timeStep-1))
        customStep = app.timeStep
        for cell in app.cells:
            cellPolicies = []
            for currCellPols in allCellPolicies:
                if cell.name == currCellPols['name']:
                    cellPolicies = currCellPols['policies']
                    break
            print(cell.name)
            cell.updateOutputs(app.timeStep, cellPolicies)

        app.time = app.time + (app.timeStep - 1)
        response['status'] = "Sucessfully progressed to next step"

    # Update combined cell
    tempS = []
    tempE = []
    tempI = []
    tempR = []
    tempD = []
    tempN = []
    tempIt = 0
    for cell in app.cells:
        if tempIt == 0:
            tempS = cell.S
            tempE = cell.E
            tempI = cell.I
            tempR = cell.R
            tempD = cell.D
            tempN = cell.N
        else:
            tempS = list(map(add, cell.S[-(customStep-1):], tempS[-(customStep-1):]))
            tempE = list(map(add, cell.E[-(customStep-1):], tempE[-(customStep-1):]))
            tempI = list(map(add, cell.I[-(customStep-1):], tempI[-(customStep-1):]))
            tempR = list(map(add, cell.R[-(customStep-1):], tempR[-(customStep-1):]))
            tempD = list(map(add, cell.D[-(customStep-1):], tempD[-(customStep-1):]))
            tempN = list(map(add, cell.N[-(customStep-1):], tempN[-(customStep-1):]))

        tempIt += 1
    
    app.combinedCells.S.extend(tempS)
    app.combinedCells.E.extend(tempE)
    app.combinedCells.I.extend(tempI)
    app.combinedCells.R.extend(tempR)
    app.combinedCells.D.extend(tempD)
    app.combinedCells.N.extend(tempN)
    app.combinedCells.print()

    return response

def getAllCells(data):
    response = {}

    response['time'] = app.time
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

    # Append the combined cell
    countWithCombined = 0
    if type(app.combinedCells) != type(None):
        cellData = {}
        cellData['name'] = app.combinedCells.name
        cellData['population'] = app.combinedCells.getPopulation()
        # list in format SEIRD
        epiOutputs = app.combinedCells.getOutputs()
        cellData['susceptibles'] = epiOutputs[0]
        cellData['exposed'] = epiOutputs[1]
        cellData['infected'] = epiOutputs[2]
        cellData['recovered'] = epiOutputs[3]
        cellData['deaths'] = epiOutputs[4]
        response['cells'].insert(0, cellData)
        countWithCombined += 1

    if (len(response['cells']) == (len(app.cells) + countWithCombined)):   
        response['status'] = "Successfully returned all cells"

    else:
        response['status'] = "Error fetching all cell data"

    return response

def getAppInfo(data):
    response = {}

    appInfo = {}
    appInfo['cellCount'] = app.cellCount
    appInfo['initAt'] = str(app.initAt)
    appInfo['timeStep'] = app.timeStep
    appInfo['duration'] = app.duration
    appInfo['time'] = app.time

    response['Application Info'] = appInfo
    response['status'] = "Successfully returned application information"

    return response

        
def reset(data):
    response = {}
    # reset member variables an application parameters
    app.cellCount = 0
    app.timeStep = 0
    app.duration = 0
    app.time = 0
    app.initAt = 0

    appInfo = {}
    appInfo['cellCount'] = app.cellCount
    appInfo['timeStep'] = app.timeStep
    appInfo['duration'] = app.duration
    appInfo['time'] = app.time
    response['Application Info'] = appInfo

    # clear the cells
    del app.cells[:]
    if len(app.cells) == 0:
        response['status'] = "Successfully reset application state"
    else:
        app.cellCount = len(app.cells)
        response['status'] = "Error clearning cells, application was not sucessfully reset"

    return response

def main():
    # main execution loop
    app.timeStep = 5

    # c1 = Cell("SA")
    # c2 = Cell("VIC")
    # c3 = Cell("NSW")
    app.cells.append(Cell("SA"))
    app.cells.append(Cell("VIC"))
    app.cells.append(Cell("NSW"))

    # E I R D N
    app.cells[0].setInitCond([12,3,2,1,50])
    app.cells[0].setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
    # c1.setTimeStep(2)

    app.cells[1].setInitCond([5,30,12,20,70])
    app.cells[1].setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
    # # # c2.setTimeStep(2)

    app.cells[2].setInitCond([12,15,18,10,80])
    app.cells[2].setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
    # c3.setTimeStep(2)

    app.cells[0].print()
    app.cells[1].print()
    app.cells[2].print()

 

    # print("Calculate step...\n")
    # app.cells[0].updateOutputs()
    # app.cells[0].print()
    # app.cells[0].updateOutputs()
    # app.cells[1].updateOutputs()
    # app.cells[2].updateOutputs()
    # app.cells[0].print()
    # app.cells[1].print()
    # app.cells[2].print()

    

    data = {}
    data['control'] = "getAppInfo"

    getAppInfo(data)

    data['control'] = "getAppInfo"
    # nextStep(data)
    # nextStep(data)
    print(json.dumps(getAllCells(data)))

    data['control'] = "reset"
    # print(json.dumps(reset(data)))

    data['control'] = "getAllCells"
    # print(json.dumps(getAllCells(data)))

if __name__ == '__main__':
    main()
