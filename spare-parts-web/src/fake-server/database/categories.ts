import { CategoryDef } from '../interfaces/category-def';
import {
  BaseCategory,
  Category,
  ShopCategory
} from '../../app/interfaces/category';

let lastId = 0;

function makeShopCategory(
  def: CategoryDef,
  parent: ShopCategory
): ShopCategory {
  return {
    id: ++lastId,
    type: 'shop',
    name: def.name,
    slug: def.slug,
    image: def.image,
    items: def.items,
    parent,
    children: [],
    layout: def.layout ? def.layout : 'products',
    customFields: {}
  };
}

function makeCategories<T extends BaseCategory>(
  makeFn: (def: CategoryDef, parent: T) => T,
  defs: CategoryDef[],
  parent: T = null
): T[] {
  const categories: T[] = [];

  defs.forEach((def) => {
    const category: T = makeFn(def, parent);

    if (def.children) {
      category.children = makeCategories(makeFn, def.children, category);
    }

    categories.push(category);
  });

  return categories;
}

function flatTree<T extends Category>(categories: T[]): T[] {
  let result = [];

  categories.forEach(
    (category) =>
      (result = [
        ...result,
        category,
        ...flatTree(category.children as Category[])
      ])
  );

  return result;
}

const shopCategoriesDef: CategoryDef[] = [
  {
    name: 'Headlights & Lighting',
    slug: 'headlights-lighting',
    image: 'assets/images/categories/category-1.jpg',
    items: 131,
    children: [
      { name: 'Turn Signals', slug: 'turn-signals' },
      { name: 'Fog Lights', slug: 'fog-lights' },
      { name: 'Headlights', slug: 'headlights' },
      { name: 'Switches & Relays', slug: 'switches-relays' },
      { name: 'Tail Lights', slug: 'tail-lights' },
      { name: 'Corner Lights', slug: 'corner-lights' },
      { name: 'Off-Road Lighting', slug: 'off-road-lighting' },
      { name: 'Lighting Accessories', slug: 'lighting-accessories' }
    ]
  },
  {
    name: 'Fuel System',
    slug: 'fuel-system',
    image: 'assets/images/categories/category-2.jpg',
    items: 356,
    children: [
      { name: 'Fuel Pumps', slug: 'fuel-pumps' },
      { name: 'Motor Oil', slug: 'motor-oil' },
      { name: 'Gas Caps', slug: 'gas-caps' },
      { name: 'Fuel Injector', slug: 'fuel-injector' },
      { name: 'Control Motor', slug: 'control-motor' }
    ]
  },
  {
    name: 'Body Parts',
    slug: 'body-parts',
    image: 'assets/images/categories/category-3.jpg',
    items: 54,
    children: [
      { name: 'Bumpers', slug: 'bumpers' },
      { name: 'Hoods', slug: 'hoods' },
      { name: 'Grilles', slug: 'grilles' },
      { name: 'Fog Lights', slug: 'fog-lights' },
      { name: 'Door Handles', slug: 'door-handles' }
    ]
  },
  {
    name: 'Interior Parts',
    slug: 'interior-parts',
    image: 'assets/images/categories/category-4.jpg',
    items: 274,
    children: [
      { name: 'Dashboards', slug: 'dashboards' },
      { name: 'Seat Covers', slug: 'seat-covers' },
      { name: 'Floor Mats', slug: 'floor-mats' },
      { name: 'Sun Shades', slug: 'sun-shades' },
      { name: 'Visors', slug: 'visors' },
      { name: 'Car Covers', slug: 'car-covers' },
      { name: 'Accessories', slug: 'interior-parts-accessories' }
    ]
  },
  {
    name: 'Tires & Wheels',
    slug: 'tires-wheels',
    image: 'assets/images/categories/category-5.jpg',
    items: 508,
    children: [
      { name: 'Wheel Covers', slug: 'wheel-covers' },
      { name: 'Brake Kits', slug: 'brake-kits' },
      { name: 'Tire Chains', slug: 'tire-chains' },
      { name: 'Wheel disks', slug: 'wheel-disks' },
      { name: 'Tires', slug: 'tires' },
      { name: 'Sensors', slug: 'sensors' },
      { name: 'Accessories', slug: 'tires-wheels-accessories' }
    ]
  },
  {
    name: 'Engine & Drivetrain',
    slug: 'engine-drivetrain',
    image: 'assets/images/categories/category-6.jpg',
    items: 95,
    children: [
      { name: 'Timing Belts', slug: 'timing-belts' },
      { name: 'Spark Plugs', slug: 'spark-plugs' },
      { name: 'Oil Pans', slug: 'oil-pans' },
      { name: 'Engine Gaskets', slug: 'engine-gaskets' },
      { name: 'Oil Filters', slug: 'oil-filters' },
      { name: 'Engine Mounts', slug: 'engine-mounts' },
      { name: 'Accessories', slug: 'engine-drivetrain-accessories' }
    ]
  },
  {
    name: 'Oils & Lubricants',
    slug: 'oils-lubricants',
    image: 'assets/images/categories/category-7.jpg',
    items: 179
  },
  {
    name: 'Tools & Garage',
    slug: 'tools-garage',
    image: 'assets/images/categories/category-8.jpg',
    items: 106
  }
];

const blogCategoriesDef: CategoryDef[] = [
  {
    name: 'Latest News',
    slug: 'latest-news'
  },
  {
    name: 'Special Offers',
    slug: 'special-offers',
    children: [
      {
        name: 'Spring Sales',
        slug: 'spring-sales'
      },
      {
        name: 'Summer Sales',
        slug: 'summer-sales'
      },
      {
        name: 'Autumn Sales',
        slug: 'autumn-sales'
      },
      {
        name: 'Christmas Sales',
        slug: 'christmas-sales'
      },
      {
        name: 'Other Sales',
        slug: 'other-sales'
      }
    ]
  },
  {
    name: 'New Arrivals',
    slug: 'new-arrivals'
  },
  {
    name: 'Reviews',
    slug: 'reviews'
  },
  {
    name: 'Wheels & Tires',
    slug: 'wheels-tires'
  },
  {
    name: 'Engine & Drivetrain',
    slug: 'engine-drivetrain'
  },
  {
    name: 'Transmission',
    slug: 'transmission'
  },
  {
    name: 'Performance',
    slug: 'performance'
  }
];

export const shopCategoriesTree: ShopCategory[] = makeCategories(
  makeShopCategory,
  shopCategoriesDef
);

export const shopCategoriesList: ShopCategory[] = flatTree(shopCategoriesTree);
