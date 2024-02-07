import { Observable } from 'rxjs';
import { Vehicle, VehiclesSearchDDL } from '../../interfaces/vehicle';

export abstract class VehicleApi {
  abstract userVehicles$: Observable<Vehicle[]>;

  abstract currentVehicle$: Observable<Vehicle>;

  abstract getModels(): Observable<VehiclesSearchDDL[]>;

  abstract getYears(modelId: number): Observable<VehiclesSearchDDL[]>;

  abstract getBodyAndTrims(
    modelId: number,
    yearid: number
  ): Observable<VehiclesSearchDDL[]>;

  abstract getEmissionAndTransmission(
    modelId: number,
    yearid: number,
    doorId: number,
    gradeId: number
  ): Observable<VehiclesSearchDDL[]>;

  abstract getVehicles(
    year: number,
    make: string,
    model: string
  ): Observable<Vehicle[]>;

  abstract getVehicleByVin(vin: string): Observable<Vehicle>;

  abstract addUserVehicle(vehicleId: number): Observable<void>;

  abstract removeUserVehicle(vehicleId: number): Observable<void>;

  abstract setCurrentVehicle(vehicle: Vehicle): void;
}
