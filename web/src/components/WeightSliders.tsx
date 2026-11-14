import { useContent, useT } from "../i18n";
import type { Weights } from "../lib/ranking";
import { MAX_WEIGHT } from "../lib/variables";
import { VARIABLE_IDS } from "../types";
import { Button } from "./ui";

interface Props {
  weights: Weights;
  onChange: (weights: Weights) => void;
  onReset: () => void;
}

export function WeightSliders({ weights, onChange, onReset }: Props) {
  const t = useT();
  const { variables } = useContent();
  return (
    <fieldset className="weights">
      <legend>{t("weights.legend")}</legend>
      {VARIABLE_IDS.map((variable) => (
        <label key={variable}>
          {variables[variable].label}: {weights[variable]}
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
      <Button variant="secondary" onClick={onReset}>
        {t("weights.reset")}
      </Button>
    </fieldset>
  );
}
