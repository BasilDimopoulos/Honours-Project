# Epidemic Model Backend
import itertools
import numpy as np
import os
from scipy.integrate import odeint
import sys
import time

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
    timeStep = 1

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


    def getInitCond(self):
        initConditions = []
        initConditions = self.initE, self.initI,self.initR, self.initN, self.initD
        return initConditions

    def setEquationParams(self, equationParams):
        if len(equationParams) != 5:
            sys.exit("Invalid list of equation parameters")

        self.beta, self.sigma, self.gamma, self.mu, self.x = equationParams

    def getEquationParams(self):
        equationParams = []
        equationParams = self.beta, self.sigma, self.gamma, self.mu, self.x
        return equationParams

    def setTimeStep(self, step):
        self.timeStep = step

    def getTimeStep(self):
        return self.timeStep

    def updateOutputs(self):
        tspan = np.arange(0, self.timeStep, 1)
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


def main():
    # main execution loop

    # main()
    c1 = Cell("Adelaide")
    c2 = Cell("Melbourne")

    c1.setInitCond([1,27,0,0,500])
    c1.setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
    c1.setTimeStep(2)
    c1.print()

    # print("Time step: " + str(c1.timeStep))
    print("Calculate step...\n")
    c1.updateOutputs()
    c1.print()
    # print(c1.getOutputs())

    print("Calculate step...\n")
    c1.updateOutputs()
    c1.print()



if __name__ == '__main__':
    main()