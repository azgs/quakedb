from django.contrib import admin
from models import EarthquakeData

class EQAdmin(admin.ModelAdmin):
    list_display = ('id', '__unicode__', 'magnitude', 'type', 'depth', 'occurance_date', 'source_catalog', 'latitude', 'longitude')
    list_display_links = ('__unicode__',)
    exclude = ('geom',)
    
admin.site.register(EarthquakeData, EQAdmin)