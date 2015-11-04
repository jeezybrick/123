from django.contrib.auth.models import AbstractUser
from core.models import TimeStampedModel


# Extend User model
class MyUser(AbstractUser, TimeStampedModel):

    USERNAME_FIELD = 'username'

    def __unicode__(self):
        return self.username

    class Meta(object):
        unique_together = ('email', )
