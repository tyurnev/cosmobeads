from django.conf import settings

from .models import Drop, Product


def image_url(image_field):
    if not image_field:
        return "/assets/hero-portal.jpg"

    try:
        return image_field.url
    except ValueError:
        return "/assets/hero-portal.jpg"


def list_value(value):
    return value if isinstance(value, list) else []


def product_to_dict(product: Product):
    main_image = image_url(product.main_image)
    main_alt = product.image_alt or f"{product.name} by Cosmo Beads"
    gallery = [
        {
            "image": image_url(item.image),
            "imageAlt": item.image_alt or f"{product.name} photo {index + 1}",
        }
        for index, item in enumerate(product.images.all())
    ]

    if not gallery:
        gallery = [{"image": main_image, "imageAlt": main_alt}]

    return {
        "id": product.id,
        "slug": product.slug,
        "dropId": product.drop_id or "",
        "name": product.name,
        "description": product.description or "Handmade Cosmo Beads piece.",
        "status": product.status,
        "badges": list_value(product.badges),
        "price": {
            "amount": product.price_amount,
            "currency": product.price_currency or "RUB",
            "display": product.price_display or f"{product.price_amount:,} ₽".replace(",", " "),
        },
        "stock": {
            "quantity": product.stock_quantity,
            "label": product.stock_label or ("архив" if product.status == Product.Status.SOLD_OUT else f"в наличии: {product.stock_quantity} шт."),
            "unit": product.stock_unit,
        },
        "media": {
            "image": main_image,
            "imageAlt": main_alt,
            "gallery": gallery,
        },
        "details": {
            "emotionalDescription": product.emotional_description or "A tiny handmade artifact from the Cosmo Beads universe.",
            "materials": list_value(product.materials) or ["handmade beads"],
            "size": product.size or "Размер уточним перед подтверждением заявки.",
            "care": list_value(product.care) or ["хранить отдельно", "беречь от воды и косметики"],
            "delivery": product.delivery or "Доставка по России СДЭК/Почтой России после подтверждения заказа.",
        },
        "display": {
            "windowTitle": product.window_title or "product.exe",
            "availableCtaLabel": product.available_cta_label or "Забрать",
            "soldOutCtaLabel": product.sold_out_cta_label or "Смотреть",
        },
        "sortOrder": product.sort_order,
        "archiveCaption": product.archive_caption or product.name,
    }


def drop_to_dict(drop: Drop):
    listed_products = list(drop.products.all())
    assigned_products = list(drop.assigned_products.all())
    product_ids = []

    for product in [*listed_products, *assigned_products]:
        if product.id not in product_ids:
            product_ids.append(product.id)

    return {
        "id": drop.id,
        "slug": drop.slug,
        "title": drop.title,
        "eyebrow": drop.eyebrow,
        "status": drop.status,
        "releaseLabel": drop.release_label,
        "releasedAt": drop.released_at.isoformat() if drop.released_at else "",
        "productIds": product_ids,
    }


def catalog_payload():
    products = Product.objects.select_related("drop").prefetch_related("images").all()
    drops = Drop.objects.prefetch_related("products", "assigned_products").all()

    return {
        "products": [product_to_dict(product) for product in products],
        "drops": [drop_to_dict(drop) for drop in drops],
    }
