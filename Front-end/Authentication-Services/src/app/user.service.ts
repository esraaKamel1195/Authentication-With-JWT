import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })


export class UserService {
    url = environment.backendURL + 'user';

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    addUser(user:any) {
        this.http.post<any>(this.url + '/register', user).subscribe((res)=>{
            console.log(res);
            alert(res.status);
            localStorage.setItem("token", res.user.token);
            this.router.navigate(['/home']);
        });
    }

    login(user:any) {
        console.log(user);

        this.http.post<any>(this.url + '/login', user).subscribe((res)=>{
            console.log(res);
            if(res.status == 200) {
                alert(res.status);
                localStorage.setItem("token", res.user.token);
                this.router.navigate(['/home']);
            } else {
                alert(res.error);
            }        
        });
    }

    logout(token: any) {
        console.log(token);
        this.http.post<any>(this.url + '/logout', {token}).subscribe((res)=>{
            console.log(res);
            if( res.statusCode == 200) {
                alert(res);
                localStorage.removeItem("token");
                this.router.navigate(['/login']);
            }
            else {
                alert("you are not login");
            }
        });
    }        

}