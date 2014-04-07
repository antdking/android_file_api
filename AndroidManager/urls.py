from django.conf.urls import patterns, include, url
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'AndroidManager.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^api/', include('api.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^jwt/', 'rest_framework_jwt.views.obtain_jwt_token'),
    url(r'^test/$', 'base.views.test'),
    url(r'^login/$', 'base.views.json_login'),
    url(r'^logout/$', 'base.views.json_logout'),
    url(r'^create_user/$', 'base.views.json_create_user'),
    url(r'^$', 'base.views.test'),

)
