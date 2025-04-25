from django.db import models
from django.conf import settings

class Announcement(models.Model):
    title   = models.CharField(max_length=200)
    content = models.TextField()
    date    = models.DateTimeField(auto_now_add=True)
    # ← add this:
    author  = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='announcements',
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.title
