from rest_framework import serializers
from .models import *


class MakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Make
        fields = ["id", "make"]


class CarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = ["id", "make", "model"]


class ModelYearsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelYear
        fields = ["id", "year"]


class TrimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trim
        fields = ["id", "model", "trim"]


class CarTrimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = ["trim"]


class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = ["id", "make", "model", "trim", "year", "price"]


class PopularCarsSerializer(serializers.ModelSerializer):
    make = MakeSerializer()

    class Meta:
        model = Model
        fields = ["id", "make", "model", "popularity"]
