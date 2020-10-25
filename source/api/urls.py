from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuoteViewset

router = DefaultRouter()
router.register('quote', QuoteViewset)


app_name = 'api'


urlpatterns = [
    path('', include(router.urls))
]
