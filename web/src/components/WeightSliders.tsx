import type { Weights } from "../lib/ranking";
import { MAX_WEIGHT, VARIABLE_INFO } from "../lib/variables";
import { VARIABLE_IDS } from "../types";

interface Props {
  weights: Weights;
  onChange: (weights: Weights) => void;
  onReset: () => void;
}

export function WeightSliders({ weights, onChange, onReset }: Props) {
  return (
    <fieldset className="weights">
      <legend>Peso de cada variable en el índice</legend>
      {VARIABLE_IDS.map((variable) => (
        <label key={variable}>
          {VARIABLE_INFO[variable].label}: {weights[variable]}
          <input
            type="range"
            min={0}
            max={MAX_WEIGHT}
            step={0.5}
            value={weights[variable]}
            onChange={(event) => onChange({ ...weights, [variable]: Number(event.target.value) })}
          />
        </label>
      ))}
      <button type="button" onClick={onReset}>
        Restablecer pesos
      </button>
    </fieldset>
  );
}
