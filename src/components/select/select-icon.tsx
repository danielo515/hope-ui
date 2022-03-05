import { Show, splitProps } from "solid-js";

import { classNames, createClassSelector } from "@/utils/css";

import { Icon, IconProps } from "../icon/icon";
import { selectIconStyles } from "./select.styles";

const hopeSelectIconClass = "hope-select__trigger__icon";

export function SelectIcon(props: IconProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  const classes = () => classNames(local.class, hopeSelectIconClass, selectIconStyles());

  return (
    <Icon aria-hidden="true" class={classes()} color="$neutral10" {...others}>
      <Show
        when={local.children}
        fallback={
          <g fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </g>
        }
      >
        {local.children}
      </Show>
    </Icon>
  );
}

SelectIcon.toString = () => createClassSelector(hopeSelectIconClass);
