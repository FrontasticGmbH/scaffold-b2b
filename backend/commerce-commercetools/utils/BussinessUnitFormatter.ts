export function businessUnitKeyFormatter(businessUnitName: string): string {
  const normalizedBusinessUnitName = businessUnitNameNormalizer(businessUnitName);
  return `business_unit_${normalizedBusinessUnitName}`;
}

export function businessUnitNameNormalizer(businessUnitName: string): string {
  return businessUnitName.toLowerCase().replace(/ /g, '_');
}
