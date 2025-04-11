# Generated by Django 4.2.14 on 2025-03-17 21:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("media_handler", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="mediafile",
            name="uploaded_by",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="uploaded_media",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddIndex(
            model_name="mediafile",
            index=models.Index(
                fields=["content_type", "object_id"],
                name="media_handl_content_9ed7f2_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="mediafile",
            index=models.Index(
                fields=["-uploaded_at"], name="media_handl_uploade_ea4ffc_idx"
            ),
        ),
    ]
