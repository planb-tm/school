export type ProductCategory = {
  id: string;
  title: string;
  description: string;
};

export const productsLessonMeta = {
  id: 'products-oriflame',
  title: 'Продукция Oriflame',
  path: '/learn/products',
  catalogDescription:
    'Обзор основных категорий продукции для личного использования.',
} as const;

export const productsIntro = [
  'Одна из основ бизнеса Oriflame - товарооборот. Он формируется в том числе за счёт заказов для личного использования. Поэтому возникает закономерный вопрос: что можно покупать в компании?',
  'Давай посмотрим, какая продукция представлена в Oriflame и что можно найти для себя.',
] as const;

/** High-level assortment overview — not a product catalogue. */
export const productCategories: ProductCategory[] = [
  {
    id: 'fragrance',
    title: 'Парфюмерия',
    description:
      'Женские и мужские ароматы для разных предпочтений и случаев.',
  },
  {
    id: 'colour',
    title: 'Косметика',
    description: 'Средства для макияжа и создания повседневных образов.',
  },
  {
    id: 'skincare',
    title: 'Уход за лицом',
    description:
      'Средства для очищения, увлажнения и комплексного ухода. Есть линейки разных ценовых категорий, поэтому можно выбирать подходящие варианты в зависимости от потребностей и бюджета.',
  },
  {
    id: 'body-hygiene',
    title: 'Уход за телом и личная гигиена',
    description:
      'Шампуни, гели для душа, мыло, зубные пасты, пена для бритья и средства для интимной гигиены.',
  },
  {
    id: 'wellosophy',
    title: 'Wellosophy',
    description:
      'Направление, связанное с питанием, здоровыми привычками и продуктами для дополнения рациона. Необходимо учитывать назначение продуктов и рекомендации производителя.',
  },
  {
    id: 'accessories',
    title: 'Аксессуары',
    description:
      'Разнообразные аксессуары для красоты, ухода за собой и повседневного использования. Ассортимент может меняться.',
  },
];

/** Official Oriflame Russia (RU) links — verified against oriflame.ru. */
export const productsOutro = {
  text: 'Здесь мы рассмотрели основные категории продукции Oriflame. Подробную информацию о каждом продукте можно найти на официальном сайте компании и в электронном каталоге.',
  links: [
    {
      id: 'official-site',
      label: 'Официальный сайт Oriflame',
      href: 'https://oriflame.ru/',
    },
    {
      id: 'digital-catalogue',
      label: 'Электронный каталог',
      href: 'https://oriflame.ru/products/digital-catalogue-current',
    },
  ],
} as const;
