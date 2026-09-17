/**
 * Content taken directly from the approved brief.
 *
 * Deliberately NOT seeded: projects, partners and gallery media. The brief
 * requires the commercial register, licences, lab reports and written partner
 * consents to be checked before any of that is published, so those
 * collections start empty and are filled from the admin API once the
 * documents are on file.
 */

export const SETTINGS_SEED = {
  key: 'site',
  companyName: { ar: 'مواردنا مستقبلنا', en: 'Mawaredna Mostaqbalna' },
  slogan: { ar: 'من مخلفاتنا... نصنع مستقبلنا', en: 'From our waste, we build our future' },
  about: {
    ar: 'شركة مواردنا مستقبلنا تعمل في مجال جمع وتدوير ومعالجة المخلفات الزراعية ومخلفات قصب السكر، وتحويلها إلى منتجات عضوية ذات قيمة اقتصادية وبيئية، وعلى رأسها الكمبوست والأسمدة العضوية.',
    en: 'Mawaredna Mostaqbalna collects, processes and recycles agricultural residues and sugarcane by-products, turning them into organic products of economic and environmental value - chiefly compost and organic fertilisers.',
  },
  vision: {
    ar: 'المساهمة في بناء منظومة مستدامة لإدارة وتدوير المخلفات الزراعية وتحويلها إلى موارد ومنتجات نافعة للقطاع الزراعي.',
    en: 'To help build a sustainable system for managing and recycling agricultural waste, turning it into useful resources and products for the farming sector.',
  },
  mission: {
    ar: 'تقديم حلول عملية ومنظمة لجمع ومعالجة وتدوير المخلفات الزراعية ومخلفات قصب السكر، وإنتاج منتجات عضوية ذات جودة مناسبة للاستخدام الزراعي.',
    en: 'To deliver practical, well-organised solutions for collecting, processing and recycling agricultural and sugarcane residues, and to produce organic products of a quality suited to agricultural use.',
  },
  goals: [
    { ar: 'تحويل المخلفات الزراعية من عبء إلى مورد اقتصادي قابل للاستفادة.', en: 'Turn agricultural waste from a burden into a usable economic resource.' },
    { ar: 'إعادة إدخال المواد العضوية في دورة الإنتاج الزراعي.', en: 'Return organic matter to the agricultural production cycle.' },
    { ar: 'تقديم حلول متكاملة لإدارة المخلفات للمزارع والشركات والمؤسسات.', en: 'Provide integrated waste-management solutions for farms, companies and institutions.' },
    { ar: 'إنتاج كمبوست وأسمدة عضوية بجودة مناسبة للاستخدام الزراعي.', en: 'Produce compost and organic fertilisers of a quality suited to agricultural use.' },
  ],
  address: { ar: '', en: '' },
  phones: [] as string[],
  whatsapp: '',
  email: '',
  servedGovernorates: [] as string[],
};

