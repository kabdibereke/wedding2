import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, from, of } from 'rxjs';
import { GuestType } from '../page/main-page/main-page.types';

@Injectable({
  providedIn: 'root',
})
export class GuestService {
  constructor(private _db: AngularFireDatabase) {}

  public addGuest(request: GuestType): Observable<void> {
    const promise = this._db.object(`${request.id}`).set({
      id: request.id,
      name: request.name,
      wishes: request.wishes,
      isComing: request.isComing,
    });
    return from(promise);
  }

  public addGuestList(requests: GuestType[]): Observable<void> {
    return of(
      requests.forEach((request) => {
        const promise = this._db.object(`${request.id}`).set({
          id: request.id,
          name: request.name,
          wishes: request.wishes,
          isComing: request.isComing,
        });
        return from(promise);
      })
    );
  }

  public getGuestsList(): Observable<GuestType[]> {
    return this._db.list<string>('/').valueChanges() as unknown as Observable<
      GuestType[]
    >;
  }

  public deleteGuest(id: string): Observable<void> {
    const promise = this._db.object(`${id}`).remove();
    return from(promise);
  }
}
