from django.shortcuts import get_object_or_404
from django.views import View
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .permissions import QuotePermissions
from api.serializers import QuoteCreateSerializer, QuoteUpdateSerializer, QuoteSerializer
from webapp.models import Quote, Vote


class QuoteViewset(ModelViewSet):
    permission_classes = [QuotePermissions]

    def get_queryset(self):
        if self.request.method == 'GET' and not self.request.user.has_perm('webapp.quote_view'):
            return Quote.get_moderated()
        return Quote.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return QuoteCreateSerializer
        elif self.request.method == 'PUT':
            return QuoteUpdateSerializer
        return QuoteSerializer

    @action(methods=['post'], detail=True)
    def upvote(self, request, pk=None):
        quote = get_object_or_404(Quote, pk=pk)
        if not request.session.session_key:
            request.session.save()
        session_id = request.session.session_key
        upvote, created = Vote.objects.get_or_create(quote=quote, session_key=session_id, rating=1)
        if created:
            quote.rating += 1
            quote.save()
            return Response(quote.rating)
        else:
            return Response(status=403)

    @action(methods=['post'], detail=True)
    def downvote(self, request, pk=None):
        quote = get_object_or_404(Quote, pk=pk)
        if not request.session.session_key:
            request.session.save()
        session_id = request.session.session_key
        downvote, created = Vote.objects.get_or_create(quote=quote, session_key=session_id, rating=-1)
        if created:
            quote.rating -= 1
            quote.save()
            return Response(quote.rating)
        else:
            return Response(status=403)