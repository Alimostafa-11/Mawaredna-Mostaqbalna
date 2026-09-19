import { BadRequestException, Injectable } from '@nestjs/common';
import {
  BULK_DENSITY_KG_PER_M3,
  CROP_RATES,
  GOVERNORATES,
  SOIL_FACTORS,
} from './calculator.constants';
import { EstimateDto } from './dto/estimate.dto';

export interface EstimateResult {
  input: EstimateDto;
  tons: { min: number; max: number };
  cubicMeters: { min: number; max: number };
  /** Application rate for one feddan, by weight and by volume. */
  perFeddan: {
    tonsMin: number;
    tonsMax: number;
    cubicMetersMin: number;
    cubicMetersMax: number;
  };
  basis: {
    cropLabelAr: string;
    cropLabelEn: string;
    soilLabelAr: string;
    soilLabelEn: string;
    soilFactor: number;
    bulkDensityKgPerM3: typeof BULK_DENSITY_KG_PER_M3;
  };
  disclaimerAr: string;
  disclaimerEn: string;
}

@Injectable()
export class CalculatorService {
  options() {
    return {
      crops: CROP_RATES.map(({ key, labelAr, labelEn }) => ({ key, labelAr, labelEn })),
      soils: SOIL_FACTORS.map(({ key, labelAr, labelEn }) => ({ key, labelAr, labelEn })),
      governorates: GOVERNORATES,
    };
  }

  estimate(dto: EstimateDto): EstimateResult {
    const crop = CROP_RATES.find((c) => c.key === dto.cropType);
    const soil = SOIL_FACTORS.find((s) => s.key === dto.soilType);

    if (!crop || !soil) {
      throw new BadRequestException('Unknown crop or soil type');
    }

    const perFeddanMin = crop.tonsPerFeddanMin * soil.factor;
    const perFeddanMax = crop.tonsPerFeddanMax * soil.factor;

    const tonsMin = perFeddanMin * dto.areaFeddan;
    const tonsMax = perFeddanMax * dto.areaFeddan;

    // Denser compost occupies less volume, so the max density gives the
    // min cubic metres and vice versa.
    const m3Min = (tonsMin * 1000) / BULK_DENSITY_KG_PER_M3.max;
    const m3Max = (tonsMax * 1000) / BULK_DENSITY_KG_PER_M3.min;

    // The rate a farmer actually orders by, in volume - same density
    // inversion as the total above.
    const m3PerFeddanMin = (perFeddanMin * 1000) / BULK_DENSITY_KG_PER_M3.max;
    const m3PerFeddanMax = (perFeddanMax * 1000) / BULK_DENSITY_KG_PER_M3.min;

    return {
      input: dto,
      tons: { min: round(tonsMin), max: round(tonsMax) },
      cubicMeters: { min: round(m3Min), max: round(m3Max) },
      perFeddan: {
        tonsMin: round(perFeddanMin),
        tonsMax: round(perFeddanMax),
        cubicMetersMin: round(m3PerFeddanMin),
        cubicMetersMax: round(m3PerFeddanMax),
      },
      basis: {
        cropLabelAr: crop.labelAr,
        cropLabelEn: crop.labelEn,
        soilLabelAr: soil.labelAr,
        soilLabelEn: soil.labelEn,
        soilFactor: soil.factor,
        bulkDensityKgPerM3: BULK_DENSITY_KG_PER_M3,
      },
      disclaimerAr:
        'هذا تقدير مبدئي لأغراض التخطيط فقط ولا يغني عن تحليل التربة وزيارة الموقع. تُحدد الكمية النهائية بعد دراسة حالة الأرض والمحصول من قِبل فريق الشركة.',
      disclaimerEn:
        'A preliminary planning estimate only. It does not replace a soil analysis or a site visit; the final quantity is set after our team reviews the land and the crop.',
    };
  }
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
