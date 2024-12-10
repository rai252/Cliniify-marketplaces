# Generated by Django 4.2.1 on 2024-07-09 09:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("specializations", "0001_initial"),
        ("establishments", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="establishment",
            name="onboarded_by",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="establishment_onboarded_by_user",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="establishment",
            name="specializations",
            field=models.ManyToManyField(to="specializations.specialization"),
        ),
    ]
