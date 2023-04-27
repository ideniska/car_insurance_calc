from django.urls import path, include
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path("", TemplateView.as_view(template_name="index.html")),
    path("make/", views.RetrieveMakeView.as_view(), name="get_make"),
    path("model/<int:pk>/year", views.RetrieveModelYearView.as_view(), name="get_model_years"),
    path("models/", views.RetrieveCarModelView.as_view(), name="get_models"),
    path("trims/", views.RetrieveTrimsView.as_view(), name="get_trims"),
    path("car/<int:model_id>/<int:year_id>/<int:trim_id>/", views.ShowInsurancePriceView.as_view(), name="get_ins_price"),
    path("popular/", views.PopularCarModelsView.as_view(), name="show_popular"),
    path("search-models/", views.SearchModel.as_view(), name='search_models'),

]
