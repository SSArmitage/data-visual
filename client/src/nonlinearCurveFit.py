# -*- coding: utf-8 -*-
# I used the following code to create a nonlinear fit to for the Average Events vs Hours data (used a basic sin function and optimized the parameters based on the data -> took the resulting curve function and used it in the SelectData.js file, plugging in the x (hours) and y (average events) values and plotting this on the same graph as the original data)

from pylab import *
from scipy.optimize import leastsq
from numpy import random
 
def residuals(p, y, t):
    err = y - sine_signal(t, p)
    return err
 
def sine_signal(t, p):
    return p[0] * sin(2 * pi * t / p[1] + p[2]) + p[3]

#data
x_data = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])
y_data = np.array([8, 9, 5, 6, 6, 7, 11, 6, 5, 7, 5, 7, 9, 8, 7, 6, 8, 8, 12, 7, 7, 7, 9, 4])

signal_amp = 2.0
period = 6.0
phase = -pi/4
vertical = 6.0

#paramters to optimize
p = signal_amp, period, phase, vertical

#initial guess of parameters
p0 = 10 * signal_amp, 1.3 * period, 1.8 * phase, 1.5 * vertical
 
#perform least square fit

plsq = leastsq(residuals, p0, args = (y_data, x_data))

#plot data
plot(x_data, y_data, color='blue')
plot(x_data, sine_signal(x_data, plsq[0]), color='red')

show()