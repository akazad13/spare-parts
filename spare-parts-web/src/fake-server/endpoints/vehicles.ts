import { Observable, of, throwError, timer } from 'rxjs';
import { userVehicles, vehicles } from '../database/vehicles';
import { Vehicle } from '../../app/interfaces/vehicle';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { clone, delayResponse } from '../utils';

export function getYears(): Observable<number[]> {
  const result: number[] = [];

  vehicles.forEach((vehicle) => {
    if (result.indexOf(vehicle.year) === -1) {
      result.push(vehicle.year);
    }
  });

  return timer(750).pipe(map(() => result.sort()));
}

export function getMakes(year: number): Observable<string[]> {
  const result: string[] = [];

  vehicles
    .filter((x) => x.year === year)
    .forEach((vehicle) => {
      if (result.indexOf(vehicle.make) === -1) {
        result.push(vehicle.make);
      }
    });

  return timer(750).pipe(map(() => result.sort()));
}

export function getVehicles(
  year: number,
  make: string,
  model: string
): Observable<Vehicle[]> {
  const result = vehicles.filter(
    (x) => x.year === year && x.make === make && x.model === model
  );

  return timer(750).pipe(map(() => result.sort()));
}

export function getVehicleByVin(vin: string): Observable<Vehicle> {
  vin = vin.trim();

  const vehicle = vehicles.find((x) => x.model === 'Focus S');

  if (vin === '' || vin === 'error' || !vehicle) {
    return throwError(
      new HttpErrorResponse({ status: 404, statusText: 'Page Not Found' })
    );
  }

  return of(vehicle);
}

export function getUserVehicles(): Observable<Vehicle[]> {
  return of(clone(userVehicles));
}

export function addUserVehicles(vehicleId: number): Observable<void> {
  const index = userVehicles.findIndex((x) => x.id === vehicleId);
  const vehicle = vehicles.find((x) => x.id === vehicleId);

  if (vehicle && index === -1) {
    userVehicles.push(vehicle);
  }

  return delayResponse(of(null));
}

export function removeUserVehicles(vehicleId: number): Observable<void> {
  const index = userVehicles.findIndex((x) => x.id === vehicleId);

  if (index !== -1) {
    userVehicles.splice(index, 1);
  }

  return delayResponse(of(null));
}
