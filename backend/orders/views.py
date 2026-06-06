import json
import os
import random
import string
from urllib import error, request

from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from catalog.models import Product
from catalog.serializers import product_to_dict
from .models import OrderRequest


MIN_SUBMIT_MS = 3000
MAX_SUBMIT_MS = 1000 * 60 * 60 * 24


def normalize_text(value):
    return str(value or "").strip()


def public_error(message, status=400):
    return JsonResponse({"ok": False, "error": message}, status=status)


def create_order_id():
    suffix = "".join(random.choice(string.ascii_lowercase + string.digits) for _ in range(5))
    return f"cb-{int(timezone.now().timestamp() * 1000):x}-{suffix}"


def read_json(request_obj):
    try:
        return json.loads(request_obj.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return None


def validate_payload(payload):
    fields = {
        "productSlug": normalize_text(payload.get("productSlug")),
        "name": normalize_text(payload.get("name")),
        "phone": normalize_text(payload.get("phone")),
        "social": normalize_text(payload.get("social")),
        "city": normalize_text(payload.get("city")),
        "delivery": normalize_text(payload.get("delivery")),
        "comment": normalize_text(payload.get("comment")),
        "website": normalize_text(payload.get("website")),
        "formStartedAt": payload.get("formStartedAt"),
    }
    required = [
        ("productSlug", "изделие"),
        ("name", "имя"),
        ("phone", "телефон"),
        ("social", "Telegram or Instagram"),
        ("city", "город"),
        ("delivery", "доставка или адрес"),
    ]
    missing = [label for key, label in required if not fields[key]]

    if missing:
        return None, public_error(f"Заполни обязательные поля: {', '.join(missing)}.", 400)

    if fields["website"]:
        return None, public_error("Заявка не прошла антиспам-проверку.", 400)

    try:
        submit_age_ms = int(timezone.now().timestamp() * 1000) - int(float(fields["formStartedAt"]))
    except (TypeError, ValueError):
        return None, public_error("Не получилось проверить время заполнения формы. Обнови страницу и попробуй еще раз.", 400)

    if submit_age_ms < MIN_SUBMIT_MS:
        return None, public_error("Проверь данные и отправь заявку через пару секунд.", 400)

    if submit_age_ms > MAX_SUBMIT_MS:
        return None, public_error("Форма была открыта слишком давно. Обнови страницу и попробуй еще раз.", 400)

    try:
        product = Product.objects.prefetch_related("images").get(slug=fields["productSlug"])
    except Product.DoesNotExist:
        return None, public_error("Изделие не найдено.", 404)

    if product.status == Product.Status.HIDDEN:
        return None, public_error("Это изделие сейчас недоступно для заявки.", 404)

    if product.status == Product.Status.SOLD_OUT:
        return None, public_error("Это изделие уже sold out, покупку оформить нельзя.", 409)

    if product.status != Product.Status.AVAILABLE:
        return None, public_error("Это изделие сейчас недоступно для заявки.", 409)

    return {"fields": fields, "product": product}, None


def telegram_message(order_request):
    lines = [
        "Новая заявка Cosmo Beads",
        f"Номер: {order_request.order_id}",
        f"Дата: {order_request.created_at.isoformat()}",
        f"Изделие: {order_request.product.name}",
        f"Цена: {order_request.product.price_display}",
        f"Slug: {order_request.product.slug}",
        "",
        "Покупатель",
        f"Имя: {order_request.customer_name}",
        f"Телефон: {order_request.phone}",
        f"Telegram/Instagram: {order_request.social}",
        f"Город: {order_request.city}",
        f"Доставка/адрес: {order_request.delivery}",
        f"Комментарий: {order_request.comment or 'без комментария'}",
    ]
    return "\n".join(lines)


def send_telegram(text):
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_ids = [chat_id.strip() for chat_id in os.environ.get("TELEGRAM_CHAT_ID", "").split(",") if chat_id.strip()]

    if not bot_token or not chat_ids:
        raise RuntimeError("Telegram delivery is not configured.")

    failed = []

    for chat_id in chat_ids:
        payload = json.dumps(
            {
                "chat_id": chat_id,
                "text": text,
                "disable_web_page_preview": True,
            }
        ).encode("utf-8")
        telegram_request = request.Request(
            f"https://api.telegram.org/bot{bot_token}/sendMessage",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with request.urlopen(telegram_request, timeout=12) as response:
                if response.status >= 400:
                    failed.append(f"{chat_id}: HTTP {response.status}")
        except error.HTTPError as exc:
            failed.append(f"{chat_id}: HTTP {exc.code} {exc.read().decode('utf-8', errors='replace')}")
        except error.URLError as exc:
            failed.append(f"{chat_id}: {exc.reason}")

    if failed:
        raise RuntimeError("; ".join(failed))


@csrf_exempt
@require_POST
def order_request(request_obj):
    payload = read_json(request_obj)

    if payload is None:
        return public_error("Request body must be valid JSON.", 400)

    validation, validation_error = validate_payload(payload)

    if validation_error:
        return validation_error

    fields = validation["fields"]
    product = validation["product"]
    order = OrderRequest.objects.create(
        order_id=create_order_id(),
        product=product,
        customer_name=fields["name"],
        phone=fields["phone"],
        social=fields["social"],
        city=fields["city"],
        delivery=fields["delivery"],
        comment=fields["comment"],
    )

    try:
        send_telegram(telegram_message(order))
    except Exception as exc:
        order.telegram_error = str(exc)
        order.save(update_fields=["telegram_error", "updated_at"])
        return public_error("Не удалось отправить заявку. Попробуй еще раз или напиши нам напрямую: IG/TG.", 502)

    order.telegram_sent_at = timezone.now()
    order.save(update_fields=["telegram_sent_at", "updated_at"])

    return JsonResponse(
        {
            "ok": True,
            "orderRequest": {
                "id": order.order_id,
                "createdAt": order.created_at.isoformat(),
                "product": {
                    "slug": product.slug,
                    "name": product.name,
                    "price": product.price_display,
                },
            },
            "product": product_to_dict(product),
        }
    )
