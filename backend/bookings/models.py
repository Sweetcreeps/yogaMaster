from django.db import models
from users.models import User
from classes.models import YogaClass

class Booking(models.Model):
    user       = models.ForeignKey(User, on_delete=models.CASCADE)
    yoga_class = models.ForeignKey(YogaClass, on_delete=models.CASCADE)
    timestamp  = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user','yoga_class')

    def __str__(self):
        return f"{self.user.username} → {self.yoga_class}"