export const SERVICES_SEED = [
  {
    slug: 'agricultural-waste-collection',
    title: { ar: 'جمع المخلفات الزراعية', en: 'Agricultural waste collection' },
    description: {
      ar: 'جمع المخلفات الزراعية من المزارع والأراضي الزراعية بأسطول ومعدات مخصصة، وفق جداول زمنية منظمة تناسب مواعيد الحصاد.',
      en: 'Collecting crop residues from farms and agricultural land with dedicated equipment, on schedules that fit the harvest calendar.',
    },
    icon: 'truck',
    order: 1,
  },
  {
    slug: 'sorting-and-aggregation',
    title: { ar: 'تجميع وفرز المخلفات النباتية', en: 'Aggregation and sorting of plant residues' },
    description: {
      ar: 'تجميع المخلفات النباتية في مواقع مجهزة وفرزها حسب النوع والحالة، تمهيدًا لدخولها مراحل المعالجة.',
      en: 'Gathering plant residues at prepared sites and sorting them by type and condition before processing begins.',
    },
    icon: 'layers',
    order: 2,
  },
  {
    slug: 'waste-processing-and-recycling',
    title: { ar: 'معالجة وتدوير المخلفات الزراعية', en: 'Processing and recycling of agricultural waste' },
    description: {
      ar: 'معالجة المخلفات الزراعية وتدويرها من خلال مراحل فنية منظمة تشمل الفرم والترطيب والتخمير والتقليب.',
      en: 'Processing and recycling agricultural residues through structured stages: shredding, moistening, fermentation and turning.',
    },
    icon: 'recycle',
    order: 3,
  },
  {
    slug: 'sugarcane-residues',
    title: { ar: 'الاستفادة من مخلفات قصب السكر', en: 'Valorising sugarcane residues' },
    description: {
      ar: 'إدخال مخلفات قصب السكر في منظومة التدوير والمعالجة للاستفادة منها في إنتاج المنتجات العضوية والكمبوست.',
      en: 'Feeding sugarcane residues into the recycling and processing system to produce organic products and compost.',
    },
    icon: 'wheat',
    order: 4,
  },
  {
    slug: 'compost-production',
    title: { ar: 'تصنيع وإنتاج الكمبوست', en: 'Compost manufacturing and production' },
    description: {
      ar: 'إنتاج الكمبوست من المخلفات الزراعية المعالجة عبر مراحل تخمير وتقليب وتجهيز، وصولًا إلى منتج نهائي جاهز للاستخدام الزراعي.',
      en: 'Producing compost from processed agricultural residues through fermentation, turning and finishing, into a product ready for agricultural use.',
    },
    icon: 'sprout',
    order: 5,
  },
  {
    slug: 'organic-fertilisers',
    title: { ar: 'إنتاج الأسمدة العضوية', en: 'Organic fertiliser production' },
    description: {
      ar: 'إنتاج أسمدة عضوية تعتمد على المواد العضوية الناتجة من تدوير المخلفات الزراعية.',
      en: 'Producing organic fertilisers based on the organic matter recovered from agricultural waste recycling.',
    },
    icon: 'leaf',
    order: 6,
  },
  {
    slug: 'product-finishing',
    title: { ar: 'تجهيز وتحسين المنتجات العضوية', en: 'Finishing and improving organic products' },
    description: {
      ar: 'تجهيز المنتجات العضوية وتحسين خواصها الفيزيائية لتناسب الاستخدام الزراعي وطرق التوريد المختلفة.',
      en: 'Finishing organic products and improving their physical properties to suit agricultural use and different supply formats.',
    },
    icon: 'settings-2',
    order: 7,
  },
  {
    slug: 'integrated-waste-management',
    title: { ar: 'حلول متكاملة لإدارة المخلفات الزراعية', en: 'Integrated agricultural waste management' },
    description: {
      ar: 'تقديم حلول متكاملة تبدأ من دراسة احتياج الموقع وتنتهي بخطة جمع ومعالجة وتدوير منظمة.',
      en: 'End-to-end solutions, from assessing a site to running an organised collection, processing and recycling plan.',
    },
    icon: 'clipboard-list',
    order: 8,
  },
  {
    slug: 'partnerships',
    title: { ar: 'التعاون مع المزارع والشركات والمؤسسات', en: 'Cooperation with farms, companies and institutions' },
    description: {
      ar: 'التعاون مع المزارع والشركات والمؤسسات والجهات المعنية في مشروعات تدوير المخلفات الزراعية.',
      en: 'Working with farms, companies, institutions and relevant authorities on agricultural waste recycling projects.',
    },
    icon: 'handshake',
    order: 9,
  },
];

