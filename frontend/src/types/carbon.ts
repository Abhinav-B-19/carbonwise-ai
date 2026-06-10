export interface CarbonCalculationRequest {
    carKmPerWeek: number;
    publicTransportKmPerWeek: number;
    flightsPerYear: number;
    electricityKwh: number;
    acHoursPerDay: number;
    dietType: string;
    onlineDeliveriesPerMonth: number;
  }
  
  export interface CarbonCalculationResponse {
    transportationEmission: number;
    homeEmission: number;
    foodEmission: number;
    lifestyleEmission: number;
    totalEmission: number;
    carbonScore: number;
  }