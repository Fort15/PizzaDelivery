# Generated by Django 5.1.7 on 2025-05-29 19:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.CharField(max_length=200),
        ),
    ]
