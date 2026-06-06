from django.db import models


class SiteSettings(models.Model):
    brand_name = models.CharField(max_length=120, default="Cosmo Beads")
    instagram_url = models.URLField(default="https://instagram.com/cosmobeads.jewelry")
    telegram_url = models.URLField(default="https://t.me/cosmobeadsjewelry")
    contact_label = models.CharField(max_length=80, default="IG/TG")
    default_meta_title = models.CharField(max_length=180, default="Cosmo Beads - handmade Y2K bead pieces")
    default_meta_description = models.TextField(default="Cosmo Beads - handmade Y2K bead jewelry and accessories from a tiny cosmic drop.")
    delivery_text = models.TextField(default="Доставка по России СДЭК/Почтой России после подтверждения заказа.")
    order_success_text = models.TextField(default="Заявка отправлена. Мы свяжемся с тобой в Telegram или Instagram, подтвердим наличие, оплату и доставку.")
    order_contact_explanation = models.TextField(default="После заявки мы подтвердим наличие, доставку и оплату вручную в Telegram или Instagram.")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "site settings"
        verbose_name_plural = "site settings"

    def __str__(self):
        return self.brand_name

    @classmethod
    def get_solo(cls):
        settings, _created = cls.objects.get_or_create(pk=1)
        return settings
