# Program imports
import shlex
from subprocess import Popen, PIPE
import re
import unittest

# Pass command to bash and run the test and return std output and std error
def runCommand(cmd):
    process = Popen(shlex.split(cmd), stdout=PIPE, stderr=PIPE)
    (output, err) = process.communicate()
    output = output.decode('utf-8')
    err = err.decode('utf-8')
    outarr = output.splitlines()
    errarr = err.splitlines()
    return (outarr, errarr)


# Class for unit test library
class TESTING(unittest.TestCase):
    
    # Test 1: No Arguements
    def test1(self):
        cmd = "python3 popsim.py"
        out = runCommand(cmd)[1]
        expected = ['usage: popsim.py [-h] -i INPUT [-p POPULATION] [-d DURATION] [-l] [-ut] [-ndt]', '                 [-s SAVE] [-nd]', 'popsim.py: error: the following arguments are required: -i/--input']
        self.assertEqual(out, expected)

    # Test 2: Test to see if reponse is created for 10 years
    def test2(self):
        cmd = "python3 popsim.py -i ../Data/BIRTHS_DEATHS_POP_AUS_2000_to_2011.csv -d 10 -nd"
        out = runCommand(cmd)[0]
        expected = ['Reading from file: BIRTHS_DEATHS_POP_AUS_2000_to_2011.csv...', '2000 19028802', '2001 19150147', '2002 19267997', '2003 19385278', '2004 19504147', '2005 19764685', '2006 20055644', '2007 20390244', '2008 20788572', '2009 21262588', '2010 21669981']
        self.assertEqual(out, expected)

    # Test 3: Check if Use Truth data provides a different result to when it is not used
    def test3(self):
        cmd = "python3 popsim.py -i ../Data/BIRTHS_DEATHS_POP_AUS_2000_to_2011.csv -d 10 -nd -ut"
        out = runCommand(cmd)[0]
        expected = ['Reading from file: BIRTHS_DEATHS_POP_AUS_2000_to_2011.csv...', '2000 19028802', '2001 19274701', '2002 19495210', '2003 19720737', '2004 19932722', '2005 20176844', '2006 20450966', '2007 20827622', '2008 21249199', '2009 21691653', '2010 22031750']
        self.assertEqual(out, expected)

# Start unit tests
print("Population Simulation Test Suite:")
print("----------------------------------------------------------------------")
print("")
if __name__ == '__main__':
    unittest.main()
