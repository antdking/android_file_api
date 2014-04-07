from django.conf.urls import patterns, url
from api import views as apiviews
from rest_framework.urlpatterns import format_suffix_patterns
from django.views.decorators.cache import cache_page

urlpatterns = patterns('',
                       url(r'^developers/$',
                           (apiviews.DeveloperList.as_view())),
                       url(r'^developers/(?P<pk>[0-9]+)/$',
                           (apiviews.DeveloperDetail.as_view())),
                       url(r'^developers/(?P<pk>[0-9]+)/count/$',
                           (apiviews.DeveloperCount.as_view())),
                       url(r'^devices/$',
                           (apiviews.DeviceList.as_view())),
                       url(r'^devices/(?P<pk>[0-9]+)/$',
                           (apiviews.DeviceDetail.as_view())),
                       url(r'^devices/(?P<pk>[0-9]+)/count/$',
                           (apiviews.DeviceCount.as_view())),
                       url(r'^roms/$',
                           (apiviews.RomList.as_view())),
                       url(r'^roms/(?P<pk>[0-9]+)/$',
                           (apiviews.RomDetail.as_view())),
                       url(r'^apps/$',
                           (apiviews.AppList.as_view())),
                       url(r'^apps/(?P<pk>[0-9]+)/$',
                           (apiviews.AppDetail.as_view())),
                       url(r'^kernels/$',
                           (apiviews.KernelList.as_view())),
                       url(r'^kernels/(?P<pk>[0-9]+)/$',
                           (apiviews.KernelDetail.as_view())),
                       url(r'^mods/$',
                           (apiviews.ModList.as_view())),
                       url(r'^mods/(?P<pk>[0-9]+)/$',
                           (apiviews.ModDetail.as_view())),
                       )

urlpatterns = format_suffix_patterns(urlpatterns)