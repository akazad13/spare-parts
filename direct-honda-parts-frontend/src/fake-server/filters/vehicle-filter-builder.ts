import { VehicleFilter, VehicleFilterValue } from '../../app/interfaces/filter';
import { Vehicle } from '../../app/interfaces/vehicle';
import { Product } from '../../app/interfaces/product';
import { vehicles as dbVehicles } from '../database/vehicles';
import { AbstractFilterBuilder } from './abstract-filter-builder';

export class VehicleFilterBuilder extends AbstractFilterBuilder {
    private value: VehicleFilterValue = null;
    private vehicle: Vehicle = null;

    private static testCompatibility(vehicle: Vehicle, product: Product): boolean {
        if (product.compatibility === 'all') {
            return true;
        }
        if (product.compatibility === 'unknown') {
            return false;
        }

        return product.compatibility.includes(vehicle.id);
    }

    test(product: Product): boolean {
        if (this.value) {
            return VehicleFilterBuilder.testCompatibility(this.vehicle, product);
        }

        return true;
    }

    makeItems(products: Product[], value: string): void {
        const vehicleIds = products.reduce((acc, product) => {
            if (typeof product.compatibility !== 'string') {
                return product.compatibility.reduce((acc2, vehicleId) => {
                    return acc2.includes(vehicleId) ? acc2 : [...acc2, vehicleId];
                }, acc);
            }

            return acc;
        }, []);

        this.vehicle = dbVehicles.find(x => x.id === parseFloat(value)) || null;
        this.value = this.vehicle ? this.vehicle.id : null;
    }

    calc(filters: AbstractFilterBuilder[]): void {
    }

    build(): VehicleFilter {
        return {
            type: 'vehicle',
            slug: this.slug,
            name: this.name,
            value: this.value,
            vehicle: this.vehicle,
        };
    }
}
