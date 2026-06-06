from django.contrib import admin

from .models import OrderRequest


@admin.register(OrderRequest)
class OrderRequestAdmin(admin.ModelAdmin):
    list_display = ("order_id", "product", "customer_name", "phone", "social", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("order_id", "customer_name", "phone", "social", "product__name")
    autocomplete_fields = ("product",)
    readonly_fields = ("created_at", "updated_at", "telegram_sent_at", "telegram_error")
    fieldsets = (
        ("Order", {"fields": ("order_id", "product", "status")}),
        ("Customer", {"fields": ("customer_name", "phone", "social", "city", "delivery", "comment")}),
        ("Telegram", {"fields": ("telegram_sent_at", "telegram_error")}),
        ("Dates", {"fields": ("created_at", "updated_at")}),
    )
