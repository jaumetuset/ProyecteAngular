import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { Observable, Subject, from, tap } from 'rxjs';
import { IUser } from '../interfaces/user';
import { environment } from '../../environments/environment.development';
import { FormGroup } from '@angular/forms';

const emptyUser: IUser = {
  id: '0',
  avatar_url: 'assets/logo.svg',
  full_name: 'none',
  username: 'none',
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  supaClient: any = null;

  constructor() {
    this.supaClient = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_KEY
    );
  }

  userSubject: Subject<IUser> = new Subject();
  favoritesSubject: Subject<{ id: number; uid: string; artwork_id: string }[]> =
    new Subject();

  async login(email: string, password: string): Promise<boolean> {
    const { data, error } = await this.supaClient.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      console.log(error);
      return false;
    }
    if (data) {
      this.setUserId(data.session.user.id);
      console.log(data.session.user.id);
      this.getProfile(data.session.user.id);
      
      return true;
    }
    return false;
  }

  getProfile(userId: string): void {
    let profilePromise: Promise<{ data: IUser[] }> = this.supaClient
      .from('profiles')
      .select('*')
      // Filters
      .eq('id', userId);

    from(profilePromise)
      .pipe(tap((data) => console.log(data)))
      .subscribe(async (profile: { data: IUser[] }) => {
        this.userSubject.next(profile.data[0]);
        if (profile.data[0].avatar_url !== null) {
          const avatarFile = profile.data[0].avatar_url.split('/').at(-1);
          const { data, error } = await this.supaClient.storage
            .from('avatars')
            .download(avatarFile);
          const url = URL.createObjectURL(data);
          profile.data[0].avatar_url = url;
        }

        this.userSubject.next(profile.data[0]);
      });
  }
  async setProfile(formulario: FormGroup) {
    const formData = formulario.value;
      const { data: updatedData, error: updateError } = await this.supaClient
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          website: formData.website,
        })
        .eq('id', this.getUserId());
    }
  

  async isLogged() {
    let { data, error } = await this.supaClient.auth.getSession();
    if (data.session) {
      this.getProfile(data.session.user.id);
      return true;
    }
    if (error) {
      return false;
    }
    return false;
  }

  async logout() {
    const { error } = await this.supaClient.auth.signOut();
    this.userSubject.next(emptyUser);
  }

  getFavorites(uid: string): void {
    let promiseFavorites: Promise<{
      data: { id: number; uid: string; artwork_id: string }[];
    }> = this.supaClient.from('favorites').select('*').eq('uid', uid);

    promiseFavorites.then((data) => this.favoritesSubject.next(data.data));
  }

  async setFavorite(artwork_id: string): Promise<any> {
    console.log('setfavorite', artwork_id);

    let { data, error } = await this.supaClient.auth.getSession();
    let promiseFavorites: Promise<boolean> = this.supaClient
      .from('favorites')
      .insert({ uid: data.session.user.id, artwork_id });

    promiseFavorites.then(() => this.getFavorites(data.session.user.id));
  }
  async removeFavorite(artwork_id: string): Promise<any> {
    let { data, error } = await this.supaClient.auth.getSession();
    let promiseFavorites: Promise<boolean> = this.supaClient.from('favorites').delete().eq('uid', data.session.user.id).eq('artwork_id', artwork_id);
    promiseFavorites.then(() => this.getFavorites(data.session.user.id));
    
  }
  async getFavoritesId(): Promise<any> {
    let { data, error } = await this.supaClient.auth.getSession();
    let promiseFavorites: Promise<any> = this.supaClient.from('favorites').select('artwork_id').eq('uid', data.session.user.id);
    return promiseFavorites.then((data) => data.data.map((artwork:any) => artwork.artwork_id));
  }
  setUserId(id: string) {
    localStorage.setItem('userId', id);
  }
  getUserId() {
    return localStorage.getItem('userId');
  }
  removeUserId() {
    localStorage.removeItem('userId');
  }

  async signUp(email: string, password: string): Promise<any> {
    try {
      const { data, error } = await this.supaClient.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        console.log(error);
        return false;
      }
      console.log(data)
  
      if (data) {
        console.log(data.user.aud);
        if (data.user.aud === 'authenticated') {
          return 'authenticated';
        }
        return true;
      }
  
      return false;
    } catch (error) {
      console.error("Error during signUp:", error);
      return false;
    }
  }
}

/*
npm install @supabase/supabase-js

*/
