# Weather

Weather is a Summer of Coding entry made to grow a diverse skillset for UI design and development and build upon a pre-existing knowledge of REST APIs. This project was created using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0, and Open-Meteo's [geocoding](https://open-meteo.com/en/docs/geocoding-api) and [weather forecast](https://open-meteo.com/en/docs) API.

## Features
- Current weather with actual and apparent temperature, rain chance, humidity, and wind speed
- 7-day forecast

## Screenshot
![image](https://github.com/user-attachments/assets/674ff168-448a-47e7-a7c2-a7b3c144f26f)


## Checking the Weather

- To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

- To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

- To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Future Features
- Fahrenhiet/Celsius toggle
- Hourly forecast
- Additional information about current weather (dew point, visibility, etc.)
- Dynamic backgrounds

## Additional Resources
[Icon Pack](https://www.figma.com/design/ZqqpWZIhLrWpBZ7ZAlubvD/Weather--Icons-Kit--Community-?node-id=0-1&p=f) by Leya Cherkasova on Figma
