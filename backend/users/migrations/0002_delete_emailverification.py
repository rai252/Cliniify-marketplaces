# Generated by Django 4.2.1 on 2024-07-19 10:22

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.DeleteModel(
            name="EmailVerification",
        ),
    ]
