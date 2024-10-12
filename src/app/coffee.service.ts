import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface CoffeeMachineSales {
  MonthName: string;
  StandardSales: number;
  PremiumSales: number;
}


@Injectable({
  providedIn: 'root'
})
export class CoffeeService {

  apiUrl = 'https://localhost:44332/api/CoffeeMachine/GetAllData';

  constructor(private http: HttpClient) {}

  //Whole Data being Fetched
  getAllData(){
    return this.http.get<any[]>(this.apiUrl);
  }
 
}
