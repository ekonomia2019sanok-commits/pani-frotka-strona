# Pani_frotka - sklep/katalog handmade

Prosta, elegancka strona sklepu/katalogu dla marki **Pani_frotka**. Strona pokazuje kategorie produktów handmade: torby, breloki, workoplecaki, frotki, boxy i kosmetyczki.

Grafiki w folderze `kolekcje` są traktowane jako **wzory grafik na torby** i wyświetlają się na podstronie `produkty/torby.html`.

Zdjęcia gotowych produktów wrzucaj do folderu `zdjecia-produktow`, do odpowiedniej kategorii:

- breloki: `zdjecia-produktow/breloki`
- workoplecaki: `zdjecia-produktow/workoplecaki`
- frotki: `zdjecia-produktow/frotki`
- boxy: `zdjecia-produktow/boxy`
- kosmetyczki: `zdjecia-produktow/kosmetyczki`

Zdjęcia kafelków kategorii na stronie głównej wrzucaj do folderu `zdjecia-kategorii` i nazwij dokładnie:

- `torby.jpg`
- `breloki.jpg`
- `workoplecaki.jpg`
- `frotki.jpg`
- `boxy.jpg`
- `kosmetyczki.jpg`

Najlepiej sprawdzają się poziome zdjęcia w proporcji około 4:3 albo 5:4. Po podmianie zdjęcia wystarczy odświeżyć `index.html`.

## Jak działa aktualizacja

1. Wzory na torby wrzucasz do folderu `kolekcje`.
2. Zdjęcia produktów wrzucasz do odpowiednich folderów w `zdjecia-produktow`.
3. Jeśli chcesz mieć osobne kolekcje wzorów na torby, tworzysz podfoldery, np. `kolekcje/Kwiaty` albo `kolekcje/Bieszczady`.
4. Uruchamiasz generator:

```bash
python generate.py
```

Na tym komputerze możesz też użyć pliku `uruchom-generator.bat` - wystarczy go dwukrotnie kliknąć.

5. Otwierasz albo odświeżasz plik `index.html` w przeglądarce.

Generator tworzy plik `data.js`. Podstrona z torbami czyta właśnie ten plik, dlatego po dodaniu nowych wzorów wystarczy ponownie uruchomić generator.

## Struktura projektu

```text
pani-frotka-strona/
├── index.html
├── style.css
├── script.js
├── generate.py
├── data.js
├── logo.jpg
├── produkty/
│   ├── torby.html
│   ├── breloki.html
│   ├── workoplecaki.html
│   ├── frotki.html
│   ├── boxy.html
│   └── kosmetyczki.html
├── zdjecia-produktow/
│   ├── breloki/
│   ├── workoplecaki/
│   ├── frotki/
│   ├── boxy/
│   └── kosmetyczki/
├── zdjecia-kategorii/
│   ├── torby.jpg
│   ├── breloki.jpg
│   ├── workoplecaki.jpg
│   ├── frotki.jpg
│   ├── boxy.jpg
│   └── kosmetyczki.jpg
└── kolekcje/
    ├── Bieszczady/
    ├── Kwiaty/
    └── Zwierzęta_kolorowe/
```

## Nazwy wzorów na torby

- nazwa kolekcji pochodzi z nazwy folderu,
- nazwa wzoru pochodzi z nazwy pliku,
- znaki `_` i `-` w nazwach plików są zamieniane na spacje,
- pliki wrzucone bezpośrednio do `kolekcje` trafiają do kolekcji `Różne projekty`.

Obsługiwane formaty zdjęć: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`.

## Uruchomienie

Po wygenerowaniu danych wystarczy otworzyć `index.html`. Strona nie wymaga serwera ani instalowania dodatkowych bibliotek.

Zamówienia są kierowane do wiadomości prywatnej na Facebooku albo Instagramie.

## Formularz kontaktowy

Na stronie głównej jest sekcja `Kontakt` z formularzem. Formularz pozwala wybrać rodzaj zapytania, podać e-mail albo telefon, dodać krótki opis i dołączyć plik.

Dozwolone formaty plików:

- `.jpg`
- `.jpeg`
- `.png`

Formularz jest przygotowany pod Netlify Forms. Po wrzuceniu strony na Netlify zapytania mogą być zbierane w panelu Netlify bez pisania dodatkowego backendu.
