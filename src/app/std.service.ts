import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Students } from './models/student';

@Injectable({
  providedIn: 'root'
})
export class StdService {
  
  apiAuthUrl = 'https://localhost:44332/api/auth/signin';
  apiUrl = 'https://localhost:44332/api/getAllStudents';
  deleteUrl = 'https://localhost:44332/api/delete/';
  coursesUrl = 'https://localhost:44332/api/courses';
  classesUrl = 'https://localhost:44332/api/classes';
  createUrl = 'https://localhost:44332/api/createStudent';
  getStdUrl = 'https://localhost:44332/api/getStudent';
  updateUrl= 'https://localhost:44332/api/edit'

  constructor(private http: HttpClient) {}

  signIn(userName: string, password: string){
    const body = {
      UserName: userName,
      Password: password
    };
    return this.http.post<any>(this.apiAuthUrl, body);
  }

  getStudentsAll(){
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteStudent(id: number){
    return this.http.delete(`${this.deleteUrl}${id}`);
  }
  getCourses(){
    return this.http.get<any[]>(this.coursesUrl);
  }

  getClasses(){
    return this.http.get<any[]>(this.classesUrl);
  }

  createStd(data:any){
    return this.http.post(this.createUrl,data);
  }

  getStudentById(id: number) {
    return this.http.get<Students>(`${this.getStdUrl}/${id}`);
  }


  updateStudent(id: number,data: any) {
    return this.http.put(`${this.updateUrl}/${id}`, data);
  }


}
