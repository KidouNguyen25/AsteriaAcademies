export type PuzzleTemplateId = 
  | 'fraction_reservoir_compare'
  | 'fraction_equivalent_valves'
  | 'number_multiples_lamps'
  | 'number_common_factor_gate'
  | 'number_divisibility_observation_path';

export interface PuzzleTemplate {
  id: PuzzleTemplateId;
  mechanic: string;
  description: string;
}

export interface FractionReservoirCompareTemplate extends PuzzleTemplate {
  id: 'fraction_reservoir_compare';
  // Specific fraction reservoir properties can go here
}

export interface FractionEquivalentValvesTemplate extends PuzzleTemplate {
  id: 'fraction_equivalent_valves';
  // Specific fraction valves properties can go here
}

export interface NumberMultiplesLampsTemplate extends PuzzleTemplate {
  id: 'number_multiples_lamps';
  // Specific number lamps properties can go here
}

export interface NumberCommonFactorGateTemplate extends PuzzleTemplate {
  id: 'number_common_factor_gate';
  // Specific stone gate lock properties can go here
}

export interface NumberDivisibilityObservationPathTemplate extends PuzzleTemplate {
  id: 'number_divisibility_observation_path';
  // Specific observation tower path properties can go here
}
