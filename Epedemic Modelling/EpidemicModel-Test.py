import unittest
import EpidemicModel as EM


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
    def test_EM004(self):
        c1 = EM.Cell("Adelaide")
        c1.setInitCond([1,27,0,0,500])
        c1.setEquationParams([2.79*(1/2.9), 0.2, 1/2.9, 0.01, 0.14])
        EM.app.timeStep = 2
        c1.updateOutputs(EM.app.timeStep)
        correctOutput = [472.0, 451.71881842639687], [1.0, 19.61676947322724], [27.0, 20.901963282821953], [0.0, 7.527802888432526], [0.0, 0.23464592912168014]
        self.assertEqual(c1.getOutputs(), correctOutput)


# Start Unit Tests
print("Epidemic Model Test Suite:     (Add -v for verbose output)")
print("----------------------------------------------------------------------")
print("")
if __name__ == '__main__':
    unittest.main()
