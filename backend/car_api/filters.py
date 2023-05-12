from django_filters import rest_framework as filters


class TrimFilter(filters.FilterSet):
    # year = filters.NumberFilter()
    model_id = filters.NumberFilter()
    # make_id = filters.NumberFilter()


class CarModelFilter(filters.FilterSet):
    make_id = filters.NumberFilter()


class ModelFilter(filters.FilterSet):
    search = filters.CharFilter()
