# Create your views here.
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from DSWeb.DoubleSlit.models import Parameter, XYPair, Simulation

def view(request):
    graph = XYPair.objects.all()
    return render_to_response('DoubleSlit/template.html', {'graph': graph})