export const COMPOST_SEED = {
  slug: 'mawaredna-compost',
  name: { ar: 'كمبوست مواردنا مستقبلنا', en: 'Mawaredna Mostaqbalna Compost' },
  summary: {
    ar: 'كمبوست عضوي منتج من المخلفات الزراعية ومخلفات قصب السكر بعد مراحل معالجة وتخمير وتقليب وتجهيز.',
    en: 'Organic compost produced from agricultural and sugarcane residues after processing, fermentation, turning and finishing.',
  },
  description: {
    ar: 'يُنتج كمبوست مواردنا مستقبلنا من مخلفات زراعية يتم جمعها وفرزها ومعالجتها، ثم تمر بمراحل تخمير وتقليب منتظمة حتى الوصول إلى منتج نهائي متجانس. تُعرض المواصفات النهائية وفق نتائج التحاليل المعملية المعتمدة.',
    en: 'Mawaredna compost is made from agricultural residues that are collected, sorted and processed, then fermented and turned on a regular cycle until a homogeneous finished product is reached. Final specifications are published according to accredited laboratory analyses.',
  },
  rawMaterials: [
    { ar: 'المخلفات الزراعية النباتية', en: 'Plant-based agricultural residues' },
    { ar: 'مخلفات قصب السكر', en: 'Sugarcane residues' },
    { ar: 'مخلفات نباتية أخرى بعد الفرز', en: 'Other plant residues after sorting' },
  ],
  productionStages: [
    { title: { ar: 'الاستلام والفرز', en: 'Receiving and sorting' }, description: { ar: 'استلام المخلفات وفرزها حسب النوع والحالة.', en: 'Residues are received and sorted by type and condition.' }, order: 1 },
    { title: { ar: 'الفرم والتجهيز الأولي', en: 'Shredding and initial preparation' }, description: { ar: 'تقليل حجم المخلفات لتسريع المعالجة.', en: 'Reducing particle size to speed up processing.' }, order: 2 },
    { title: { ar: 'بناء المصفوفات والترطيب', en: 'Windrow building and moistening' }, description: { ar: 'تكوين مصفوفات الكمبوست وضبط نسبة الرطوبة.', en: 'Windrows are formed and moisture content is adjusted.' }, order: 3 },
    { title: { ar: 'التخمير', en: 'Fermentation' }, description: { ar: 'مرحلة التخمير ومتابعة الحرارة داخل المصفوفات.', en: 'The fermentation stage, with temperature monitored inside the windrows.' }, order: 4 },
    { title: { ar: 'التقليب', en: 'Turning' }, description: { ar: 'تقليب المصفوفات بصورة دورية لضمان التجانس والتهوية.', en: 'Windrows are turned on a cycle to keep the material uniform and aerated.' }, order: 5 },
    { title: { ar: 'النضج والتجهيز', en: 'Maturation and finishing' }, description: { ar: 'استكمال النضج ثم التجهيز النهائي للمنتج.', en: 'Maturation is completed and the product is finished.' }, order: 6 },
    { title: { ar: 'التعبئة والتوريد', en: 'Packaging and supply' }, description: { ar: 'تعبئة المنتج وتوريده حسب طلب العميل.', en: 'The product is packaged and supplied to order.' }, order: 7 },
  ],
  specifications: [
    { label: { ar: 'الوزن الحجمي للمتر المكعب', en: 'Bulk density per cubic metre' }, value: '500-600', unit: 'kg/m³' },
    { label: { ar: 'المادة العضوية', en: 'Organic matter' }, value: '45-55', unit: '%' },
    { label: { ar: 'درجة الحموضة pH', en: 'pH' }, value: '6.5', unit: '' },
    { label: { ar: 'الرطوبة', en: 'Moisture' }, value: '35', unit: '%' },
  ],
  usageInstructions: [
    { ar: 'يُضاف الكمبوست أثناء تجهيز الأرض قبل الزراعة، ويُقلب مع الطبقة السطحية للتربة.', en: 'Apply during land preparation before planting and mix into the topsoil layer.' },
    { ar: 'يمكن استخدامه مع المحاصيل الحقلية والخضروات والبساتين وفق التوصية الفنية.', en: 'Suitable for field crops, vegetables and orchards, following the technical recommendation.' },
    { ar: 'تُحدد الكمية المناسبة حسب نوع التربة والمحصول ونتائج تحليل التربة.', en: 'The right rate depends on soil type, crop and the soil analysis result.' },
  ],
  packaging: {
    ar: 'يتم التوريد سائبًا أو معبأ حسب اتفاق العميل، مع إمكانية التوريد إلى موقع المزرعة.',
    en: 'Supplied in bulk or bagged as agreed with the customer, with delivery to the farm available.',
  },
  labResults: [],
  images: [],
  order: 1,
  isActive: true,
};

/** "من المخلفات إلى منتج" - the visual process chain on the site. */
export const PROCESS_STAGES = [
  { key: 'residues', ar: 'المخلفات الزراعية', en: 'Agricultural residues', icon: 'wheat' },
  { key: 'collection', ar: 'الجمع', en: 'Collection', icon: 'truck' },
  { key: 'transport', ar: 'النقل', en: 'Transport', icon: 'route' },
  { key: 'aggregation', ar: 'التجميع', en: 'Aggregation', icon: 'layers' },
  { key: 'processing', ar: 'المعالجة', en: 'Processing', icon: 'settings-2' },
  { key: 'fermentation', ar: 'التخمير', en: 'Fermentation', icon: 'thermometer' },
  { key: 'turning', ar: 'التقليب', en: 'Turning', icon: 'refresh-cw' },
  { key: 'finishing', ar: 'التجهيز', en: 'Finishing', icon: 'package' },
  { key: 'compost', ar: 'الكمبوست', en: 'Compost', icon: 'sprout' },
  { key: 'field-use', ar: 'الاستخدام الزراعي', en: 'Agricultural use', icon: 'leaf' },
] as const;
