from .models import *
from .serializers import *
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status, filters
from rest_framework.views import APIView
from django.db.models import QuerySet
from .filters import TrimFilter, CarModelFilter, ModelFilter
from django.db.models import Q


# Show popular car models to user when he first click on input field
class PopularCarModelsView(generics.ListAPIView):
    serializer_class = PopularCarsSerializer

    def get_queryset(self):
        return Model.objects.all().order_by("-popularity")[:5]


# Retrieve all car makes which start from user input
class RetrieveMakeView(generics.ListAPIView):
    serializer_class = MakeSerializer

    def get_queryset(self):
        query = self.request.query_params.get("q", "").lower()
        return Make.objects.filter(make__startswith=query)


# Retrieve all models for a chosen car make
class RetrieveCarModelView(generics.ListAPIView):
    serializer_class = CarModelSerializer
    filterset_class = CarModelFilter

    def get_queryset(self) -> QuerySet[Make]:
        make_id = self.request.query_params.get("make_id")
        models = Model.objects.filter(make_id=make_id)
        return models


# Retrieve years for a chosen make+model
class RetrieveModelYearView(generics.ListAPIView):
    serializer_class = ModelYearsSerializer

    def get_queryset(self) -> QuerySet[ModelYear]:
        pk = self.kwargs.get("pk")
        car_model = Model.objects.prefetch_related("years").get(id=pk)
        return car_model.years.all()


# Retrieve available trims for make+model+year
# class RetrieveTrimsView(generics.ListAPIView):
#     serializer_class = TrimSerializer
#     filterset_class = TrimFilter
#     def get_queryset(self) -> QuerySet[Car]:
#         model_id = self.request.query_params.get("model")
#         year_id = self.request.query_params.get("year")

#         cars = Car.objects.select_related("trim").filter(model_id=model_id, year_id=year_id)
#         return cars

#     def get(self, request):
#         queryset = self.get_queryset()
#         return Response(queryset.values("trim__id", "trim__trim"))


class RetrieveTrimsView(generics.ListAPIView):
    serializer_class = TrimSerializer
    filterset_class = TrimFilter

    def get_queryset(self) -> QuerySet[Trim]:
        model_id = self.request.query_params.get("model_id")

        trims = Trim.objects.filter(model_id=model_id)
        return trims

    def get(self, request):
        queryset = self.get_queryset()
        return Response(queryset.values("id", "trim"))


# Show insurance simple cost based on car price for a found car (make+model+year+trim)
class ShowInsurancePriceView(generics.GenericAPIView):
    serializer_class = CarSerializer

    def get_queryset(self) -> QuerySet[Car]:
        return Car.objects.all()

    def get_object(self) -> Car:
        model_id = self.kwargs.get("model_id")
        year_id = self.kwargs.get("year_id")
        trim_id = self.kwargs.get("trim_id")
        queryset = self.get_queryset()
        return queryset.get(model_id=model_id, year_id=year_id, trim_id=trim_id)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        koeff = 0.01
        data = serializer.data
        car_price = data["price"]
        insurance_price = float(car_price) * koeff
        return Response({"insurance_price": insurance_price, "car_price": car_price})


class SearchModel(generics.ListAPIView):
    serializer_class = CarModelSerializer
    filterset_class = ModelFilter

    def get_queryset(self) -> QuerySet[Model]:
        search_query = self.request.query_params.get("search")

        # Split search query into words
        words = search_query.split()

        # Filter by make name and model name
        queryset = Model.objects.none()

        for word in words:
            queryset = queryset | Model.objects.filter(
                Q(make__make__icontains=word) | Q(model__icontains=word)
            )

        # Get intersection of results
        for i, word in enumerate(words):
            if i == 0:
                intersection = queryset.filter(
                    Q(make__make__icontains=word) | Q(model__icontains=word)
                )
            else:
                intersection = intersection.intersection(
                    queryset.filter(
                        Q(make__make__icontains=word) | Q(model__icontains=word)
                    )
                )

        return intersection

    def get(self, request):
        queryset = self.get_queryset()
        print(queryset)
        return Response(queryset.values("make__make", "model", "id"))


# TODO change query_params to url kwargs
# TODO update car popularity (+1) after submitting the form
