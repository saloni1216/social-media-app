from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render

def home(request):
    return render(request, "home.html")


def api_home(request):
    return render(request, "api/home.html")
