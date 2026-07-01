import type { EstimationInputs, CostBreakdown } from '../types';

function getBaseRates(projectType: EstimationInputs['projectType']) {
  switch (projectType) {
    case 'residential':
      return { materialPerSqFt: 35, laborHoursPerSqFt: 0.55, equipmentPerSqFt: 4, permitsFees: 1800 };
    case 'mep':
      return { materialPerSqFt: 28, laborHoursPerSqFt: 0.65, equipmentPerSqFt: 12, permitsFees: 2800 };
    case 'permits':
      return { materialPerSqFt: 2, laborHoursPerSqFt: 0.15, equipmentPerSqFt: 1, permitsFees: 4500 };
    case 'industrial':
      return { materialPerSqFt: 65, laborHoursPerSqFt: 0.38, equipmentPerSqFt: 18, permitsFees: 8000 };
    case 'commercial':
    default:
      return { materialPerSqFt: 48, laborHoursPerSqFt: 0.42, equipmentPerSqFt: 9, permitsFees: 5000 };
  }
}

function getComplexityFactor(complexity: EstimationInputs['complexity']): number {
  return complexity === 'simple' ? 0.85 : complexity === 'high' ? 1.35 : 1.0;
}

function getSpeedFactor(speed: EstimationInputs['turnaroundSpeed']): number {
  return speed === 'expedited' ? 1.20 : 1.0;
}

function getZipFactor(zipCode: string): number {
  return (zipCode.startsWith('9') || zipCode.startsWith('1')) ? 1.18
    : (zipCode.startsWith('3') || zipCode.startsWith('7')) ? 0.94 : 1.0;
}

export function calculateCost(inputs: EstimationInputs): CostBreakdown {
  const { materialPerSqFt, laborHoursPerSqFt, equipmentPerSqFt, permitsFees } = getBaseRates(inputs.projectType);
  const complexityFactor = getComplexityFactor(inputs.complexity);
  const speedFactor = getSpeedFactor(inputs.turnaroundSpeed);
  const zipFactor = getZipFactor(inputs.zipCode);

  const totalArea = inputs.areaSqFt;

  const rawMaterials = totalArea * materialPerSqFt * complexityFactor * zipFactor;
  const laborHours = totalArea * laborHoursPerSqFt * complexityFactor;
  const rawLabor = laborHours * 42 * zipFactor * speedFactor;
  const rawEquipment = totalArea * equipmentPerSqFt * complexityFactor * zipFactor;
  const rawPermits = permitsFees * complexityFactor * speedFactor;
  const total = rawMaterials + rawLabor + rawEquipment + rawPermits;

  return {
    materials: Math.round(rawMaterials),
    labor: Math.round(rawLabor),
    equipment: Math.round(rawEquipment),
    permits: Math.round(rawPermits),
    total: Math.round(total),
    lowRange: Math.round(total * 0.92),
    highRange: Math.round(total * 1.08),
  };
}
