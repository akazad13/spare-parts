import { FilterHandler } from './filter.handler';
import { FilterVehicleHandler } from './filter-vehicle/filter-vehicle.handler';

export const filterHandlers: FilterHandler[] = [new FilterVehicleHandler()];
