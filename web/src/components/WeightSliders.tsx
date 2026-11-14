import { useContent, useT } from "../i18n";
import type { Weights } from "../lib/ranking";
import { MAX_WEIGHT } from "../lib/variables";
import { VARIABLE_IDS } from "../types";
import { Slider } from "./controls";
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
    <div className="cc-weights">
      {VARIABLE_IDS.map((variable) => (
        <Slider
          key={variable}
          label={variables[variable].label}
          value={weights[variable]}
          min={0}
          max={MAX_WEIGHT}
          step={0.5}
          onValueChange={(value) => onChange({ ...weights, [variable]: value })}
        />
      ))}
      <Button variant="secondary" onClick={onReset}>
        {t("weights.reset")}
      </Button>
    </div>
  );
}
