import { Injectable } from '@angular/core';
import { VehicleApi } from '../base';
import { BehaviorSubject, Observable } from 'rxjs';
import { Vehicle, VehiclesSearchDDL } from '../../interfaces/vehicle';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import {
  getMakes,
  getVehicleByVin,
  getVehicles,
  getYears,
  getUserVehicles,
  removeUserVehicles,
  addUserVehicles
} from '../../../fake-server/endpoints';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VehicleImplementationApi extends VehicleApi {
  private reloadUserVehicles: BehaviorSubject<void> = new BehaviorSubject<void>(
    null
  );

  private currentVehicleSubject: BehaviorSubject<Vehicle> = new BehaviorSubject<
    Vehicle
  >(null);

  userVehicles$: Observable<Vehicle[]> = this.reloadUserVehicles.pipe(
    switchMap(() => getUserVehicles()),
    shareReplay(1)
  );

  currentVehicle$: Observable<Vehicle> = this.currentVehicleSubject.pipe(
    switchMap((currentVehicle) =>
      this.userVehicles$.pipe(
        map(
          (vehicles) =>
            vehicles.find(
              (x) => currentVehicle && x.id === currentVehicle.id
            ) || null
        )
      )
    )
  );

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
    super();
  }

  getModels(): Observable<VehiclesSearchDDL[]> {
    return this.http.get<VehiclesSearchDDL[]>(this.baseUrl + 'product/models');
  }

  getYears(modelId: number): Observable<VehiclesSearchDDL[]> {
    return this.http.get<VehiclesSearchDDL[]>(
      this.baseUrl + `product/models/${modelId}/years`
    );
  }

  getBodyAndTrims(
    modelId: number,
    yearid: number
  ): Observable<VehiclesSearchDDL[]> {
    return this.http.get<VehiclesSearchDDL[]>(
      this.baseUrl + `product/models/${modelId}/years/${yearid}/bodyAndTrims`
    );
  }

  getEmissionAndTransmission(
    modelId: number,
    yearid: number,
    doorId: number,
    gradeId: number
  ): Observable<VehiclesSearchDDL[]> {
    return this.http.get<VehiclesSearchDDL[]>(
      this.baseUrl +
        `product/models/${modelId}/years/${yearid}/door/${doorId}/grade/${gradeId}/emissionAndTransmission`
    );
  }

  getVehicles(
    year: number,
    make: string,
    model: string
  ): Observable<Vehicle[]> {
    return getVehicles(year, make, model);
  }

  getVehicleByVin(vin: string): Observable<Vehicle> {
    return getVehicleByVin(vin);
  }

  addUserVehicle(vehicleId: number): Observable<void> {
    return addUserVehicles(vehicleId).pipe(
      tap(() => this.reloadUserVehicles.next())
    );
  }

  removeUserVehicle(vehicleId: number): Observable<void> {
    return removeUserVehicles(vehicleId).pipe(
      tap(() => this.reloadUserVehicles.next())
    );
  }

  setCurrentVehicle(vehicle: Vehicle): void {
    this.currentVehicleSubject.next(vehicle);
  }
}
