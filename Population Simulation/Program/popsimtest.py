# Program imports
import shlex
from subprocess import Popen, PIPE
import re
import unittest
from PIL import Image

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
    
    # Test_PS001: No Arguements
    def test_PS001(self):
        cmd = "python3 popsim.py"
        out = runCommand(cmd)[1]
        expected = ['usage: popsim.py [-h] -i INPUT [-p POPULATION] [-d DURATION] [-l] [-ut] [-ndt]', '                 [-s SAVE] [-nd] [-ag] [-ar AGERATIOS AGERATIOS AGERATIOS]', '                 [-dpi DPI]', 'popsim.py: error: the following arguments are required: -i/--input']
        self.assertEqual(out, expected)

    # Test_PS002: Test to see if reponse is created for 10 years
    def test_PS002(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -d 10 -nd"
        out = runCommand(cmd)[0]
        expected = ['Reading from file: test1.csv...', '2000 19028802', '2001 19150147', '2002 19267997', '2003 19385278', '2004 19504147', '2005 19764685', '2006 20055644', '2007 20390244', '2008 20788572', '2009 21262588', '2010 21669981']
        self.assertEqual(out, expected)

    # Test_PS003: Check if Use Truth data provides a different result to when it is not used
    def test_PS003(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -d 10 -nd -ut"
        out = runCommand(cmd)[0]
        expected = ['Reading from file: test1.csv...', '2000 19028802', '2001 19274701', '2002 19495210', '2003 19720737', '2004 19932722', '2005 20176844', '2006 20450966', '2007 20827622', '2008 21249199', '2009 21691653', '2010 22031750']
        self.assertEqual(out, expected)

    # Test_PS004: Check to see if image output is correct
    def test_PS004(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -d 10 -nd -s test4"
        out = runCommand(cmd)[0]
        img_calc  = Image.open('test4.png')
        img_truth = Image.open('test_data/test4-truth.png') 
        self.assertEqual(list(img_calc.getdata()), list(img_truth.getdata()))
        runCommand("rm test4.png")

    # Test_PS005: Test with different starting population
    def test_PS005(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -d 10 -nd -p 100"
        out = runCommand(cmd)[0]
        expected = ['Reading from file: test1.csv...', '2000 100', '2001 121444', '2002 239295', '2003 356576', '2004 475445', '2005 735983', '2006 1026942', '2007 1361542', '2008 1759870', '2009 2233886', '2010 2641279']
        self.assertEqual(out, expected)

    # Test_PS006: Test with different number of years
    def test_PS006(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -nd"
        out = runCommand(cmd)[0]
        expected = ['Reading from file: test1.csv...', '2000 19028802', '2001 19150147', '2002 19267997', '2003 19385278']
        self.assertEqual(out, expected)
    
    # Test_PS007: Test output image if no truth data is displayed
    def test_PS007(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -ndt -nd -s test7"
        out = runCommand(cmd)[0]
        img_calc  = Image.open("test7.png")
        img_truth = Image.open("test_data/test7-truth.png")
        self.assertEqual(list(img_calc.getdata()), list(img_truth.getdata()))
        runCommand("rm test7.png")    

    # Test_PS008: Test output image if labels are printed
    def test_PS008(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -l -nd -s test8"
        out = runCommand(cmd)[0]
        img_calc  = Image.open("test8.png")
        img_truth = Image.open("test_data/test8-truth.png")
        self.assertEqual(list(img_calc.getdata()), list(img_truth.getdata()))
        runCommand("rm test8.png")    

    # Test_PS009: Properly displays help menu
    def test_PS009(self):
        cmd = "python3 popsim.py --help"
        out = runCommand(cmd)[0]
        expected = ['usage: popsim.py [-h] -i INPUT [-p POPULATION] [-d DURATION] [-l] [-ut] [-ndt]', '                 [-s SAVE] [-nd] [-ag] [-ar AGERATIOS AGERATIOS AGERATIOS]', '                 [-dpi DPI]', '', 'Run a population simulation on given input data.', '', 'optional arguments:', '  -h, --help            show this help message and exit', '  -i INPUT, --input INPUT', '                        Input file location (Required Value)', '  -p POPULATION, --population POPULATION', '                        Provide an integer value for starting population', '  -d DURATION, --duration DURATION', '                        Provide an integer value for number duration to run', '                        the simulate for, in years', '  -l, --labels          Enable Labels on output graph', '  -ut, --usetruth       Use truth data years for output', '  -ndt, --nodisplayedtruth', "                        Don't display truth data on output graph", '  -s SAVE, --save SAVE  Output file (.png)', '  -nd, --nodisplay      Disables gui output', '  -ag, --agegroups      Enable the use of age groups, to be used with', '                        -ar/--ageratios', '  -ar AGERATIOS AGERATIOS AGERATIOS, --ageratios AGERATIOS AGERATIOS AGERATIOS', '                        Provide the proportion of each age group in the', '                        population (0-19, 20-49, 50+) as a pecentage.', '  -dpi DPI, --dpi DPI   Set DPI for final file output']
        self.assertEqual(out, expected)

    # Test_PS010: Display test
    @unittest.skip("Skipping Visual Display Test")
    def test_PS010(self):
        cmd = "python3 popsim.py -i test_data/test1.csv"
        out = runCommand(cmd)[0]
        expected = ['Reading from file: test1.csv...', '2000 19028802', '2001 19150147', '2002 19267997', '2003 19385278']
        self.assertEqual(out, expected)

    # Test_PS011: Test to see if the default population groups and ratios produce the correct values for 10 year sim
    def test_PS011(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -d 10 -nd -ag"
        out = runCommand(cmd)[0]
        expected = ['Age groups are enabled, the groups are:', '(0, 19) (20, 49) (50, 125) ', 'Proportions for age groups not provided, using default (AUS 2019)', '24.6\t41.8\t33.5\t', 'Reading from file: test1.csv...', '2000 19028802', '2001 19150147', '2002 19267997', '2003 19385278', '2004 19504147', '2005 19764685', '2006 20055644', '2007 20390244', '2008 20788572', '2009 21262588', '2010 21669981', 'Approximate population age groups in 2010 are:', '(0, 19)\t24.6%\t5330815', '(20, 49)\t41.8%\t9058052', '(50, 125)\t33.5%\t7259444']
        self.assertEqual(out, expected)

    # Test_PS012: Test to see if the default population groups produce correct values for custom ratios
    def test_PS012(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -d 10 -nd -ag -ar 25 25 50"
        out = runCommand(cmd)[0]
        expected = ['Age groups are enabled, the groups are:', '(0, 19) (20, 49) (50, 125) ', 'The specified age ratios are: ', '25.0\t25.0\t50.0\t', 'Reading from file: test1.csv...', '2000 19028802', '2001 19150147', '2002 19267997', '2003 19385278', '2004 19504147', '2005 19764685', '2006 20055644', '2007 20390244', '2008 20788572', '2009 21262588', '2010 21669981', 'Approximate population age groups in 2010 are:', '(0, 19)\t25.0%\t5417495', '(20, 49)\t25.0%\t5417495', '(50, 125)\t50.0%\t10834990']
        self.assertEqual(out, expected)

    # Test_PS013: Input checking, that population proportions sum to 100
    def test_PS013(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -d 10 -nd -ag -ar 25 25 35"
        out = runCommand(cmd)[0]
        expected = ['Age groups are enabled, the groups are:', '(0, 19) (20, 49) (50, 125) ', 'The sum of the given proportions is not 100, please correct the input values:', '[25.0, 25.0, 35.0]']
        self.assertEqual(out, expected)

    # Test_PS014: Input checking, that population proportions sum to 100 when rounded to nearest decimal
    def test_PS014(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -d 10 -nd -ag -ar 24.6 41.8 33.5"
        out = runCommand(cmd)[0]
        expected = ['Age groups are enabled, the groups are:', '(0, 19) (20, 49) (50, 125) ', 'The specified age ratios are: ', '24.6\t41.8\t33.5\t', 'Reading from file: test1.csv...', '2000 19028802', '2001 19150147', '2002 19267997', '2003 19385278', '2004 19504147', '2005 19764685', '2006 20055644', '2007 20390244', '2008 20788572', '2009 21262588', '2010 21669981', 'Approximate population age groups in 2010 are:', '(0, 19)\t24.6%\t5330815', '(20, 49)\t41.8%\t9058052', '(50, 125)\t33.5%\t7259444']
        self.assertEqual(out, expected)

    # Test_PS015: PS015 Visual test to check that the population groups have been graphed without labels
    def test_PS015(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -nd -s test15 -d 10 -ag"
        out = runCommand(cmd)[0]
        img_calc  = Image.open("test15.png")
        img_truth = Image.open("test_data/test15-truth.png")
        self.assertEqual(list(img_calc.getdata()), list(img_truth.getdata()))
        runCommand("rm test15.png")  

    # Test_PS016: Test output image if labels are printed
    def test_PS016(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -l -nd -s test16 -d 10 -ag"
        out = runCommand(cmd)[0]
        img_calc  = Image.open("test16.png")
        img_truth = Image.open("test_data/test16-truth.png")
        self.assertEqual(list(img_calc.getdata()), list(img_truth.getdata()))
        runCommand("rm test16.png")  

    # Test_PS017: Input checking, that population proportions sum to 100 when rounded to nearest decimal
    def test_PS017(self):
        cmd = "python3 popsim.py -i test_data/test1.csv -d 10 -nd -ag -ar 50 51 -1"
        out = runCommand(cmd)[0]
        expected = ['Age groups are enabled, the groups are:', '(0, 19) (20, 49) (50, 125) ', 'Invalid proportion given: -1.0 must be >= 0']
        self.assertEqual(out, expected)

    # Fail Example
    # @unittest.skip
    # def test_fail(self):
    #     cmd = "ls"
    #     out = runCommand(cmd)[0]
    #     expected = ['']
    #     self.assertEqual(out, expected)

# Start unit tests
print("Population Simulation Test Suite:     (Add -v for verbose output)")
print("----------------------------------------------------------------------")
print("")
if __name__ == '__main__':
    unittest.main()
