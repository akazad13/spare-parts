import {
  GetCategoriesOptions,
  GetCategoryBySlugOptions
} from '../../app/api/base';
import { Observable, of, throwError } from 'rxjs';
import { BaseCategory, ShopCategory } from '../../app/interfaces/category';
import { shopCategoriesList, shopCategoriesTree } from '../database/categories';
import { HttpErrorResponse } from '@angular/common/http';
import { clone } from '../utils';

export function prepareCategory<T extends BaseCategory>(
  category: T,
  depth?: number
): T {
  let children;

  if (depth && depth > 0) {
    children = category.children.map((x) => prepareCategory(x, depth - 1));
  }

  return JSON.parse(
    JSON.stringify({
      ...category,
      parent: category.parent
        ? prepareCategory(category.parent)
        : category.parent === null
        ? null
        : undefined,
      children
    })
  );
}

export function getCategoryBySlug(
  slug: string,
  options?: GetCategoryBySlugOptions
): Observable<ShopCategory> {
  options = options || {};

  const category = shopCategoriesList.find((x) => x.slug === slug);

  if (!category) {
    return throwError(
      new HttpErrorResponse({ status: 404, statusText: 'Page Not Found' })
    );
  }

  return of(prepareCategory(category, options.depth));
}

export function getCategories(
  options?: GetCategoriesOptions
): Observable<ShopCategory[]> {
  let categories = shopCategoriesTree.slice(0);
  const depth = options.depth || 0;

  if (options.parent) {
    const parent = shopCategoriesList.find(
      (x) => x.slug === options.parent.slug
    );

    if (parent) {
      categories = parent.children;
    }
  } else if (options.slugs) {
    categories = shopCategoriesList.filter((x) =>
      options.slugs.includes(x.slug)
    );
  }

  categories = categories.map((x) => prepareCategory(x, depth));

  return of(clone(categories));
}
