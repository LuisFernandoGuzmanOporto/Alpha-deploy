import * as RadixDialog from "@radix-ui/react-dialog";
import * as RadixSelect from "@radix-ui/react-select";
import * as RadixSlider from "@radix-ui/react-slider";
import * as RadixSwitch from "@radix-ui/react-switch";
import { useId, type ReactNode } from "react";

// Controles accesibles sin estilo (Radix UI, la base de shadcn/ui) con el sistema de diseño de
// styles/tokens.css. Se estilan en styles/app.css con las clases `cc-*` y los atributos `data-state`.

/** Interruptor con su etiqueta; se activa con clic, Espacio o Enter. */
export function Switch({
  checked,
  onCheckedChange,
  children,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="cc-switch">
      <RadixSwitch.Root id={id} className="cc-switch__root" checked={checked} onCheckedChange={onCheckedChange}>
        <RadixSwitch.Thumb className="cc-switch__thumb" />
      </RadixSwitch.Root>
      <label htmlFor={id}>{children}</label>
    </div>
  );
}

/** Deslizador con su valor en tipografía monoespaciada. */
export function Slider({
  label,
  value,
  min,
  max,
  step,
  onValueChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="cc-slider">
      <div className="cc-slider__head">
        <span id={id}>{label}</span>
        <output>{value}</output>
      </div>
      <RadixSlider.Root
        className="cc-slider__root"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onValueChange(next ?? value)}
      >
        <RadixSlider.Track className="cc-slider__track">
          <RadixSlider.Range className="cc-slider__range" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="cc-slider__thumb" aria-labelledby={id} />
      </RadixSlider.Root>
    </div>
  );
}

export interface SelectOption {
  value: string;
  label: string;
  lang?: string;
}

/** Selector desplegable (flechas, Inicio, Fin y escritura para buscar). */
export function Select({
  value,
  options,
  onValueChange,
  label,
  icon,
}: {
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  label: string;
  icon?: ReactNode;
}) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      <RadixSelect.Trigger className="cc-select" aria-label={label}>
        {icon}
        <RadixSelect.Value />
        <RadixSelect.Icon className="cc-select__chevron" aria-hidden="true">
          ▾
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="cc-select__content" position="popper" sideOffset={6} align="end">
          <RadixSelect.Viewport>
            {options.map((option) => (
              <RadixSelect.Item key={option.value} value={option.value} lang={option.lang} className="cc-select__item">
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="cc-select__check">✓</RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

/** Ventana modal con foco atrapado, cierre con Escape y título accesible. */
export function Dialog({
  trigger,
  title,
  description,
  closeLabel,
  children,
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  closeLabel: string;
  children: ReactNode;
}) {
  return (
    <RadixDialog.Root>
      <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="cc-dialog__overlay" />
        <RadixDialog.Content className="cc-dialog">
          <div className="cc-dialog__head">
            <RadixDialog.Title className="cc-dialog__title">{title}</RadixDialog.Title>
            <RadixDialog.Close className="cc-dialog__close" aria-label={closeLabel}>
              ✕
            </RadixDialog.Close>
          </div>
          {description ? (
            <RadixDialog.Description className="cc-dialog__desc">{description}</RadixDialog.Description>
          ) : (
            <RadixDialog.Description className="visually-hidden">{title}</RadixDialog.Description>
          )}
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
