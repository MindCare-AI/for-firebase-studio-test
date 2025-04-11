# Generated by Django 4.2.14 on 2025-03-25 14:48

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("messaging", "0003_remove_chatbotmessage_edit_history_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="onetoonemessage",
            name="edit_history",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.JSONField(),
                blank=True,
                default=list,
                help_text="History of message edits",
                size=None,
            ),
        ),
    ]
