# GeoGraphix-backend

# Pre-requisites

- Install [Node.js](https://nodejs.org/en/) version 16.3.0 or highter.


# Getting started

- Clone the repository

```bash
git clone  <https://github.com/Guray00/GeoGraphix-backend.git> <GeoGraphix>
cd GeoGraphix
npm install
```

- Build and run the project

```
npm start -- npx tsc
npx tsc
```

Navigate to `http://localhost:3001`.

<!--
# TypeScript + Node 
.

## Getting TypeScript

Add Typescript to project `npm`.

```
npm install -D typescript
```

## Building the project



### Configuring TypeScript compilation
-->

## Rest api

### GET /api/city/parkings

- Returns a list of stations.
- query parameters:
	- municipality: string

### GET /api/city/parking/

- Returns information about one parking.
- query parameters:
	- scode: string

