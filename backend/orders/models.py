from django.db import models

from catalog.models import Product


class OrderRequest(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        PAID = "paid", "Paid"
        SHIPPED = "shipped", "Shipped"
        CANCELLED = "cancelled", "Cancelled"

    order_id = models.CharField(max_length=80, unique=True)
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="order_requests")
    customer_name = models.CharField(max_length=160)
    phone = models.CharField(max_length=80)
    social = models.CharField(max_length=160)
    city = models.CharField(max_length=160)
    delivery = models.TextField()
    comment = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    telegram_sent_at = models.DateTimeField(null=True, blank=True)
    telegram_error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.order_id
