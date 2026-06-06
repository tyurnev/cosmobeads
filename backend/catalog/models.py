from django.db import models


class Drop(models.Model):
    class Status(models.TextChoices):
        CURRENT = "current", "Current"
        PAST = "past", "Past"
        UPCOMING = "upcoming", "Upcoming"

    id = models.SlugField(primary_key=True, max_length=120)
    slug = models.SlugField(unique=True, max_length=120)
    title = models.CharField(max_length=160)
    eyebrow = models.CharField(max_length=120, default="current folder")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.UPCOMING)
    release_label = models.CharField(max_length=120, blank=True)
    released_at = models.DateField(null=True, blank=True)
    products = models.ManyToManyField("catalog.Product", blank=True, related_name="listed_drops")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-released_at", "title"]

    def __str__(self):
        return self.title


class Product(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        SOLD_OUT = "sold_out", "Sold out"
        HIDDEN = "hidden", "Hidden"

    class StockUnit(models.TextChoices):
        PIECE = "piece", "Piece"
        SET = "set", "Set"

    id = models.SlugField(primary_key=True, max_length=120)
    slug = models.SlugField(unique=True, max_length=120)
    drop = models.ForeignKey(Drop, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_products")
    name = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE)
    badges = models.JSONField(default=list, blank=True)
    price_amount = models.PositiveIntegerField(default=0)
    price_currency = models.CharField(max_length=12, default="RUB")
    price_display = models.CharField(max_length=80, blank=True)
    stock_quantity = models.PositiveIntegerField(default=1)
    stock_label = models.CharField(max_length=120, blank=True)
    stock_unit = models.CharField(max_length=20, choices=StockUnit.choices, default=StockUnit.PIECE)
    main_image = models.ImageField(upload_to="products/", blank=True)
    image_alt = models.CharField(max_length=240, blank=True)
    emotional_description = models.TextField(blank=True)
    materials = models.JSONField(default=list, blank=True)
    size = models.CharField(max_length=240, blank=True)
    care = models.JSONField(default=list, blank=True)
    delivery = models.TextField(blank=True)
    window_title = models.CharField(max_length=120, default="product.exe")
    available_cta_label = models.CharField(max_length=80, default="Забрать")
    sold_out_cta_label = models.CharField(max_length=80, default="Смотреть")
    sort_order = models.IntegerField(default=100)
    archive_caption = models.CharField(max_length=180, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/gallery/")
    image_alt = models.CharField(max_length=240, blank=True)
    sort_order = models.IntegerField(default=100)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.product.name} image {self.sort_order}"
