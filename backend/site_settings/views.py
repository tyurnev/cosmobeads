from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import SiteSettings


@require_GET
def site_config(_request):
    settings = SiteSettings.get_solo()

    return JsonResponse(
        {
            "ok": True,
            "siteConfig": {
                "brandName": settings.brand_name,
                "contacts": {
                    "instagramUrl": settings.instagram_url,
                    "telegramUrl": settings.telegram_url,
                    "label": settings.contact_label,
                },
                "meta": {
                    "defaultTitle": settings.default_meta_title,
                    "defaultDescription": settings.default_meta_description,
                },
                "deliveryText": settings.delivery_text,
                "orderSuccessText": settings.order_success_text,
                "orderContactExplanation": settings.order_contact_explanation,
            },
        }
    )
