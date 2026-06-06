from django.urls import path

from . import views


urlpatterns = [
    path("order-request/", views.order_request, name="order-request"),
    path("order-request", views.order_request, name="order-request-no-slash"),
]
