from django.contrib import admin

from .models import Drop, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "image_alt", "sort_order")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "price_display", "stock_label", "drop", "sort_order")
    list_filter = ("status", "drop", "badges")
    search_fields = ("name", "slug", "description")
    prepopulated_fields = {"slug": ("name",), "id": ("name",)}
    autocomplete_fields = ("drop",)
    inlines = [ProductImageInline]
    fieldsets = (
        ("Basic", {"fields": ("id", "slug", "drop", "name", "description", "status", "badges")}),
        ("Price and stock", {"fields": ("price_amount", "price_currency", "price_display", "stock_quantity", "stock_label", "stock_unit")}),
        ("Media", {"fields": ("main_image", "image_alt")}),
        ("Product details", {"fields": ("emotional_description", "materials", "size", "care", "delivery")}),
        ("Display", {"fields": ("window_title", "available_cta_label", "sold_out_cta_label", "sort_order")}),
        ("Archive", {"fields": ("archive_caption",)}),
    )


@admin.register(Drop)
class DropAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "release_label", "released_at")
    list_filter = ("status", "released_at")
    search_fields = ("title", "slug", "release_label")
    prepopulated_fields = {"slug": ("title",), "id": ("title",)}
    filter_horizontal = ("products",)
    fieldsets = (
        ("Basic", {"fields": ("id", "slug", "title", "eyebrow", "status", "release_label", "released_at")}),
        ("Products", {"fields": ("products",)}),
    )
