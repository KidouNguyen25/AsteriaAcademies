# Puzzle Design Rules

## Tier 1: Recognize fraction
- **Mechanic**: A reservoir is divided into equal parts. Some parts glow. The player must identify the glowing fraction and input it, or select a valve matching the fraction.
- **Node**: `g6_fraction_recognize`

## Tier 2: Equivalent fraction
- **Mechanic**: Two reservoirs look different but store equivalent energy. Player must choose the valve connected to the equivalent fraction.
- **Node**: `g6_fraction_equivalent`

## Tier 3: Compare fractions
- **Mechanic**: From the observation platform, the player sees three reservoirs. For example: A: 4/6, B: 5/8, C: 3/5. Player must choose the reservoir with the largest fraction.
- **Node**: `g6_fraction_compare`

## Tier 1: Multiples Lamps
- **Mechanic**: Light up a correct sequence of number lamps based on the multiples of a base number.
- **Node**: `g6_number_multiples`

## Tier 2: Common Factor Gate
- **Mechanic**: Unlock a stone gate by finding common factors of given numbers (the keys).
- **Node**: `g6_number_common_factors`

## Tier 3: Divisibility Observation Path
- **Mechanic**: Observe numbers from a tower and determine a safe path based on divisibility rules (e.g., divisible by both 3 and 5).
- **Node**: `g6_number_divisibility_logic`

## Implementation Rules
- Puzzles are not detached quiz popups; they must relate to the world's reservoirs.
- The observation platform must be required for Tier 3.
- A puzzle is invalid if it can be replaced by a plain popup quiz without losing meaning.
