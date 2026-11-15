import { useId } from "react";
import { useContent, useT } from "../i18n";
import { activeProfile, MISSION_PROFILES, type ProfileId } from "../lib/profiles";
import type { Weights } from "../lib/ranking";
import { MAX_WEIGHT } from "../lib/variables";
import { VARIABLE_IDS } from "../types";
import { Slider } from "./controls";
import { Button } from "./ui";

interface Props {
  weights: Weights;
  onChange: (weights: Weights) => void;
  onReset: () => void;
  /** Aplica un perfil por objetivo de misión (tarea 4a). */
  onProfile: (id: ProfileId) => void;
}

export function WeightSliders({ weights, onChange, onReset, onProfile }: Props) {
  const t = useT();
  const { variables } = useContent();
  const titleId = useId();
  const active = activeProfile(weights);
  return (
    <div className="cc-weights">
      <div className="cc-profiles" role="group" aria-labelledby={titleId}>
        <span id={titleId} className="cc-profiles__title">
          {t("profiles.title")}
        </span>
        <div className="cc-profiles__options">
          {MISSION_PROFILES.map((profile) => (
            <button
              key={profile.id}
              type="button"
              className="cc-profile"
              aria-pressed={active === profile.id}
              onClick={() => onProfile(profile.id)}
            >
              {t(`profiles.${profile.id}`)}
            </button>
          ))}
        </div>
        <p className="cc-profiles__status" aria-live="polite">
          <strong>{t("profiles.active", { name: active ? t(`profiles.${active}`) : t("profiles.custom") })}</strong>
          {active && <> {t(`profiles.${active}Desc`)}</>}
        </p>
        <p className="cc-profiles__note">{t("profiles.note")}</p>
      </div>
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
