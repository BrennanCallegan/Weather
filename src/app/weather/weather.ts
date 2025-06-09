import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommaExpr } from '@angular/compiler';

@Component({
  selector: 'app-weather',
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css'
})
export class Weather implements OnInit{

  //Uses @ViewChild to get references to DOM elements
  @ViewChild('searchForm') searchBox!: ElementRef<HTMLFormElement>;
  @ViewChild('weatherDetails') weatherDetails!: ElementRef<HTMLDivElement>;
  @ViewChild('weatherConditionIcon') weatherConIcon!: ElementRef<HTMLImageElement>;
  @ViewChild('dailyForecastContainer') dailyForecastElems!: ElementRef<HTMLDivElement>;

  //Component properties to hold data that will be displayed in template
  locationInputValue: string = '';
  locationText: string = '';
  weatherConIconSrc: string = '';
  weatherConName: string = '';
  tempText: number | null = null;
  humidityText: number | null = null;
  windSpeedText: number | null = null;

  dailyForecasts: any[] = []; //need to populate

  ngOnInit(): void {
    throw new Error('Method not implemented.'); //need to populate
  }

  async getLocation(location: string) {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`);
    const data = await res.json();
    const results = data.results && data.results.length > 0 ? data.results[0]: null;

    if(!results){
      console.warn("Location not found:", location);
      return {name: "Unknown", lat:0, lon:0};
    }

    return {
      name: results.name || "",
      lat: results.latitude,
      lon: results.longitude

    }
  }

  async getWeather(location: string){
    try{
      const {name, lat, lon} = await this.getLocation(location);

      if(lat === 0 && lon === 0 && name === "Unknown"){return null}
      
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min`);
      const data = await res.json();
      return{
        name,
        current: data.current,
        daily: data.daily
      }
    }catch (error){
      console.error("Error fetching weather data:", error)
      return null;
    }
  }

  //Called when the form is submitted
  async onSubmit(){
    this.weatherDetails.nativeElement.classList.remove("active");
    this.dailyForecastElems.nativeElement.innerHTML = "";

    const weather = await this.getWeather(this.locationInputValue);

    if(weather){ //Checks if weather was successfully retreived
      const {temperature_2m, relative_humidity_2m, is_day, weather_code, wind_speed_10m} = weather.current;
      const {weather_code: daily_weather_codes, temperature_2m_max, temperature_2m_min, time} = weather.daily;

      this.locationText = weather.name;
      this.tempText = temperature_2m;
      this.humidityText = relative_humidity_2m;
      this.windSpeedText = wind_speed_10m;
      this.weatherConName = this.getWeatherConditionName(weather_code, is_day);
      this.weatherConIconSrc = this.getWeatherConditionName(weather_code, is_day);

      this.dailyForecasts = this.processDailyForecast(daily_weather_codes, temperature_2m_max, temperature_2m_min, time);
    }
    else{
      this.locationText = "Locaiton not Found";
      this.tempText = null;
      this.humidityText = null;
      this.windSpeedText = null;
      this.weatherConName = "";
      this.weatherConIconSrc = "";
      this.dailyForecasts = [];
    }
  }

  private processDailyForecasts(codes: number[], maxTemps: number[], minTemps: number[], times: string[]): any[]{
    const forecasts = [];
    for(let i = 0; i < times.length; i++){
      forecasts.push({
        time: times[i],
        maxTemp: maxTemps[i],
        minTemp: minTemps[i],
        weatherCode: codes[i],
        conditionName: this.getWeatherConditionName(codes[1], 1),
        iconSrc: this.getWeatherIconSrc(codes[i], 1)
      });
    }
    return forecasts;
  }
}
