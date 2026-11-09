export const ordersLessonMeta = {
  id: 'orders',
  title: 'Работа с заказом',
  path: '/learn/orders',
  catalogDescription:
    'Как оформить заказ, выбрать удобный способ доставки и разобраться в скидках и акциях каталога',
} as const;

export type OrderLearningStep = {
  id: string;
  number: number;
  stageNumber: number;
  stageTitle: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export type OrderStepSequence = {
  id: string;
  title: string;
  steps: OrderLearningStep[];
};

export const ORDER_SCREENSHOT_WIDTH = 941;
export const ORDER_SCREENSHOT_HEIGHT = 1672;

const orderScreenshot = (number: number) =>
  `${import.meta.env.BASE_URL}media/orders/order-wizard-${String(number).padStart(2, '0')}.png`;

/** One continuous order walkthrough; the numbered PNGs are kept in the supplied order. */
export const orderStepSequences: OrderStepSequence[] = [
  {
    id: 'order-walkthrough',
    title: 'Как оформить заказ',
    steps: [
      {
        id: 'open-oriflame',
        number: 1,
        stageNumber: 1,
        stageTitle: 'Вход в Oriflame',
        title: 'Открой официальный сайт Oriflame',
        description: 'Для оформления заказа перейди в личный кабинет через значок профиля в нижнем меню сайта Oriflame.',
        imageSrc: orderScreenshot(1),
        imageAlt: 'Главная страница Oriflame с нижним меню сайта и значком профиля.',
      },
      {
        id: 'sign-in',
        number: 2,
        stageNumber: 1,
        stageTitle: 'Вход в Oriflame',
        title: 'Войди в личный кабинет',
        description: 'Укажи номер Партнёра или электронную почту и пароль. Также доступен вход по номеру телефона.',
        imageSrc: orderScreenshot(2),
        imageAlt: 'Экран авторизации Oriflame с полями для номера Партнёра или электронной почты и пароля.',
      },
      {
        id: 'profile',
        number: 3,
        stageNumber: 1,
        stageTitle: 'Вход в Oriflame',
        title: 'Данные профиля',
        description: 'Проверь, что ты вошёл в личный кабинет: в профиле видны данные Партнёра, персональная ссылка и электронный кошелёк Oriflame.',
        imageSrc: orderScreenshot(3),
        imageAlt: 'Страница профиля Oriflame с кодом приглашения, персональной ссылкой и электронным кошельком.',
      },
      {
        id: 'open-catalog',
        number: 4,
        stageNumber: 2,
        stageTitle: 'Выбор продукции',
        title: 'Открой каталог продукции',
        description: 'Просматривай страницы электронного каталога и переходи к интересующим предложениям.',
        imageSrc: orderScreenshot(4),
        imageAlt: 'Электронный каталог Oriflame открыт на первой странице.',
      },
      {
        id: 'product-offer',
        number: 5,
        stageNumber: 2,
        stageTitle: 'Выбор продукции',
        title: 'Изучи предложение и цену товара',
        description: 'Обрати внимание на описание товара, код продукта, стоимость и количество ББ. Цена на скриншоте приведена как пример и может меняться.',
        imageSrc: orderScreenshot(5),
        imageAlt: 'Страница каталога с парфюмерной продукцией, описанием, кодом, ценой и ББ.',
      },
      {
        id: 'choose-products',
        number: 6,
        stageNumber: 2,
        stageTitle: 'Выбор продукции',
        title: 'Выбери товары из каталога',
        description: 'Выбирай продукцию разных категорий и добавляй необходимые товары в корзину.',
        imageSrc: orderScreenshot(6),
        imageAlt: 'Страница каталога со средствами личной гигиены и ухода.',
      },
      {
        id: 'review-cart',
        number: 7,
        stageNumber: 3,
        stageTitle: 'Проверка корзины',
        title: 'Проверь товары в корзине',
        description: 'Проверь наименования, количество, стоимость и баллы ББ. При необходимости измени количество или удали товар, затем продолжи оформление.',
        imageSrc: orderScreenshot(7),
        imageAlt: 'Корзина с выбранными товарами, количеством, стоимостью и баллами ББ.',
      },
      {
        id: 'online-offers',
        number: 8,
        stageNumber: 3,
        stageTitle: 'Проверка корзины',
        title: 'Проверь дополнительные предложения',
        description: 'При оформлении могут появляться специальные предложения. Ознакомься с ними и добавь интересующий товар, если предложение доступно.',
        imageSrc: orderScreenshot(8),
        imageAlt: 'Блок «Эксклюзивно онлайн» с товарами и кнопками добавления.',
      },
      {
        id: 'delivery-method',
        number: 9,
        stageNumber: 4,
        stageTitle: 'Оформление доставки',
        title: 'Выбери способ получения заказа',
        description: 'Сравни доступные варианты самовывоза и курьерской доставки. Проверь адрес получения, контактные данные и сведения о доставке.',
        imageSrc: orderScreenshot(9),
        imageAlt: 'Экран выбора способа получения заказа с адресом, контактами и деталями доставки.',
      },
      {
        id: 'pickup-list',
        number: 10,
        stageNumber: 4,
        stageTitle: 'Оформление доставки',
        title: 'Открой выбор пункта выдачи',
        description: 'Выбери другой пункт получения заказа из списка и подтверди свой выбор.',
        imageSrc: orderScreenshot(10),
        imageAlt: 'Окно со списком пунктов выдачи и кнопкой подтверждения выбора.',
      },
      {
        id: 'pickup-map-search',
        number: 11,
        stageNumber: 4,
        stageTitle: 'Оформление доставки',
        title: 'Найди пункт выдачи на карте',
        description: 'Для поиска пункта воспользуйся интерактивной картой или строкой поиска.',
        imageSrc: orderScreenshot(11),
        imageAlt: 'Интерактивная карта пунктов выдачи со строкой поиска.',
      },
      {
        id: 'pickup-search-city',
        number: 12,
        stageNumber: 4,
        stageTitle: 'Оформление доставки',
        title: 'Введи город или адрес',
        description: 'Введи название города или адрес и выбери подходящий результат из списка.',
        imageSrc: orderScreenshot(12),
        imageAlt: 'Строка поиска со словом «Красноярск» и списком найденных адресов.',
      },
      {
        id: 'pickup-map-city',
        number: 13,
        stageNumber: 4,
        stageTitle: 'Оформление доставки',
        title: 'Проверь расположение пункта выдачи',
        description: 'Найди подходящий пункт, проверь его расположение и заверши выбор в интерфейсе Oriflame. Точки на скриншоте не подтверждают текущую доступность.',
        imageSrc: orderScreenshot(13),
        imageAlt: 'Карта пунктов выдачи после перехода к выбранному городу.',
      },
      {
        id: 'payment-and-finish',
        number: 14,
        stageNumber: 5,
        stageTitle: 'Оплата и завершение заказа',
        title: 'Проверь заказ и выбери способ оплаты',
        description: 'Перед оплатой проверь количество товаров, стоимость продукции и доставки, итоговую сумму, баллы ББ и доступный способ оплаты. На скриншоте показаны СБП по QR-коду и банковская карта. Затем нажми «Оплатить заказ» и выполни следующие действия на сайте. Дождись подтверждения Oriflame.',
        imageSrc: orderScreenshot(14),
        imageAlt: 'Экран выбора оплаты через СБП по QR-коду или банковской картой с итогом заказа и баллами ББ.',
      },
    ],
  },
];

export const deliveryHelpLink = {
  label: 'Официальный сайт Oriflame - раздел «Помощь»',
  href: 'https://oriflame.ru/',
} as const;

export const offerLearning = {
  intro:
    'Условия у разных акций отличаются. Перед заказом проверьте описание предложения и убедитесь, что скидка или подарок появились в корзине.',
  conditions: [
    'Срок действия предложения.',
    'Какие товары участвуют и какие исключены.',
    'Нужна ли минимальная сумма или количество баллов.',
    'Как получить подарок: включён ли он автоматически или требуется отдельное действие.',
    'Для какой категории пользователей предназначено предложение.',
  ],
  possibleReasons: [
    'Срок предложения закончился или ещё не начался.',
    'Товар не участвует в акции.',
    'Не выполнено условие предложения, например минимальная сумма, если она указана.',
    'Предложение предназначено для другой категории пользователей.',
    'Нужно дополнительное действие, например выбрать или добавить подарок.',
  ],
  links: [
    { id: 'catalog-promotions', label: 'Акции Oriflame', href: 'https://oriflame.ru/offer/akcii' },
    { id: 'online-exclusive', label: 'Эксклюзивно онлайн', href: 'https://oriflame.ru/offer/online-exclusive' },
  ],
  note:
    'Это возможные причины, а не универсальные правила. Проверяйте условия конкретной акции на официальной странице: предложения и даты меняются.',
} as const;

export const orderScenarios = [
  {
    id: 'delivery-cost',
    title: 'Доставка: дешевле не всегда удобнее',
    question: 'Один из доступных способов стоит меньше, но получать заказ там неудобно. Как выбрать?',
    answer: 'Сравните показанную стоимость, доступность и условия получения. Затем решите, оправдывает ли экономия неудобство: самый дешёвый вариант не обязательно самый подходящий.',
  },
  {
    id: 'missing-gift',
    title: 'Акция: подарок не появился',
    question: 'По условиям акции вы ожидаете подарок, но его нет в корзине. Что проверить?',
    answer: 'Сверьте срок, участвующие товары, условие и категорию пользователей. Проверьте, не нужно ли выбрать или добавить подарок отдельно. Если причина неясна, обратитесь в официальную поддержку до подтверждения.',
  },
  {
    id: 'before-submit',
    title: 'Перед подтверждением заказа',
    question: 'Корзина собрана и доставка выбрана. Что проверить?',
    answer: 'Сверьте товары и количество, адрес, доставку, оплату, применившиеся предложения и итоговую сумму. После отправки дождитесь сообщения или статуса подтверждения.',
  },
] as const;

export const orderFinalChecklist = [
  { id: 'items', text: 'Состав заказа, варианты товаров и количество.' },
  { id: 'address', text: 'Данные и адрес доставки.' },
  { id: 'delivery', text: 'Способ доставки и показанная стоимость.' },
  { id: 'payment', text: 'Способ оплаты.' },
  { id: 'offers', text: 'Скидки и подарки, которые действительно появились в корзине.' },
  { id: 'total', text: 'Итоговая сумма к оплате.' },
  { id: 'confirmation', text: 'После отправки - сообщение или статус, подтверждающий заказ.' },
] as const;

export const orderFinalNotice =
  'В опубликованных Правилах и Условиях для Бизнес‑Партнёров указано, что после размещения онлайн-заказ нельзя изменить через сайт. Правило относится к этому типу аккаунта. Если заказ уже отправлен, проверьте условия своего аккаунта и рынка и как можно скорее обратитесь в официальную поддержку.';

export const orderOfficialLinks = [
  {
    id: 'business-partner-terms',
    label: 'Правила и условия для Бизнес‑Партнёра',
    href: 'https://oriflame.ru/documents/terms-and-conditions-consultant',
  },
] as const;
