from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404


def safe_repo_path(relative_path):
    root = Path(settings.REPO_FRONTEND_ROOT).resolve()
    requested = (root / relative_path).resolve()

    if root not in requested.parents and requested != root:
        raise Http404("File not found")

    if not requested.exists() or not requested.is_file():
        raise Http404("File not found")

    return requested


def safe_media_path(relative_path):
    root = Path(settings.MEDIA_ROOT).resolve()
    requested = (root / relative_path).resolve()

    if root not in requested.parents and requested != root:
        raise Http404("File not found")

    if not requested.exists() or not requested.is_file():
        raise Http404("File not found")

    return requested


def serve_repo_file(relative_path):
    return FileResponse(safe_repo_path(relative_path).open("rb"))


def frontend_index(_request):
    return serve_repo_file("index.html")


def frontend_checkout(_request):
    return serve_repo_file("checkout/index.html")


def frontend_product_shell(_request, slug=""):
    return serve_repo_file("product/index.html")


def repo_file(_request, relative_path):
    return serve_repo_file(relative_path)


def repo_asset(_request, relative_path):
    return serve_repo_file(f"assets/{relative_path}")


def repo_src(_request, relative_path):
    return serve_repo_file(f"src/{relative_path}")


def media_file(_request, relative_path):
    return FileResponse(safe_media_path(relative_path).open("rb"))
