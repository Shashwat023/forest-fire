import ee
import pandas as pd

# Initialize Earth Engine
ee.Initialize(project='sanguine-anthem-465209-d9')

def extract_point_data(latitude, longitude, year):
    point = ee.Geometry.Point([longitude, latitude])
    start_date = f'{year}-01-01'
    end_date = f'{year}-12-31'

    result = {
        'lat': latitude,
        'lon': longitude,
    }

    # Elevation
    elevation = ee.Image('USGS/SRTMGL1_003').select('elevation')
    result['elevation'] = elevation.reduceRegion(
        ee.Reducer.first(), point, 90, maxPixels=1e9
    ).getInfo().get('elevation')

    # Slope and Aspect
    terrain = ee.Algorithms.Terrain(elevation)
    result['slope'] = terrain.select('slope').reduceRegion(
        ee.Reducer.first(), point, 90, maxPixels=1e9
    ).getInfo().get('slope')

    result['aspect'] = terrain.select('aspect').reduceRegion(
        ee.Reducer.first(), point, 90, maxPixels=1e9
    ).getInfo().get('aspect')

    # Land Cover
    land_cover = ee.Image('ESA/WorldCover/v100/2020').select('Map')
    result['land_cover_type'] = land_cover.reduceRegion(
        ee.Reducer.first(), point, 10, maxPixels=1e9
    ).getInfo().get('Map')

    # NDVI
    ndvi = ee.ImageCollection('MODIS/061/MOD13Q1') \
        .filterDate(start_date, end_date).filterBounds(point) \
        .select('NDVI').mean().multiply(0.0001)
    result['ndvi'] = ndvi.reduceRegion(
        ee.Reducer.first(), point, 250, maxPixels=1e9
    ).getInfo().get('NDVI')

    # LST
    lst = ee.ImageCollection('MODIS/061/MOD11A1') \
        .filterDate(start_date, end_date).filterBounds(point) \
        .select('LST_Day_1km').mean().multiply(0.02).subtract(273.15)
    result['lst'] = lst.reduceRegion(
        ee.Reducer.first(), point, 1000, maxPixels=1e9
    ).getInfo().get('LST_Day_1km')

    # ERA5: RH + Wind
    era5 = ee.ImageCollection('ECMWF/ERA5_LAND/DAILY_AGGR') \
        .filterDate(start_date, end_date).filterBounds(point).mean()

    dew = era5.select('dewpoint_temperature_2m')
    temp = era5.select('temperature_2m')
    rh = dew.subtract(temp).multiply(17.67).divide(
        temp.subtract(243.5).add(
            dew.subtract(temp).multiply(17.67)
        )
    ).multiply(100)

    result['relative_humidity'] = rh.reduceRegion(
        ee.Reducer.first(), point, 11132, maxPixels=1e9
    ).getInfo().get('dewpoint_temperature_2m')

    wind = era5.select('u_component_of_wind_10m').pow(2).add(
        era5.select('v_component_of_wind_10m').pow(2)
    ).sqrt()

    result['wind_speed'] = wind.reduceRegion(
        ee.Reducer.first(), point, 11132, maxPixels=1e9
    ).getInfo().get('u_component_of_wind_10m')

    return result


# === RUN AND SAVE ===

    # Saves in current dir

    # print("✅ CSV saved as point_data_output.csv in current directory.")
import sys

# Take args from command line
if __name__ == "__main__":
    lat = float(sys.argv[1])
    lon = float(sys.argv[2])
    year = int(sys.argv[3])

    data = extract_point_data(lat, lon, year)

    # Print as JSON string to return to JS
    data = extract_point_data(lat, lon, year)

    df = pd.DataFrame([data])
    df.to_csv("point_data_output.csv", index=False)  
    import json
    print(json.dumps(data))
