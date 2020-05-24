#!/usr/bin/env python
# coding: utf-8

# In[55]:


import numpy as np
import matplotlib.pyplot as plt


# In[19]:


# Python program to implement Runge Kutta method 
# A sample differential equation "dy / dx = (x - y)/2" 
def suceptible(beta,z,s,e,i,r): 
    n = s + r + i + r
    dsdt = (-(beta * s * i)/n + z*r)
    return dsdt

def exposed(beta,sigma,s,e,i,r): 
    n = s + r + i + r
    dedt = ((beta * s * i)/n - sigma*e)
    return dedt

def infected(sigma,gamma,e,i): 
    didt = (sigma*e - gamma*i)
    return didt

def recovered(gamma,z,i,r): 
    drdt = (gamma*i - z*r)
    return drdt


# In[77]:


#covid values
beta = 1.95
sigma = 0.066
gamma = 0.154
z = 0.154

#initial values
initialS = 500
initialI = 0
initialE = 1
initialR = 0

totalS = initialS
totalI = initialI
totalE = initialE
totalR = initialR

#array
sArray = []
iArray = []
eArray = []
rArray = []
sArray.append(initialS)
rArray.append(initialR)
iArray.append(initialI)
eArray.append(initialE)

for index in range(1,50):
    totalS = totalS + suceptible(beta,z,totalS,totalE,totalI,totalR)
    sArray.append(totalS)
    totalE = totalE + exposed(beta,sigma,totalS,totalE,totalI,totalR)
    eArray.append(totalE)
    totalI = totalI + infected(sigma,gamma,totalE,totalI)
    iArray.append(totalI)
    totalR = totalR + recovered(gamma,z,totalI,totalR)
    rArray.append(totalR)


# In[78]:


"susepital is:", totalS,"exposed is: ", totalE, "infective is: ", totalI, "recovered is: ", totalR


# In[92]:


fig = plt.figure()
ax1 = fig.add_subplot(211)
ax1.plot(sArray)
ax2 = fig.add_subplot(222)
ax2.plot(eArray)
plt.show()


# In[95]:


plt.plot(sArray, label="Susceptible")
plt.plot(eArray, label = "Exposed")
plt.plot(iArray, label = "Infected")
plt.plot(rArray, label = "Recovered")
plt.legend()
plt.show()


# In[ ]:




