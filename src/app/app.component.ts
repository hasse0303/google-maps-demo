
import { Component, OnInit } from '@angular/core';
import { MapDirectionsService } from '@angular/google-maps';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'google-map-demo';
  form!: FormGroup
  center = {lat: 11, lng: 104};
  zoom = 9;
  destinationLatLng = {};
  originLatLng = {};
  distance!: string | undefined;
  duration!: string | undefined;
  origin!: string;
  destination!: string;
  markerOptions: google.maps.MarkerOptions = {draggable: true};
  markerPositions: google.maps.LatLngLiteral[] = [];

  directionResult$: any;
  coordinates: any[] = [];

  constructor(private mapDirectionService: MapDirectionsService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.inItForm();
    this.getCurrentLocation();
  }

  inItForm() {
    this.form = this.fb.group({
      from: [],
      to: []
    })
  }

  getCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        position => {
          this.coordinates.push({lat: position.coords.latitude, lng: position.coords.longitude})
          window.localStorage.setItem('coordinates', JSON.stringify(this.coordinates));
          this.markerPositions.push({lat: position.coords.latitude, lng: position.coords.longitude})
          // this.center = latlng;
          // this.zoom = 15;
        },
        error => console.log(error),
        {
          enableHighAccuracy: true
        }

      )
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPositions.push(event.latLng?.toJSON())
    }
  }

  destinationAddressChange(address: any) {
    this.destination = address.formatted_address;
    this.destinationLatLng = {lat: address.geometry.location.lat(), lng: address.geometry.location.lng()}
  }
  originAddressChange(address: any) {
    this.origin = address.formatted_address;
    this.originLatLng = {lat: address.geometry.location.lat(), lng: address.geometry.location.lng()}
  }

  directPlace(model?: any) {
    const request: google.maps.DirectionsRequest = {
      destination: this.destinationLatLng,
      origin: this.originLatLng,
      travelMode: model ? model : google.maps.TravelMode.DRIVING
    };
    this.mapDirectionService.route(request).subscribe(res => {
      this.distance = res.result?.routes[0].legs[0].distance?.text;
      this.duration = res.result?.routes[0].legs[0].duration?.text;
      this.directionResult$ = res.result;
    })
  }

  vaiDriving() {
    const drivingMode = google.maps.TravelMode.DRIVING;
    this.directPlace(drivingMode);
  }

  vaiWalking() {
    const walkingMode = google.maps.TravelMode.WALKING;
    this.directPlace(walkingMode);
  }
  vaiTransit() {
    const transitMode = google.maps.TravelMode.TRANSIT;
    this.directPlace(transitMode);
  }
  vaiCycling() {
    const cyclingMode = google.maps.TravelMode.BICYCLING;
    this.directPlace(cyclingMode);
  }
}
