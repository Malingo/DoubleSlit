from django.db import models

class Parameter(models.Model):
    name    = models.CharField(max_length=99)
    units   = models.CharField(max_length=99)
    value   = models.DecimalField(max_digits=32, decimal_places=28)
    min     = models.DecimalField(max_digits=32, decimal_places=28)
    max     = models.DecimalField(max_digits=32, decimal_places=28)
    default = models.DecimalField(max_digits=32, decimal_places=28, null=True, blank=True)

class XYPair(models.Model):
	x = models.DecimalField(max_digits=32, decimal_places=28, primary_key=True)
	y = models.DecimalField(max_digits=32, decimal_places=28)

class Simulation(models.Model):
    width    = models.ForeignKey(Parameter, verbose_name="Width of slits")
    distance = models.ForeignKey(Parameter, verbose_name="Distance between slits")
    mass     = models.ForeignKey(Parameter, verbose_name="Mass of particles")
    velocity = models.ForeignKey(Parameter, verbose_name="Velocity of particles")
    current  = models.ForeignKey(Parameter, verbose_name="Current in solenoid")

    graph = models.ManyToManyField(XYPair, null=True, blank=True)