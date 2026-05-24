from pathlib import Path
import json
import re


# Generator skanuje foldery ze zdjęciami i zapisuje dane dla strony.
PROJECT_DIR = Path(__file__).resolve().parent
COLLECTIONS_DIR = PROJECT_DIR / "kolekcje"
PRODUCTS_DIR = PROJECT_DIR / "zdjecia-produktow"
OUTPUT_FILE = PROJECT_DIR / "data.js"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
DEFAULT_COLLECTION = "Różne projekty"
PRODUCT_FOLDERS = {
    "breloki": "Breloki",
    "workoplecaki": "Workoplecaki",
    "frotki": "Frotki",
    "boxy": "Boxy",
    "kosmetyczki": "Kosmetyczki",
}


def pretty_name(file_path):
    """Zamienia techniczną nazwę pliku na czytelniejszą nazwę produktu."""
    name = file_path.stem
    name = re.sub(r"[_-]+", " ", name)
    name = re.sub(r"\b\d{3,4}px\b", "", name, flags=re.IGNORECASE)
    name = re.sub(r"\b\d{3,4}dpi\b", "", name, flags=re.IGNORECASE)
    name = re.sub(r"\b3000x3000\b", "", name, flags=re.IGNORECASE)
    name = re.sub(r"\s+", " ", name).strip(" !-_.")
    return name or file_path.stem


def sort_key(path):
    # Sortowanie bez dodatkowych bibliotek.
    return path.name.casefold()


def image_files(folder):
    for image_path in sorted(folder.rglob("*"), key=sort_key):
        if image_path.is_file() and image_path.suffix.lower() in ALLOWED_EXTENSIONS:
            yield image_path


def add_product(products, image_path, collection_name):
    relative_path = image_path.relative_to(PROJECT_DIR).as_posix()
    products.append(
        {
            "name": pretty_name(image_path),
            "collection": collection_name,
            "path": relative_path,
        }
    )


def build_bag_patterns():
    patterns = []
    COLLECTIONS_DIR.mkdir(parents=True, exist_ok=True)

    # Pliki wrzucone bezpośrednio do "kolekcje" trafiają do kolekcji domyślnej.
    for image_path in sorted(COLLECTIONS_DIR.iterdir(), key=sort_key):
        if image_path.is_file() and image_path.suffix.lower() in ALLOWED_EXTENSIONS:
            add_product(patterns, image_path, DEFAULT_COLLECTION)

    # Każdy podfolder w "kolekcje" jest osobną kolekcją wzorów na torby.
    for collection_dir in sorted(COLLECTIONS_DIR.iterdir(), key=sort_key):
        if not collection_dir.is_dir():
            continue

        for image_path in image_files(collection_dir):
            add_product(patterns, image_path, collection_dir.name)

    return patterns


def build_category_products():
    PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)
    category_data = {}

    for folder_name, label in PRODUCT_FOLDERS.items():
        category_dir = PRODUCTS_DIR / folder_name
        category_dir.mkdir(parents=True, exist_ok=True)
        category_data[folder_name] = []

        for image_path in image_files(category_dir):
            category_data[folder_name].append(
                {
                    "name": pretty_name(image_path),
                    "collection": label,
                    "path": image_path.relative_to(PROJECT_DIR).as_posix(),
                }
            )

    return category_data


def save_data(patterns, category_data):
    # data.js jest wczytywany przez strony, więc całość działa lokalnie po otwarciu index.html.
    bag_json = json.dumps(patterns, ensure_ascii=False, indent=2)
    category_json = json.dumps(category_data, ensure_ascii=False, indent=2)
    OUTPUT_FILE.write_text(
        "window.PANI_FROTKA_DATA = "
        + bag_json
        + ";\nwindow.PANI_FROTKA_CATEGORY_DATA = "
        + category_json
        + ";\n",
        encoding="utf-8",
    )


def main():
    patterns = build_bag_patterns()
    category_data = build_category_products()
    save_data(patterns, category_data)

    product_count = sum(len(items) for items in category_data.values())
    print(f"Gotowe. Zapisano {len(patterns)} wzorów na torby i {product_count} zdjęć produktów.")


if __name__ == "__main__":
    main()
