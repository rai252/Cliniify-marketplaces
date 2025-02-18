# Generated by Django 4.2.1 on 2024-07-09 09:35

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Blog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "deleted_at",
                    models.DateTimeField(db_index=True, editable=False, null=True),
                ),
                (
                    "deleted_by_cascade",
                    models.BooleanField(default=False, editable=False),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=250)),
                (
                    "slug",
                    models.CharField(
                        blank=True, max_length=500, null=True, unique=True
                    ),
                ),
                ("subtitle", models.CharField(blank=True, max_length=250, null=True)),
                (
                    "image",
                    models.ImageField(blank=True, null=True, upload_to="images/blogs"),
                ),
                ("content", models.TextField()),
            ],
            options={
                "verbose_name_plural": "Blogs",
                "ordering": ("-created_at",),
            },
        ),
    ]
