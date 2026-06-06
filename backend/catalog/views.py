from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import Drop, Product
from .serializers import catalog_payload, drop_to_dict, product_to_dict


@require_GET
def content_catalog(_request):
    return JsonResponse({"ok": True, **catalog_payload()})


@require_GET
def products(_request):
    queryset = Product.objects.select_related("drop").prefetch_related("images").exclude(status=Product.Status.HIDDEN)
    return JsonResponse({"ok": True, "products": [product_to_dict(product) for product in queryset]})


@require_GET
def product_detail(_request, slug):
    try:
        product = Product.objects.select_related("drop").prefetch_related("images").exclude(status=Product.Status.HIDDEN).get(slug=slug)
    except Product.DoesNotExist:
        return JsonResponse({"ok": False, "error": "Изделие не найдено."}, status=404)

    return JsonResponse({"ok": True, "product": product_to_dict(product)})


@require_GET
def current_drop(_request):
    drop = (
        Drop.objects.prefetch_related("products", "assigned_products", "assigned_products__images")
        .filter(status=Drop.Status.CURRENT)
        .first()
    )

    if not drop:
        return JsonResponse({"ok": False, "error": "Текущий дроп не найден."}, status=404)

    listed_products = list(drop.products.exclude(status=Product.Status.HIDDEN))
    assigned_products = list(drop.assigned_products.exclude(status=Product.Status.HIDDEN))
    products_by_id = {}

    for product in [*listed_products, *assigned_products]:
        products_by_id[product.id] = product

    products = sorted(products_by_id.values(), key=lambda product: (product.sort_order, product.name))

    return JsonResponse(
        {
            "ok": True,
            "drop": drop_to_dict(drop),
            "products": [product_to_dict(product) for product in products],
        }
    )
