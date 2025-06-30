// src/vehicles/entities/vehicle.entity.ts
export class Vehicle {
  id: string;
  model: string;
  brand: string;
  category: string; // e.g., SUV, Sedan, etc.
  pricePerDay: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'electric';
  airConditioning: boolean;
  available: boolean;
  imageUrl: string;
  createdAt: Date;
}
