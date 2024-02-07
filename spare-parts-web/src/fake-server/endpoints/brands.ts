import { GetBrandsOptions } from '../../app/api/base';
import { Observable, of } from 'rxjs';
import { Brand } from '../../app/interfaces/brand';
import { brands } from '../database/brands';

export function getBrands(options?: GetBrandsOptions): Observable<Brand[]> {
    options = options || {};

    return of(brands.slice(0, options.limit));
}
