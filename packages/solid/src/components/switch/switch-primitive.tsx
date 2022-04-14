import { Accessor, createContext, createMemo, createUniqueId, JSX, Show, splitProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { isFunction } from "../../utils";
import { callHandler } from "../../utils/function";
import { hope } from "../factory";
import { useFormControl } from "../form-control/use-form-control";
import { ElementType, HopeComponent, HTMLHopeProps } from "../types";

type SwitchPrimitiveChildrenRenderProp = (props: { state: Accessor<SwitchPrimitiveState> }) => JSX.Element;

interface SwitchPrimitiveOptions {
  /**
   * The id to be passed to the internal <button> tag.
   */
  id?: string;

  /**
   * The name to be passed to the internal <button> tag.
   */
  name?: string;

  /**
   * The value to be used in the switch button.
   * This is the value that will be returned on form submission.
   */
  value?: string;

  /**
   * If `true`, the switch will be checked.
   * You'll need to pass `onChange` to update its value (since it is now controlled)
   */
  checked?: boolean;

  /**
   * If `true`, the switch will be initially checked.
   */
  defaultChecked?: boolean;

  /**
   * If `true`, the switch input is marked as required,
   * and `required` attribute will be added
   */
  required?: boolean;

  /**
   * If `true`, the switch will be disabled
   */
  disabled?: boolean;

  /**
   * If `true`, the input will have `aria-invalid` set to `true`
   */
  invalid?: boolean;

  /**
   * If `true`, the switch will be readonly
   */
  readOnly?: boolean;

  /**
   * The children of the switch.
   */
  children?: JSX.Element | SwitchPrimitiveChildrenRenderProp;

  /**
   * The callback invoked when the checked state of the switch changes.
   */
  onChange?: (checked: boolean) => void;

  /**
   * The callback invoked when the switch is focused
   */
  onFocus?: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent>;

  /**
   * The callback invoked when the switch is blurred (loses focus)
   */
  onBlur?: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent>;
}

export type SwitchPrimitiveProps<C extends ElementType = "button"> = HTMLHopeProps<C, SwitchPrimitiveOptions>;

interface SwitchPrimitiveState {
  /**
   * The `checked` state of the switch.
   * (In uncontrolled mode)
   */
  _checked: boolean;

  /**
   * If `true`, the switch is in controlled mode.
   * (have checked and onChange props)
   */
  isControlled: boolean;

  /**
   * If `true`, the switch is currently focused.
   */
  isFocused: boolean;

  /**
   * The `checked` state of the switch.
   * (In controlled mode)
   */
  checked: boolean;

  /**
   * The value to be used in the switch input.
   * This is the value that will be returned on form submission.
   */
  value?: string;

  /**
   * The id of the input field in a switch.
   */
  id?: string;

  /**
   * The name of the input field in a switch.
   */
  name?: string;

  /**
   * If `true`, the switch input is marked as required,
   * and `required` attribute will be added
   */
  required?: boolean;

  /**
   * If `true`, the switch will be disabled
   */
  disabled?: boolean;

  /**
   * If `true`, the input will have `aria-invalid` set to `true`
   */
  invalid?: boolean;

  /**
   * If `true`, the switch will be readonly
   */
  readOnly?: boolean;

  "aria-required"?: boolean;
  "aria-disabled"?: boolean;
  "aria-invalid"?: boolean;
  "aria-readonly"?: boolean;

  "data-focus"?: string;
  "data-checked"?: string;
  "data-required"?: string;
  "data-disabled"?: string;
  "data-invalid"?: string;
  "data-readonly"?: string;
}

/**
 * Contains all the parts of a switch.
 * It renders a `label` with a visualy hidden `input[type=checkbox][role=switch]`.
 * You can style this element directly, or you can use it as a wrapper to put other components into, or both.
 */
// export function SwitchPrimitive<C extends ElementType = "button">(props: SwitchPrimitiveProps<C>) {
export const SwitchPrimitive: HopeComponent<"button", SwitchPrimitiveOptions> = props => {
  const defaultId = `hope-switch-${createUniqueId()}`;

  const formControlProps = useFormControl<HTMLButtonElement>(props);

  const [state, setState] = createStore<SwitchPrimitiveState>({
    // eslint-disable-next-line solid/reactivity
    _checked: !!props.defaultChecked,
    isFocused: false,
    get isControlled() {
      return props.checked !== undefined;
    },
    get checked() {
      return this.isControlled ? !!props.checked : this._checked;
    },
    get id() {
      return formControlProps.id ?? defaultId;
    },
    get name() {
      return props.name;
    },
    get value() {
      return props.value ?? "on";
    },
    get required() {
      return formControlProps.required;
    },
    get disabled() {
      return formControlProps.disabled;
    },
    get invalid() {
      return formControlProps.invalid;
    },
    get readOnly() {
      return formControlProps.readOnly;
    },
    get ["aria-required"]() {
      return this.required ? true : undefined;
    },
    get ["aria-disabled"]() {
      return this.disabled ? true : undefined;
    },
    get ["aria-invalid"]() {
      return this.invalid ? true : undefined;
    },
    get ["aria-readonly"]() {
      return this.readOnly ? true : undefined;
    },
    get ["data-focus"]() {
      return this.isFocused ? "" : undefined;
    },
    get ["data-checked"]() {
      return this.checked ? "" : undefined;
    },
    get ["data-required"]() {
      return this.required ? "" : undefined;
    },
    get ["data-disabled"]() {
      return this.disabled ? "" : undefined;
    },
    get ["data-invalid"]() {
      return this.invalid ? "" : undefined;
    },
    get ["data-readonly"]() {
      return this.readOnly ? "" : undefined;
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [local, _, others] = splitProps(
    props as SwitchPrimitiveProps<"button">,
    ["children", "onClick", "onChange"],
    [
      "id",
      "name",
      "value",
      "checked",
      "defaultChecked",
      "required",
      "disabled",
      "invalid",
      "readOnly",
      "onFocus",
      "onBlur",
    ]
  );

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = event => {
    if (state.readOnly || state.disabled) {
      event.preventDefault();
      return;
    }

    const newValue = !state.checked;

    if (!state.isControlled) {
      setState("_checked", newValue);
    }

    local.onChange?.(newValue);

    callHandler(local.onClick)(event);
  };

  const onFocus: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent> = event => {
    setState("isFocused", true);
    callHandler(formControlProps.onFocus)(event);
  };

  const onBlur: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent> = event => {
    setState("isFocused", false);
    callHandler(formControlProps.onBlur)(event);
  };

  const stateAccessor = () => state;

  const context: SwitchPrimitiveContextValue = {
    state,
  };

  return (
    <SwitchPrimitiveContext.Provider value={context}>
      <hope.button
        type="button"
        role="switch"
        value={state.value}
        id={state.id}
        name={state.name}
        disabled={state.disabled}
        aria-checked={state.checked}
        aria-required={state["aria-required"]}
        aria-disabled={state["aria-disabled"]}
        aria-invalid={state["aria-invalid"]}
        aria-readonly={state["aria-readonly"]}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        {...others}
      >
        <Show when={isFunction(local.children)} fallback={local.children as JSX.Element}>
          {(local.children as SwitchPrimitiveChildrenRenderProp)?.({ state: stateAccessor })}
        </Show>
      </hope.button>
    </SwitchPrimitiveContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

interface SwitchPrimitiveContextValue {
  state: SwitchPrimitiveState;
}

const SwitchPrimitiveContext = createContext<SwitchPrimitiveContextValue>();

export function useSwitcPrimitivehContext() {
  const context = useContext(SwitchPrimitiveContext);

  if (!context) {
    throw new Error("[Hope UI]: useSwitcPrimitivehContext must be used within a `<SwitchPrimitive />` component");
  }

  return context;
}
