import { CustomFields } from './custom-fields';
import { Brand } from './brand';
import { ShopCategory } from './category';


export interface BaseAttributeGroup {
    name: string;
    slug: string;
    customFields?: CustomFields;
}

export type ProductAttributeGroup = BaseAttributeGroup & { attributes: ProductAttribute[]; };
export type ProductTypeAttributeGroup = BaseAttributeGroup & { attributes: string[]; };

export interface ProductType {
    name: string;
    slug: string;
    attributeGroups: ProductTypeAttributeGroup[];
    customFields?: CustomFields;
}

export interface ProductAttributeValue {
    name: string;
    slug: string;
    customFields?: CustomFields;
}

export interface ProductAttribute {
    name: string;
    slug: string;
    featured: boolean;
    values: ProductAttributeValue[];
    customFields?: CustomFields;
}

export interface ProductOptionValueBase {
    name: string;
    slug: string;
    customFields?: CustomFields;
}

export interface ProductOptionValueColor extends ProductOptionValueBase {
    color: string;
}

export interface ProductOptionBase {
    type: string;
    name: string;
    slug: string;
    values: ProductOptionValueBase[];
    customFields?: CustomFields;
}

export interface ProductOptionDefault extends ProductOptionBase {
    type: 'default';
}

export interface ProductOptionColor extends ProductOptionBase {
    type: 'color';
    values: ProductOptionValueColor[];
}

export type ProductOption = ProductOptionDefault | ProductOptionColor;

export type ProductStock = 'in-stock' | 'out-of-stock' | 'on-backorder';

export type ProductCompatibilityResult = 'all' | 'fit' | 'not-fit' | 'unknown';

export interface Product {
    id: number;
    name: string;
    /**
     * A short product description without HTML tags.
     */
    excerpt: string;
    description: string;
    slug: string;
    sku?: string;
    partNumber: string;
    stock: ProductStock;
    price: number;
    compareAtPrice: number|null;
    images?: string[];
    badges?: string[];
    rating?: number;
    reviews?: number;
    availability?: string;
    /**
     * 'all'     - Compatible with all vehicles.
     * 'unknown' - No compatibility information. Part may not fit the specified vehicle.
     * number[]  - An array of vehicle identifiers with which this part is compatible.
     */
    compatibility: 'all' | 'unknown' | number[];
    brand?: Brand|null;
    tags?: string[];
    type: ProductType;
    categories?: ShopCategory[];
    attributes: ProductAttribute[];
    options: ProductOption[];
    customFields?: CustomFields;
}
