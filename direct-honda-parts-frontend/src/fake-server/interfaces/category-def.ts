export interface CategoryDef {
    name: string;
    slug: string;
    image?: string;
    items?: number;
    layout?: 'categories' | 'products';
    children?: CategoryDef[];
}
