import { useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";
import ThirdPartyCountUp from "../reactbits/CountUp";
import ThirdPartyDecryptedText from "../reactbits/DecryptedText";

/** Adaptadores visuales: conservan intacto el código de terceros. */
export function CountUp(props: ComponentProps<typeof ThirdPartyCountUp>) {
  const reduce = useReducedMotion();
  return reduce ? <span>{props.to}</span> : <ThirdPartyCountUp {...props} />;
}

export function DecryptedText(props: ComponentProps<typeof ThirdPartyDecryptedText>) {
  const reduce = useReducedMotion();
  return reduce ? <span>{props.text}</span> : <ThirdPartyDecryptedText {...props} />;
}
