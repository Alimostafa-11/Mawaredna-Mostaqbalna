import { BadRequestException, Injectable } from '@nestjs/common';
import { CROP_RATES, GOVERNORATES, SOIL_TYPES } from './calculator.constants';
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
  };
  disclaimerAr: string;
  disclaimerEn: string;
}

@Injectable()
export class CalculatorService {
  options() {
    return {
      crops: CROP_RATES.map(({ key, labelAr, labelEn }) => ({ key, labelAr, labelEn })),
      soils: SOIL_TYPES,
      governorates: GOVERNORATES,
    };
  }

  estimate(dto: EstimateDto): EstimateResult {
    const crop = CROP_RATES.find((c) => c.key === dto.cropType);
    const soil = SOIL_TYPES.find((s) => s.key === dto.soilType);

    if (!crop || !soil) {
      throw new BadRequestException('Unknown crop or soil type');
    }

    // The crop alone sets the rate. Soil is still chosen and echoed back - the
    // sales team needs it - but it no longer moves the quantity.
    //
    // Weight and volume are two independent planning ranges: volume is NOT
    // derived from the tonnage, because the company quotes cubic metres from
    // its own loading experience, which does not track the nominal bulk
    // density exactly.
    const tonsPerFeddanMin = crop.tonsPerFeddanMin;
    const tonsPerFeddanMax = crop.tonsPerFeddanMax;

    const m3PerFeddanMin = crop.cubicMetersPerFeddanMin;
    const m3PerFeddanMax = crop.cubicMetersPerFeddanMax;

    return {
      input: dto,
      tons: {
        min: round(tonsPerFeddanMin * dto.areaFeddan),
        max: round(tonsPerFeddanMax * dto.areaFeddan),
      },
      cubicMeters: {
        min: round(m3PerFeddanMin * dto.areaFeddan),
        max: round(m3PerFeddanMax * dto.areaFeddan),
      },
      perFeddan: {
        tonsMin: round(tonsPerFeddanMin),
        tonsMax: round(tonsPerFeddanMax),
        cubicMetersMin: round(m3PerFeddanMin),
        cubicMetersMax: round(m3PerFeddanMax),
      },
      basis: {
        cropLabelAr: crop.labelAr,
        cropLabelEn: crop.labelEn,
        soilLabelAr: soil.labelAr,
        soilLabelEn: soil.labelEn,
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
