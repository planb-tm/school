export const ordersLessonMeta = {
  id: 'orders',
  title: 'Работа с заказом',
  path: '/learn/orders',
  catalogDescription:
    'Как оформить заказ, выбрать удобный способ доставки и разобраться в скидках и акциях каталога',
} as const;

export type OrderLearningStep = {
  id: string;
  title: string;
  description?: string;
  imageSrc: string | null;
  imageAlt: string;
  imageCaption: string;
  /** Optional highlight rectangle in percentage coordinates for a checked screenshot. */
  highlight?: { x: number; y: number; width: number; height: number };
};

export type OrderStepSequence = {
  id: string;
  title: string;
  description?: string;
  steps: OrderLearningStep[];
};

const orderScreenshot = (number: number) =>
  `${import.meta.env.BASE_URL}media/orders/order-step-${String(number).padStart(2, '0')}.jpg`;

/** One continuous order walkthrough; keep the source screenshot number in each file path. */
export const orderStepSequences: OrderStepSequence[] = [
  {
    id: 'order-walkthrough',
    title: 'Оформление заказа',
    steps: [
      {
        id: 'order-step-01',
        title: 'Откройте профиль партнёра',
        imageSrc: orderScreenshot(1),
        imageAlt: 'Мобильная страница Oriflame с выделенной кнопкой профиля в нижнем меню.',
        imageCaption: 'Откройте профиль партнёра через значок в нижней панели.',
      },
      {
        id: 'order-step-02',
        title: 'Войдите в личный кабинет',
        imageSrc: orderScreenshot(2),
        imageAlt: 'Форма входа в личный кабинет Oriflame по номеру партнёра или электронной почте.',
        imageCaption: 'Введите номер партнёра или e-mail и пароль.',
      },
      {
        id: 'order-step-03',
        title: 'Посмотрите профиль и электронный кошелёк',
        imageSrc: orderScreenshot(3),
        imageAlt: 'Страница профиля партнёра с персональной ссылкой и электронным кошельком.',
        imageCaption: 'В профиле доступны персональная ссылка и электронный кошелёк.',
      },
      {
        id: 'order-step-04',
        title: 'Откройте каталог',
        imageSrc: orderScreenshot(4),
        imageAlt: 'Каталог Oriflame открыт на первой странице.',
        imageCaption: 'Откройте каталог, чтобы перейти к выбору продукции.',
      },
      {
        id: 'order-step-05',
        title: 'Изучите страницу товара',
        imageSrc: orderScreenshot(5),
        imageAlt: 'Страница товара каталога с описанием, характеристиками и ценой.',
        imageCaption: 'Откройте карточку товара и ознакомьтесь с его описанием.',
      },
      {
        id: 'order-step-06',
        title: 'Выберите продукцию в каталоге',
        imageSrc: orderScreenshot(6),
        imageAlt: 'Страница каталога с товарами и кнопками добавления в корзину.',
        imageCaption: 'Выберите нужные товары и добавьте их в корзину.',
      },
      {
        id: 'order-step-07',
        title: 'Проверьте корзину',
        imageSrc: orderScreenshot(7),
        imageAlt: 'Корзина с товарами, количеством и кнопкой продолжения оформления.',
        imageCaption: 'Сверьте товары и количество в корзине.',
      },
      {
        id: 'order-step-08',
        title: 'Посмотрите онлайн-предложения',
        imageSrc: orderScreenshot(8),
        imageAlt: 'Раздел онлайн-предложений с товарами и кнопками добавления.',
        imageCaption: 'Проверьте, есть ли подходящие специальные предложения.',
      },
      {
        id: 'order-step-09',
        title: 'Проверьте способ получения',
        imageSrc: orderScreenshot(9),
        imageAlt: 'Страница оформления с выбором получения, адресом и деталями доставки.',
        imageCaption: 'Проверьте способ получения, адрес и показанные условия доставки.',
      },
      {
        id: 'order-step-10',
        title: 'Выберите пункт выдачи',
        imageSrc: orderScreenshot(10),
        imageAlt: 'Список доступных пунктов выдачи с адресами и условиями.',
        imageCaption: 'Выберите подходящий из доступных пунктов выдачи.',
      },
      {
        id: 'order-step-11',
        title: 'Найдите пункт на карте',
        imageSrc: orderScreenshot(11),
        imageAlt: 'Карта с пунктами выдачи, строкой поиска и фильтрами.',
        imageCaption: 'Найдите пункт на карте или воспользуйтесь поиском.',
      },
      {
        id: 'order-step-13',
        title: 'Найдите пункт в своём городе',
        imageSrc: orderScreenshot(13),
        imageAlt: 'Результаты поиска пунктов выдачи в Красноярске на карте.',
        imageCaption: 'Укажите свой город и сравните доступные пункты.',
      },
      {
        id: 'order-step-14',
        title: 'Сравните расположение пунктов',
        imageSrc: orderScreenshot(14),
        imageAlt: 'Пункты выдачи на карте города с указанием расположения.',
        imageCaption: 'Выберите пункт, в который вам будет удобно приехать.',
      },
      {
        id: 'order-step-15',
        title: 'Проверьте оплату и итог заказа',
        imageSrc: orderScreenshot(15),
        imageAlt: 'Страница выбора способа оплаты с составом заказа и итоговой суммой.',
        imageCaption: 'Выберите доступный способ оплаты и ещё раз сверьте итог.',
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
