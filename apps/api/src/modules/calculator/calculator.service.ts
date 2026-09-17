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
  perFeddan: { tonsMin: number; tonsMax: number };
  /** Rough number of 50 kg bags, for small farms that order bagged product. */
  bags50kg: { min: number; max: number };
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

    return {
      input: dto,
      tons: { min: round(tonsMin), max: round(tonsMax) },
      cubicMeters: { min: round(m3Min), max: round(m3Max) },
      perFeddan: { tonsMin: round(perFeddanMin), tonsMax: round(perFeddanMax) },
      // Derived from the rounded tonnage: multiplying the raw float would let
      // binary drift push an exact 390 t up to 7801 bags instead of 7800.
      bags50kg: {
        min: Math.ceil((round(tonsMin) * 1000) / 50),
        max: Math.ceil((round(tonsMax) * 1000) / 50),
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
