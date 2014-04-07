from api.models import Developer
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
import json


def test(request):
    return render(request, 'base/main.html')


def json_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                print "HI"
                response = {'result': 0}
            else:
                response = {'result': 1}
        else:
            response = {'result': 1}
        return HttpResponse(json.dumps(response), content_type="application/json")
    return redirect('/')


def json_create_user(request):
    if request.method != 'POST':
        return redirect('/')
    print request.body
    username = request.POST.get('username')
    password = request.POST.get('password')
    if '' in [username, password]:
        response = {'result': 1}
        return HttpResponse(json.dumps(response), content_type="application/json")
    vcs = request.POST.get('vcs')
    xda = request.POST.get('xda')
    first_name = request.POST.get('first_name')
    last_name = request.POST.get('last_name')
    if User.objects.filter(username=username):
        response = {'result': 2}
        return HttpResponse(json.dumps(response), content_type="application/json")
    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    developer = Developer.objects.create(user=user)
    if vcs:
        developer.vcs = vcs
    if xda:
        developer.xda = int(xda)
    developer.save()

    user = authenticate(username=username, password=password)
    login(request, user)
    response = {'result': 0}
    return HttpResponse(json.dumps(response), content_type="application/json")


def json_logout(request):
    logout(request)
    return HttpResponseRedirect('/')