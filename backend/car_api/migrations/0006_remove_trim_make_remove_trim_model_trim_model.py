# Generated by Django 4.2 on 2023-05-08 18:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("car_api", "0005_trim_make"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="trim",
            name="make",
        ),
        migrations.RemoveField(
            model_name="trim",
            name="model",
        ),
        migrations.AddField(
            model_name="trim",
            name="model",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="trims",
                to="car_api.model",
            ),
            preserve_default=False,
        ),
    ]
