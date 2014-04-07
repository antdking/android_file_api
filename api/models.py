from django.contrib.auth.models import User
from django.db import models


class Developer(models.Model):
    user = models.OneToOneField(User, unique=True, related_name='user')
    vcs = models.URLField(blank=True, null=True)
    xda = models.IntegerField(blank=True, null=True)

    def total_roms(self):
        uploads = Rom.objects.filter(developer=self)
        total = len(uploads)
        return int(total)

    def total_mods(self):
        uploads = Mod.objects.filter(developer=self)
        total = len(uploads)
        return int(total)

    def total_kernels(self):
        uploads = Kernel.objects.filter(developer=self)
        total = len(uploads)
        return int(total)

    def total_apps(self):
        uploads = App.objects.filter(developer=self)
        total = len(uploads)
        return int(total)

    def __str__(self):
        return self.user.username


class Device(models.Model):
    code_name = models.CharField(max_length=25)
    full_name = models.CharField(max_length=25)
    manufacturer = models.CharField(max_length=25)

    def total_roms(self):
        uploads = Rom.objects.filter(device=self)
        total = len(uploads)
        return int(total)

    def total_mods(self):
        uploads = Mod.objects.filter(device=self)
        total = len(uploads)
        return int(total)

    def total_kernels(self):
        uploads = Kernel.objects.filter(device=self)
        total = len(uploads)
        return int(total)

    def total_apps(self):
        # hackery to keep the views clean
        return int(0)

    def __str__(self):
        return self.full_name


class Rom(models.Model):
    developer = models.ForeignKey('Developer', related_name='roms')
    device = models.ForeignKey('Device', related_name='roms')
    name = models.CharField(max_length=100)
    date = models.DateTimeField('date published', auto_now=True)
    url = models.URLField('download location')


class Kernel(models.Model):
    developer = models.ForeignKey('Developer', related_name='kernels')
    device = models.ForeignKey('Device', related_name='kernels')
    name = models.CharField(max_length=100)
    date = models.DateTimeField('date published', auto_now=True)
    url = models.URLField('download location')


class App(models.Model):
    developer = models.ForeignKey('Developer', related_name='apps')
    name = models.CharField(max_length=100)
    date = models.DateTimeField('date published', auto_now=True)
    url = models.URLField('download location')


class Mod(models.Model):
    developer = models.ForeignKey('Developer', related_name='mods')
    device = models.ForeignKey('Device', related_name='mods')
    name = models.CharField(max_length=100)
    date = models.DateTimeField('date published', auto_now=True)
    url = models.URLField('download location')