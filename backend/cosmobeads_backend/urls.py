from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path

from . import views


admin.site.site_header = settings.ADMIN_SITE_HEADER
admin.site.site_title = "Cosmo Beads"
admin.site.index_title = "Управление Cosmo Beads"

urlpatterns = [
    path("cosmo-admin/", admin.site.urls),
    path("api/", include("site_settings.urls")),
    path("api/", include("catalog.urls")),
    path("api/", include("orders.urls")),
    path("", views.frontend_index, name="frontend-index"),
    path("checkout/", views.frontend_checkout, name="frontend-checkout"),
    path("product/", views.frontend_product_shell, name="frontend-product-index"),
    path("product/<slug:slug>/", views.frontend_product_shell, name="frontend-product"),
    path("styles.css", views.repo_file, {"relative_path": "styles.css"}, name="frontend-styles"),
    path("script.js", views.repo_file, {"relative_path": "script.js"}, name="frontend-script"),
    re_path(r"^media/(?P<relative_path>.+)$", views.media_file, name="media-file"),
    re_path(r"^assets/(?P<relative_path>.+)$", views.repo_asset, name="frontend-assets"),
    re_path(r"^src/(?P<relative_path>.+)$", views.repo_src, name="frontend-src"),
]
