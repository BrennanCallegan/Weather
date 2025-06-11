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
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  private readonly WEATHER_CODES: {
    [key: number]: {
      name: string;
      icons: {day: string; night: string};
    };
  } = {
    0: {
      name: "Clear sky",
      icons: {
        day: "clear_day.svg",
        night: "clear_night.svg"
      }
    },
    1: {
      name: "Mainly clear",
      icons: {
        day: "mainly_clear_day.svg",
        night: "mainly_clear_night.svg"
      }
    },
    2: {
      name: "Partly cloudy",
      icons: {
        day: "partly_cloudy_day.svg",
        night: "partly_cloudy_night.svg"
      }
    },
    3: {
      name: "Overcast",
      icons: {
        day: "overcast.svg",
        night: "overcast.svg"
      }
    },
    45: {
      name: "Fog",
      icons: {
        day: "fog.svg",
        night: "fog.svg"
      }
    },
    48: {
      name: "Depositing rime fog",
      icons: {
        day: "fog.svg",
        night: "fog.svg"
      }
    },
    51: {
      name: "Light drizzle",
      icons: {
        day: "drizzle_light_day.svg",
        night: "drizzle_light_night.svg"
      }
    },
    53: {
      name: "Moderate drizzle",
      icons: {
        day: "drizzle.svg",
        night: "drizzle.svg"
      }
    },
    55: {
      name: "Heavy drizzle",
      icons: {
        day: "drizzle.svg",
        night: "drizzle.svg"
      }
    },
    56: {
      name: "Light freezing drizzle",
      icons: {
        day: "freezing_drizzle.svg",
        night: "freezing_drizzle.svg"
      }
    },
    57: {
      name: "Heavy freezing drizzle",
      icons: {
        day: "freezing_drizzle.svg",
        night: "freezing_drizzle.svg"
      }
    },
    61: {
      name: "Light rain",
      icons: {
        day: "rain_light_day.svg",
        night: "rain_light_night.svg"
      }
    },
    63: {
      name: "Moderate rain",
      icons: {
        day: "rain.svg",
        night: "rain.svg"
      }
    },
    65: {
      name: "Heavy rain",
      icons: {
        day: "rain_dense.svg",
        night: "rain_dense.svg"
      }
    },
    66: {
      name: "Light Freezing Rain",
      icons: {
        day: "freezing_rain.svg",
        night: "freezing_rain.svg"
      }
    },
    67: {
      name: "Heavy Freezing Rain",
      icons: {
        day: "freezing_rain.svg",
        night: "freezing_rain.svg"
      }
    },
    71: {
      name: "Slight Snowfall",
      icons: {
        day: "snow.svg",
        night: "snow.svg"
      }
    },
    73: {
      name: "Moderate Snowfall",
      icons: {
        day: "snow.svg",
        night: "snow.svg"
      }
    },
    75: {
      name: "Heavy Snowfall",
      icons: {
        day: "snow.svg",
        night: "snow.svg"
      }
    },
    77: {
      name: "Snow Grains",
      icons: {
        day: "snow.svg",
        night: "snow.svg"
      }
    },
    80: {
      name: "Slight Rain Showers",
      icons: {
        day: "rain_light_day.svg",
        night: "rain_light_night.svg"
      }
    },
    81: {
      name: "Rain Showers",
      icons: {
        day: "rain.svg",
        night: "rain.svg"
      }
    },
    82: {
      name: "Heavy Rain Showers",
      icons: {
        day: "rain_dense.svg",
        night: "rain_dense.svg"
      }
    },
    85: {
      name: "Light Snow Showers",
      icons: {
        day: "snow.svg",
        night: "snow.svg"
      }
    },
    86: {
      name: "Heavy Snow Showers",
      icons: {
        day: "snow.svg",
        night: "snow.svg"
      }
    },
    95: {
      name: "Thunderstorm",
      icons: {
        day: "thunderstorm_moderate.svg",
        night: "thunderstorm_moderate.svg"
      }
    },
    96: {
      name: "Thunderstorm with Slight Hail",
      icons: {
        day: "thunderstorm_moderate.svg",
        night: "thunderstorm_moderate.svg"
      }
    },
    99: {
      name: "Thunderstorm with Heavy Hail",
      icons: {
        day: "thunderstorm_moderate.svg",
        night: "thunderstorm_moderate.svg"
      }
    }
  };

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

  private ICON_BASE_PATH = 'assets/icons/';

  private getWeatherIconSrc(code: number, is_day: number): string {
    const weatherInfo = this.WEATHER_CODES[code];
    if(weatherInfo){
      const iconFileName = is_day === 1 ? weatherInfo.icons.day : weatherInfo.icons.night;
      return `${this.ICON_BASE_PATH}${iconFileName}`;
    }

    console.warn(`Weather code ${code} not found for icon lookup`);
    return `${this.ICON_BASE_PATH}default.svg`;
  }

  private getWeatherConditionName(code: number, is_day: number): string {
    const weatherInfo = this.WEATHER_CODES[code];
    if(weatherInfo){
      return weatherInfo.name;
    }

    console.warn(`Weather code ${code} not found.`);
    return "Unknown condition"
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

      this.dailyForecasts = this.processDailyForecasts(daily_weather_codes, temperature_2m_max, temperature_2m_min, time);
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
}
