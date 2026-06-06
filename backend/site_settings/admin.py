from django.contrib import admin

from .models import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("brand_name", "contact_label", "updated_at")
    fieldsets = (
        ("Brand", {"fields": ("brand_name",)}),
        ("Contacts", {"fields": ("instagram_url", "telegram_url", "contact_label")}),
        ("Meta", {"fields": ("default_meta_title", "default_meta_description")}),
        ("Order copy", {"fields": ("delivery_text", "order_success_text", "order_contact_explanation")}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()
