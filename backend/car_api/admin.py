from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Car)
admin.site.register(Make)
admin.site.register(Model)
admin.site.register(Trim)
admin.site.register(ModelYear)

#TODO don't import *