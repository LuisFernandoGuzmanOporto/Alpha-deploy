import type { Weights } from "../lib/ranking";
import { VARIABLE_IDS, type VariableId } from "../types";

const LABELS: Record<VariableId, string> = {
  slope_deg: "Pendiente",
  relief_m: "Relieve local",
  temp_mean_c: "Temperatura de superficie",
  precip_mm_year: "Aridez (precipitación)",
  albedo: "Albedo",
};

const MAX_WEIGHT = 3;

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
          {LABELS[variable]}: {weights[variable]}
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
