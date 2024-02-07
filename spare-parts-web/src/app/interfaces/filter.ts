import { ShopCategory } from './category';
import { Vehicle } from './vehicle';


export interface BaseFilter<T extends string, V> {
    type: T;
    name: string;
    slug: string;
    value: V;
}
export interface BaseFilterItem {
    slug: string;
    name: string;
    count: number;
}


export interface ColorFilterItem extends BaseFilterItem {
    color: string;
}
export interface RatingFilterItem {
    rating: number;
    count: number;
}


export type CategoryFilterValue = string | null;
export type VehicleFilterValue = number | null;
export type RangeFilterValue = [number, number];
export type CheckFilterValue = string[];
export type RadioFilterValue = string | null;
export type RatingFilterValue = number[];
export type ColorFilterValue = string[];


export type CategoryFilter = BaseFilter<'category', CategoryFilterValue> & {items: ShopCategory[]};
export type VehicleFilter = BaseFilter<'vehicle', VehicleFilterValue> & {vehicle: Vehicle};
export type RangeFilter = BaseFilter<'range', RangeFilterValue> & {min: number; max: number};
export type CheckFilter = BaseFilter<'check', CheckFilterValue> & {items: BaseFilterItem[]};
export type RadioFilter = BaseFilter<'radio', RadioFilterValue> & {items: BaseFilterItem[]};
export type RatingFilter = BaseFilter<'rating', RatingFilterValue> & {items: RatingFilterItem[]};
export type ColorFilter = BaseFilter<'color', ColorFilterValue> & {items: ColorFilterItem[]};


export type Filter =
    CategoryFilter |
    VehicleFilter |
    RangeFilter |
    CheckFilter |
    RadioFilter |
    RatingFilter |
    ColorFilter;


export interface ActiveFilterBase<T extends Filter> {
    id: string;
    type: T['type'];
    original: T;
}

export type ActiveFilterVehicle = ActiveFilterBase<VehicleFilter> & {original: VehicleFilter};
export type ActiveFilterRange = ActiveFilterBase<RangeFilter>;
export type ActiveFilterCheck = ActiveFilterBase<CheckFilter> & {item: BaseFilterItem};
export type ActiveFilterRadio = ActiveFilterBase<RadioFilter> & {item: BaseFilterItem};
export type ActiveFilterRating = ActiveFilterBase<RatingFilter> & {item: RatingFilterItem};
export type ActiveFilterColor = ActiveFilterBase<ColorFilter> & {item: ColorFilterItem};

export type ActiveFilter =
    ActiveFilterVehicle |
    ActiveFilterRange |
    ActiveFilterCheck |
    ActiveFilterRadio |
    ActiveFilterRating |
    ActiveFilterColor;
