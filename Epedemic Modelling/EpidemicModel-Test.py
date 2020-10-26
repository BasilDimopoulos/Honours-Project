import unittest
import EpidemicModel as EM
import json.decoder


# Testing Class
class TESTING(unittest.TestCase):
    
    # Test 1 - Test Setters and Getters of Initial Conditions
    def test_EM001(self):
        c1 = EM.Cell("Adelaide")
        c1.setInitCond([1, 27, 0, 0, 500])  
        self.assertEqual(c1.getInitCond(), (1, 27, 0, 500, 0))

    # Test 2 - Test Setters and Getters of Equation Paramaters
    def test_EM002(self):
        c1 = EM.Cell("Adelaide")
        c1.setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
        self.assertEqual(c1.getEquationParams(), (0.9620689655172414, 0.2, 0.3448275862068966, 0.01, 0.14))

    # Test 3 - Test Setters and Getters of Time Step
    def test_EM003(self):
        c1 = EM.Cell("Adelaide")
        EM.app.timeStep = 2
        self.assertEqual(EM.app.timeStep, 2)

    # Test 4 - Test Setters Update, Outputs and Get outputs
    # def test_EM004(self):
    #     c1 = EM.Cell("Adelaide")
    #     c1.setInitCond([1,27,0,0,500])
    #     c1.setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
    #     EM.app.timeStep = 2
    #     c1.updateOutputs(EM.app.timeStep)
    #     correctOutput = [472.0, 451.71881842639687], [1.0, 19.61676947322724], [27.0, 20.901963282821953], [0.0, 7.527802888432526], [0.0, 0.23464592912168014]
    #     self.assertEqual(c1.getOutputs(), correctOutput)

    # Test 5 - Test updating outputs over for time steps > 1 day
    # def test_EM005(self):
    #     c1 = EM.Cell("Adelaide")
    #     c1.setInitCond([1,27,0,0,500])
    #     c1.setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
    #     EM.app.timeStep = 5
    #     correctOutput = [472.0, 451.71881842639687, 436.30679727540706, 422.6331932346779, 409.23084512205855], [1.0, 19.61676947322724, 31.30727972496371, 39.9467376907329, 47.335268744761336], [27.0, 20.901963282821953, 19.06551433321007, 19.43838776478204, 21.02641747313808], [0.0, 7.527802888432526, 12.888397170219887, 17.358470622231636, 21.58269134959251], [0.0, 0.23464592912168014, 0.4320114961995488, 0.6232106875758036, 0.8247773104497161]
    #     c1.updateOutputs(EM.app.timeStep)
    #     self.assertEqual(c1.getOutputs(), correctOutput)

    # Test 6 - Test getAllCells function to ensure the data is being returned in the correct format
    def test_EM006(self):
        EM.app.timeStep = 5
        EM.app.cells.append(EM.Cell("SA"))
        EM.app.cells.append(EM.Cell("VIC"))
        EM.app.cells.append(EM.Cell("NSW"))
        EM.app.cells[0].setInitCond([12,3,2,1,50])
        EM.app.cells[0].setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
        EM.app.cells[1].setInitCond([5,30,12,20,70])
        EM.app.cells[1].setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
        EM.app.cells[2].setInitCond([12,15,18,10,80])
        EM.app.cells[2].setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])

        data ={}
        data['control'] = "getAllCells"
        correctOutput = {'time': 0, 'cells': [{'name': 'SA', 'population': 50.0, 'susceptibles': [32.0], 'exposed': [12.0], 'infected': [3.0], 'recovered': [2.0], 'deaths': [1.0]}, {'name': 'VIC', 'population': 70.0, 'susceptibles': [3.0], 'exposed': [5.0], 'infected': [30.0], 'recovered': [12.0], 'deaths': [20.0]}, {'name': 'NSW', 'population': 80.0, 'susceptibles': [25.0], 'exposed': [12.0], 'infected': [15.0], 'recovered': [18.0], 'deaths': [10.0]}], 'status': 'Successfully returned all cells'}
        self.assertEqual(EM.getAllCells(data), correctOutput)

    # Test 7 - Test getAppInfo response is correct
    def test_EM007(self):
        EM.app.timeStep = 3
        EM.app.duration = 35
        EM.app.time = 0
        EM.app.cellCount = 0

        data = {}
        data['control'] = "getAppInfo"
        temp = {}
        temp['cellCount'] = 0
        temp['timeStep'] = 3
        temp['duration'] = 35
        temp['time'] = 0
        correctOutput = {}
        correctOutput['Application Info'] = temp
        correctOutput['status'] = "Successfully returned application information"

        response = {}
        response = EM.getAppInfo(data)

        if 'initAt' in response['Application Info']:
            del response['Application Info']['initAt']
        self.assertEqual(response, correctOutput)

    # Test 8 - Test Application reset function
    def test_EM008(self):
        response = {}
        EM.app.timeStep = 5
        EM.app.duration = 35
        EM.app.time = 5
        EM.app.cellCount = 3
        EM.app.cells.append(EM.Cell("SA"))
        EM.app.cells.append(EM.Cell("VIC"))
        EM.app.cells.append(EM.Cell("NSW"))

        correctOutput = {}
        temp = {}
        temp['cellCount'] = 0
        temp['timeStep'] = 0
        temp['duration'] = 0
        temp['time'] = 0
        correctOutput['Application Info'] = temp
        correctOutput['status'] = "Successfully reset application state"

        data = {}
        data['control'] = "reset"

        response = EM.reset(data)
        self.assertEqual(response, correctOutput)

# Start Unit Tests
print("Epidemic Model Test Suite:     (Add -v for verbose output)")
print("----------------------------------------------------------------------")
print("")
if __name__ == '__main__':
    unittest.main()
