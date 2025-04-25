"""Django's command-line utility for administrative tasks."""  # Entry point for manage.py commands
import os  # to set environment variables
import sys  # to grab command-line arguments


def main():
    """Run administrative tasks."""  # Wrap CLI logic in a main function
    # ensure Django knows which settings module to use
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yogamaster.settings')
    try:
        # import the Django management command executor
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # helpful error if Django isn't installed or env not activated
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    # pass through the command-line args to Django
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()  # invoke the main entry point when run as a script
