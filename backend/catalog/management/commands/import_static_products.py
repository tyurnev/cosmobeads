import json
import shutil
from datetime import date
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from catalog.models import Drop, Product, ProductImage
from site_settings.models import SiteSettings


class Command(BaseCommand):
    help = "Import existing Cosmo Beads JSON content into Django models."

    def add_arguments(self, parser):
        parser.add_argument("--clear", action="store_true", help="Delete existing products, drops, and product images before import.")

    def handle(self, *args, **options):
        repo_root = settings.REPO_FRONTEND_ROOT
        products_dir = repo_root / "content/products"
        drops_dir = repo_root / "content/drops"

        if not products_dir.exists() or not drops_dir.exists():
            raise SystemExit("content/products and content/drops must exist.")

        drop_payloads = [self.read_json(path) for path in sorted(drops_dir.glob("*.json"))]
        product_payloads = [self.read_json(path) for path in sorted(products_dir.glob("*.json"))]

        with transaction.atomic():
            if options["clear"]:
                ProductImage.objects.all().delete()
                Product.objects.all().delete()
                Drop.objects.all().delete()

            SiteSettings.get_solo()
            drops_by_id = self.import_drops(drop_payloads)
            products_by_id = self.import_products(product_payloads, drops_by_id)
            self.connect_drop_products(drop_payloads, drops_by_id, products_by_id)

        self.stdout.write(self.style.SUCCESS(f"Imported {len(products_by_id)} products and {len(drops_by_id)} drops."))

    def read_json(self, path):
        return json.loads(path.read_text(encoding="utf-8"))

    def import_drops(self, payloads):
        drops_by_id = {}

        for payload in payloads:
            drop_id = payload["id"]
            drop, _created = Drop.objects.update_or_create(
                id=drop_id,
                defaults={
                    "slug": payload.get("slug") or drop_id,
                    "title": payload.get("title") or "Cosmo Beads Drop",
                    "eyebrow": payload.get("eyebrow") or "current folder",
                    "status": payload.get("status") or Drop.Status.PAST,
                    "release_label": payload.get("releaseLabel") or "",
                    "released_at": self.parse_date(payload.get("releasedAt")),
                },
            )
            drops_by_id[drop_id] = drop

        return drops_by_id

    def import_products(self, payloads, drops_by_id):
        products_by_id = {}

        for payload in payloads:
            product_id = payload["id"]
            drop = drops_by_id.get(payload.get("dropId"))
            price = payload.get("price") or {}
            stock = payload.get("stock") or {}
            media = payload.get("media") or {}
            details = payload.get("details") or {}
            display = payload.get("display") or {}
            product, _created = Product.objects.update_or_create(
                id=product_id,
                defaults={
                    "slug": payload.get("slug") or product_id,
                    "drop": drop,
                    "name": payload.get("name") or product_id,
                    "description": payload.get("description") or "",
                    "status": payload.get("status") or Product.Status.HIDDEN,
                    "badges": payload.get("badges") or [],
                    "price_amount": int(price.get("amount") or 0),
                    "price_currency": price.get("currency") or "RUB",
                    "price_display": price.get("display") or "",
                    "stock_quantity": int(stock.get("quantity") or 0),
                    "stock_label": stock.get("label") or "",
                    "stock_unit": stock.get("unit") or Product.StockUnit.PIECE,
                    "main_image": self.copy_media_file(media.get("image"), "products"),
                    "image_alt": media.get("imageAlt") or "",
                    "emotional_description": details.get("emotionalDescription") or "",
                    "materials": details.get("materials") or [],
                    "size": details.get("size") or "",
                    "care": details.get("care") or [],
                    "delivery": details.get("delivery") or "",
                    "window_title": display.get("windowTitle") or "product.exe",
                    "available_cta_label": display.get("availableCtaLabel") or "Забрать",
                    "sold_out_cta_label": display.get("soldOutCtaLabel") or "Смотреть",
                    "sort_order": int(payload.get("sortOrder") or 100),
                    "archive_caption": payload.get("archiveCaption") or "",
                },
            )
            product.images.all().delete()
            self.import_gallery(product, media.get("gallery") or [])
            products_by_id[product_id] = product

        return products_by_id

    def import_gallery(self, product, gallery):
        for index, item in enumerate(gallery):
            image_path = item.get("image") if isinstance(item, dict) else item
            copied_path = self.copy_media_file(image_path, "products/gallery")

            if not copied_path:
                continue

            ProductImage.objects.create(
                product=product,
                image=copied_path,
                image_alt=(item.get("imageAlt") if isinstance(item, dict) else "") or "",
                sort_order=(index + 1) * 10,
            )

    def connect_drop_products(self, payloads, drops_by_id, products_by_id):
        for payload in payloads:
            drop = drops_by_id[payload["id"]]
            products = [products_by_id[product_id] for product_id in payload.get("productIds", []) if product_id in products_by_id]
            drop.products.set(products)

    def copy_media_file(self, raw_path, folder):
        if not raw_path:
            return ""

        source_path = self.resolve_source_media_path(raw_path)

        if not source_path or not source_path.exists():
            return ""

        relative_folder = Path(folder)
        destination_dir = settings.MEDIA_ROOT / relative_folder
        destination_dir.mkdir(parents=True, exist_ok=True)
        destination = destination_dir / source_path.name
        shutil.copy2(source_path, destination)

        return str(relative_folder / source_path.name)

    def resolve_source_media_path(self, raw_path):
        path = str(raw_path).strip()

        if path.startswith("http://") or path.startswith("https://"):
            return None

        return (settings.REPO_FRONTEND_ROOT / path.lstrip("/")).resolve()

    def parse_date(self, raw_value):
        if not raw_value:
            return None

        try:
            return date.fromisoformat(raw_value)
        except ValueError:
            return None
