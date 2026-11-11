# Essential Stuff

## Html import links

Google font

``` html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&family=Open+Sans&display=swap"
  rel="stylesheet">
```

Ionicon

``` html
<script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
```

---

## Colors

``` css
--pale-purple-pantone: hsl(262, 63%, 92%);
--medium-sea-green: hsl(152, 63%, 43%);
--lavender-blush: hsl(336, 35%, 92%);
--carolina-blue: hsl(204, 91%, 53%);
--columbia-blue: hsl(204, 92%, 90%);
--alice-blue-1: hsl(216, 38%, 95%);
--alice-blue-2: hsl(216, 75%, 97%);
--alice-blue-3: hsl(216, 38%, 95%);
--alice-blue-4: hsl(217, 33%, 92%);
--independence: hsl(219, 21%, 39%);
--deep-cerise: hsl(329, 63%, 52%);
--eerie-black: hsl(210, 11%, 15%);
--space-cadet: hsl(240, 22%, 25%);
--blue-jeans: hsl(204, 80%, 63%);
--slate-blue: hsl(262, 60%, 57%);
--beau-blue: hsl(208, 86%, 92%);
--honey-dew: hsl(152, 48%, 89%);
--mimi-pink: hsl(329, 63%, 90%);
--red-salsa: hsl(0, 79%, 63%);
--sapphire: hsl(211, 100%, 35%);
--manatee: hsl(219, 14%, 60%);
--white: hsl(0, 0%, 100%);

--gradient: linear-gradient(to top, var(--alice-blue-2), var(--alice-blue-3));
```

## Typography

``` css
--ff-nunito: 'Nunito', sans-serif;
--ff-open-sans: 'Open Sans', sans-serif;

--fs-1: 2.125rem;
--fs-2: 1.875rem;
--fs-3: 1.5rem;
--fs-4: 1.375rem;
--fs-5: 1.125rem;
--fs-6: 0.875rem;
--fs-7: 0.625rem;

--fw-400: 400;
--fw-600: 600;
```

## Transition

``` css
--transition: 0.5s ease;
```

## Spacing

``` css
--section-padding: 50px;
```

## Radius

``` css
--radius-10: 10px;
--radius-14: 14px;
--radius-18: 18px;
```

## Shadow

``` css
--shadow-1: 3px 3px 9px hsla(240, 14%, 69%, 0.2);
--shadow-2: 3px 3px 9px hsla(204, 92%, 59%, 0.3);
```

---

## Accessible additions (portfolio upgrade)

The palette above is kept as-is in `frontend/src/styles/main.css`. A few roles are added so
text always meets WCAG AA (4.5:1) on its background:

| Role | Value | Why |
| --- | --- | --- |
| Primary button / link | `--sapphire` (hover `hsl(211, 100%, 28%)`) | White on `--carolina-blue` is about 2.9:1; `--carolina-blue` stays as the accent and focus ring |
| Muted text | `--independence` | `--manatee` text on white is below 3:1; `--manatee` is used for borders only |
| Success ink | `hsl(152, 63%, 24%)` on `--honey-dew` | |
| Danger ink | `hsl(0, 65%, 42%)` | |
| Cerise ink | `hsl(329, 63%, 34%)` on `--mimi-pink` / `--lavender-blush` | |
| Violet ink | `hsl(262, 50%, 40%)` on `--pale-purple-pantone` | |

Interaction transitions use 150-250ms (`--dur-fast`, `--dur-med`); the original `--transition: 0.5s ease`
is kept for the slow image zoom on car cards. Motion is disabled under `prefers-reduced-motion`.
