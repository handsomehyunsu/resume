import { fromEventPattern, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment.prod';
// import { environment } from "../../environments/environment";
import { AuthData } from '../models/auth-data.model';

const postUrl = environment.localUrl + "/user"


@Injectable({ providedIn: "root" })
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router){}

    getToken(){
        return this.token;
    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    getUserId(){
        return this.userId;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    createUser(userName: string, password: string){
        const authData: AuthData = {userName: userName, password: password};
        this.http.post(postUrl + "/signup", authData)
            .subscribe(() => {
                this.router.navigate(["/"]);
            }, error => {
                console.log("auth.service.creatorUser() error");
                this.authStatusListener.next(false);
            });
    }

    login(userName: string, password: string){
        const authData: AuthData = {userName: userName, password: password};
        this.http.post<{token: string, expiresIn: number, userId: string}>(
            postUrl + "/login",
            authData)
        .subscribe(response => {
            const token = response.token;
            this.token = token;
            if(token){
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.userId = response.userId;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                this.saveAuthData(token, expirationDate, this.userId);
                this.router.navigate(['/']);
            }
        }, error => {
            this.authStatusListener.next(false);
        })
    }

    //
    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationData.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000)
            this.authStatusListener.next(true);
        }
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = null;
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number){
        this.tokenTimer = setTimeout(() => {
            this.logout();
          }, duration * 1000);
    }

    private saveAuthData(token: string, expirationData: Date, userId: string){
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationData.toISOString());
        localStorage.setItem("userId", userId);
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
    }


    private getAuthData(){
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        if(!token || !expirationDate){
            return;
        }
        return{
            token: token,
            expirationData: new Date(expirationDate),
            userId: userId
        }
    }
}