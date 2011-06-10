#!/usr/bin/env python

import os, sys

from interface import Interface, Display, Controls
from parameters import PercentParameter, Parameter
from simulation import Simulation
from numpy import pi

# Return immediately if this is being imported in another module.
if __name__ == "__main__":

    # Run in a different process.
    if os.fork():
        sys.exit()

    # Instantiate the main interface object.
    main = Interface()

    # Create the other components of the interface...
    display = Display(main)
    controls = Controls(main)
    simulation = Simulation(main)

    # ...and add a set of slider controls to it.
    electronMass= 9.10938188e-31 # Kg
    c = 299792458
    width = Parameter("Width of slits", 1e-50, 1e-12)
    distance = Parameter("Distance between slits", 1e-50, 10e-12)
    mass = Parameter("Particle mass", 0.01*electronMass, 10*electronMass, electronMass)
    velocity = Parameter("Particle velocity", 0, c, 0.9*c)
    flux = Parameter("B-flux through solenoid", -pi, pi, 0)

    controls.add(width, distance, mass, velocity, flux)

    # Hook up the interface components and begin the event loop.
    main.setup(display, controls, simulation)
    main.start()
