# Скриншоты урока «Работа с заказом»

В этой папке пока нет реальных скриншотов. Не добавляйте сюда макеты или изображения, которые имитируют интерфейс Oriflame.

Для замены заглушек подготовьте актуальные скриншоты без имён, адресов, номеров заказов и других личных данных, затем сохраните их под именами:

- `order-products.png`
- `order-cart.png`
- `delivery-available-options.png`
- `delivery-compare.png`
- `order-check-summary.png`
- `order-confirmation.png`

После добавления файлов замените `imageSrc: null` на `${import.meta.env.BASE_URL}media/orders/<имя-файла>` у соответствующего шага в `src/data/learning/orders.ts`. Проверьте, что `imageAlt` и `imageCaption` описывают именно изображённый экран.
