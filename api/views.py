from rest_framework.response import Response
from rest_framework.views import APIView
from api.serializers import (DeveloperDetailSerializer, DeveloperListSerializer, DeviceDetailSerializer,
                             ListSerializer, CountSerializer, GenericDetailSerializer)
from api.models import Developer, Device, Rom, App, Kernel, Mod
from rest_framework.renderers import JSONRenderer
from collections import OrderedDict
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


class ListViewBase(APIView):
    renderer_classes = [JSONRenderer]
    model = None
    serializer = ListSerializer
    content_type = 'application/json; charset=utf-8'
    fields = None
    excludes = None

    def get(self, request):
        page_size = request.GET.get('page_size')
        if page_size:
            if type(page_size) != int:
                page_size = 25
            if page_size > 100:
                page_size = 100
        else:
            page_size = 25
        page = request.GET.get('page')
        model = self.model.objects.all()
        model = Paginator(model, page_size)
        try:
            model_list = model.page(page)
        except PageNotAnInteger:
            model_list = model.page(1)
        except EmptyPage:
            model_list = model.page(model.num_pages)
        serializer = self.serializer(model_list, many=True, model=self.model,
                                     fields=self.fields, excludes=self.excludes)
        return Response(serializer.data, content_type=self.content_type)


class DetailViewBase(APIView):
    renderer_classes = [JSONRenderer]
    model = None
    serializer = GenericDetailSerializer
    item_name = "Item"
    content_type = 'application/json; charset=utf-8'
    fields = None
    excludes = None
    limited_serializer = None
    limited_fields = None

    def checks(self):
        if self.model is None:
            response = {'detail': 'Model not defined'}
            return Response(response)
        if self.serializer is None:
            response = {'detail': 'Serializer not defined'}
            return Response(response)

    def get_object(self, pk):
        if self.model is None:
            return None
        try:
            return self.model.objects.get(pk=pk)
        except self.model.DoesNotExist:
            return None

    def get(self, request, pk):
        limited = request.GET.get('limited')
        if limited == "y":
            self.serializer = self.limited_serializer
            if self.limited_fields is not None:
                self.fields = self.limited_fields
        checks = self.checks()
        if checks:
            return checks
        model = self.get_object(pk)
        if model is None:
            response = {'detail': 'None existent {}'.format(self.item_name)}
            return Response(response)
        serializer = self.serializer(model, model=self.model, fields=self.fields, excludes=self.excludes)
        return Response(serializer.data, content_type=self.content_type)
        

class CountViewBase(DetailViewBase):
    serializer = CountSerializer
    no_apps = False

    def process_query(self, q, model):
        q = q.split(',')
        response = OrderedDict({'id': model.id})
        if "roms" in q:
            response["total_roms"] = model.total_roms()
        if "apps" in q and not self.no_apps:
            response["total_apps"] = model.total_apps()
        if "kernels" in q:
            response["total_kernels"] = model.total_kernels()
        if "mods" in q:
            response["total_mods"] = model.total_mods()

        if response == {'id': model.id}:
            response = {'detail': 'invalid query'}
        return response

    def get(self, request, pk):
        q = request.GET.get('q')
        if not q:
            return super(CountViewBase, self).get(request, pk)
        checks = self.checks()
        if checks:
            return checks
        model = self.get_object(pk)
        if model is None:
            response = dict(detail='None existant {}'.format(self.item_name))
            return Response(response)
        response = self.process_query(q, model)
        return Response(response, content_type=self.content_type)


class DeveloperList(ListViewBase):
    model = Developer
    serializer = DeveloperListSerializer


class DeviceList(ListViewBase):
    model = Device
    fields = ('id', 'code_name')


class RomList(ListViewBase):
    model = Rom


class AppList(ListViewBase):
    model = App


class KernelList(ListViewBase):
    model = Kernel


class ModList(ListViewBase):
    model = Mod


class DeveloperCount(CountViewBase):
    model = Developer
    item_name = "Developer"


class DeviceCount(CountViewBase):
    model = Device
    item_name = "Device"
    no_apps = True
    excludes = ('total_apps',)


class DeveloperDetail(DetailViewBase):
    model = Developer
    serializer = DeveloperDetailSerializer
    item_name = "Developer"
    limited_serializer = DeveloperListSerializer


class DeviceDetail(DetailViewBase):
    model = Device
    serializer = DeviceDetailSerializer
    item_name = "Device"
    limited_serializer = ListSerializer
    limited_fields = ('id', 'code_name')


class RomDetail(DetailViewBase):
    model = Rom


class AppDetail(DetailViewBase):
    model = App


class KernelDetail(DetailViewBase):
    model = Kernel


class ModDetail(DetailViewBase):
    model = Mod