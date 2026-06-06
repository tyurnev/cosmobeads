from django.urls import path

from . import views


urlpatterns = [
    path("content/catalog", views.content_catalog, name="content-catalog-legacy"),
    path("content/catalog/", views.content_catalog, name="content-catalog-legacy-slash"),
    path("drops/current/", views.current_drop, name="current-drop"),
    path("products/", views.products, name="products"),
    path("products/<slug:slug>/", views.product_detail, name="product-detail"),
]
