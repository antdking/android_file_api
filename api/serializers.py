from api.models import Developer, Device, App
from rest_framework import serializers
from rest_framework.serializers import RelatedField


class DynamicModelSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        model = kwargs.pop('model', None)
        excludes = kwargs.pop('excludes', ())
        kwargs.pop('fields', ())
        if model:
            self.Meta.model = model
        self.pre_process()

        super(DynamicModelSerializer, self).__init__(*args, **kwargs)

        if excludes:
            for exclude in excludes:
                self.fields.pop(exclude)

    def pre_process(self):
        pass


class ListSerializer(DynamicModelSerializer):

    def __init__(self, *args, **kwargs):
        orig_fields = ('id', 'name')
        fields = kwargs.pop('fields', ())
        if fields:
            self.Meta.fields = fields
        else:
            self.Meta.fields = orig_fields
        super(ListSerializer, self).__init__(*args, **kwargs)


class CountSerializer(DynamicModelSerializer):
    total_roms = RelatedField()
    total_apps = RelatedField()
    total_kernels = RelatedField()
    total_mods = RelatedField()

    class Meta:
        fields = ('id', 'total_roms', 'total_apps', 'total_kernels', 'total_mods')


class DeveloperListSerializer(DynamicModelSerializer):
    username = RelatedField('user.username')

    class Meta:
        model = Developer
        fields = ('id', 'username')


class DeveloperDetailSerializer(DynamicModelSerializer):
    username = RelatedField('user.username')
    date_joined = serializers.DateTimeField(source='user.date_joined', format="%d-%m-%Y_%H:%M:%S")
    first_name = RelatedField('user.first_name')
    last_name = RelatedField('user.last_name')
    roms = serializers.PrimaryKeyRelatedField(many=True)
    apps = serializers.PrimaryKeyRelatedField(many=True)
    kernels = serializers.PrimaryKeyRelatedField(many=True)
    mods = serializers.PrimaryKeyRelatedField(many=True)

    class Meta:
        model = Developer
        fields = ('id', 'username', 'vcs', 'xda', 'first_name', 'last_name',
                  'date_joined', 'roms', 'apps', 'kernels', 'mods')


class DeviceDetailSerializer(DynamicModelSerializer):
    roms = serializers.PrimaryKeyRelatedField(many=True)
    kernels = serializers.PrimaryKeyRelatedField(many=True)
    mods = serializers.PrimaryKeyRelatedField(many=True)

    class Meta:
        model = Device
        fields = ('id', 'code_name', 'full_name', 'manufacturer',
                  'roms', 'kernels', 'mods')


class GenericDetailSerializer(DynamicModelSerializer):
    developer = serializers.PrimaryKeyRelatedField()
    device = serializers.PrimaryKeyRelatedField()
    date = serializers.DateTimeField(format="%d-%m-%Y_%H:%M:%S")

    class Meta:
        model = None
        fields = ('id', 'name', 'url', 'developer', 'date')

    def pre_process(self):
        if not self.Meta.model == App:
            self.Meta.fields += ('device',)
