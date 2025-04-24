from django.db import models
from users.models import User

class YogaClass(models.Model):
    CLASS_TYPES = [
        ('Vinyasa Flow', 'Vinyasa Flow'),
        ('Hatha Yoga',    'Hatha Yoga'),
        ('Yin Yoga',      'Yin Yoga'),
        ('Power Yoga',    'Power Yoga'),
        ('Ashtanga',      'Ashtanga'),
        ('Restorative',   'Restorative'),
        ('Kundalini',     'Kundalini'),
        ('Flow & Restore','Flow & Restore'),
    ]

    # Static descriptions keyed by the choice value
    TYPE_DESCRIPTIONS = {
        'Vinyasa Flow':  'A dynamic practice linking breath with movement in a continuous, energizing flow.',
        'Hatha Yoga':    'A foundational style focusing on alignment, posture, and mindful breathing.',
        'Yin Yoga':      'A slow-paced practice holding passive poses to stretch deep connective tissues.',
        'Power Yoga':    'A vigorous, fitness-based approach building strength, flexibility, and stamina.',
        'Ashtanga':      'A disciplined sequence of postures performed in a set order to build heat and focus.',
        'Restorative':   'A gentle session using props to support the body, encouraging deep relaxation and healing.',
        'Kundalini':     'A practice combining movement, breathwork, and sound to awaken inner energy.',
        'Flow & Restore':'A balanced class blending dynamic flow segments with restorative holds for equilibrium.',
    }

    title       = models.CharField(max_length=50, choices=CLASS_TYPES)
    # description is set automatically in save() and not editable by hand
    description = models.TextField(editable=False)
    date        = models.DateField()
    start_time  = models.TimeField()
    duration    = models.PositiveIntegerField(help_text="minutes")
    instructor  = models.ForeignKey(
        User,
        limit_choices_to={'role': 'admin'},
        on_delete=models.CASCADE
    )
    capacity    = models.PositiveIntegerField(default=20)

    def save(self, *args, **kwargs):
        # auto-populate description based on the selected title
        self.description = self.TYPE_DESCRIPTIONS.get(self.title, '')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} on {self.date} @ {self.start_time}"
