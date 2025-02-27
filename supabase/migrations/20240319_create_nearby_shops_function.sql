-- Enable PostGIS extension if not already enabled
create extension if not exists postgis;

-- Function to find shops within a radius
create or replace function get_shops_within_radius(
  lat double precision,
  lng double precision,
  radius_meters double precision
)
returns setof shops
language plpgsql
as $$
begin
  return query
  select *
  from shops
  where ST_DWithin(
    coordinates::geometry,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_meters
  )
  order by
    ST_Distance(
      coordinates::geometry,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geometry
    );
end;
$$; 