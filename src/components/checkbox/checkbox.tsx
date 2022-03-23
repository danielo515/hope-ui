import { createSignal, createUniqueId, JSX, Match, mergeProps, Show, splitProps, Switch } from "solid-js";

import { SystemStyleObject } from "@/styled-system/types";
import { useComponentStyleConfigs } from "@/theme/provider";
import { classNames, createClassSelector } from "@/utils/css";
import { callAllHandlers } from "@/utils/function";

import { hope } from "../factory";
import { useFormControl } from "../form-control/use-form-control";
import { createIcon } from "../icon/create-icon";
import { ElementType, HTMLHopeProps } from "../types";
import {
  checkboxContainerStyles,
  checkboxControlStyles,
  CheckboxControlVariants,
  checkboxLabelStyles,
} from "./checkbox.styles";
import { useCheckboxGroupContext } from "./checkbox-group";
import { visuallyHiddenStyles } from "@/theme/utils";

export type ThemeableCheckboxOptions = CheckboxControlVariants;

export interface CheckboxStyleConfig {
  baseStyle?: {
    root?: SystemStyleObject;
    group?: SystemStyleObject;
    control?: SystemStyleObject;
    label?: SystemStyleObject;
  };
  defaultProps?: {
    root?: ThemeableCheckboxOptions;
    group?: ThemeableCheckboxOptions;
  };
}

interface CheckboxOptions extends ThemeableCheckboxOptions {
  /**
   * The ref to be passed to the internal <input> tag.
   */
  ref?: HTMLInputElement | ((el: HTMLInputElement) => void);

  /**
   * The checked icon to use
   */
  iconChecked?: JSX.Element;

  /**
   * The indeterminate icon to use
   */
  iconIndeterminate?: JSX.Element;

  /**
   * The name of the input field in a checkbox
   * (Useful for form submission).
   */
  name?: string;

  /**
   * The value to be used in the checkbox input.
   * This is the value that will be returned on form submission.
   */
  value?: string | number;

  /**
   * If `true`, the checkbox will be checked.
   * You'll need to pass `onChange` to update its value (since it is now controlled)
   */
  checked?: boolean;

  /**
   * If `true`, the checkbox will be initially checked.
   */
  defaultChecked?: boolean;

  /**
   * If `true`, the checkbox will be indeterminate.
   * This only affects the icon shown inside checkbox
   * and does not modify the checked property.
   */
  indeterminate?: boolean;

  /**
   * If `true`, the checkbox input is marked as required,
   * and `required` attribute will be added
   */
  required?: boolean;

  /**
   * If `true`, the checkbox will be disabled
   */
  disabled?: boolean;

  /**
   * If `true`, the checkbox will be readonly
   */
  readOnly?: boolean;

  /**
   * If `true`, the input will have `aria-invalid` set to `true`
   */
  invalid?: boolean;

  /**
   * The callback invoked when the checked state of the `Checkbox` changes.
   */
  onChange?: JSX.EventHandlerUnion<HTMLInputElement, Event>;

  /**
   * The callback invoked when the checkbox is focused
   */
  onFocus?: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent>;

  /**
   * The callback invoked when the checkbox is blurred (loses focus)
   */
  onBlur?: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent>;
}

export type CheckboxProps<C extends ElementType = "label"> = HTMLHopeProps<C, CheckboxOptions>;

const hopeCheckboxClass = "hope-checkbox";
const hopeCheckboxInputClass = "hope-checkbox__input";
const hopeCheckboxControlClass = "hope-checkbox__control";
const hopeCheckboxLabelClass = "hope-checkbox__label";

// A thicker version of radix-icon-check
const CheckboxIconCheck = createIcon({
  viewBox: "0 0 15 15",
  path: () => (
    <path
      d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="1"
      fill-rule="evenodd"
      clip-rule="evenodd"
    />
  ),
});

// A thicker version of radix-icon-minus
const CheckboxIconIndeterminate = createIcon({
  viewBox: "0 0 15 15",
  path: () => (
    <path
      d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="1"
      fill-rule="evenodd"
      clip-rule="evenodd"
    />
  ),
});

export function Checkbox<C extends ElementType = "label">(props: CheckboxProps<C>) {
  const defaultId = `hope-checkbox-${createUniqueId()}`;

  const theme = useComponentStyleConfigs().Checkbox;

  const checkboxGroupContext = useCheckboxGroupContext();

  const defaultProps: CheckboxProps<"label"> = {
    iconChecked: <CheckboxIconCheck />,
    iconIndeterminate: <CheckboxIconIndeterminate />,
  };

  const propsWithDefaults: CheckboxProps<"label"> = mergeProps(defaultProps, props);
  const [local, inputProps, variantProps, others] = splitProps(
    propsWithDefaults,
    ["iconChecked", "iconIndeterminate", "checked", "defaultChecked", "onChange", "class", "children"],
    [
      "ref",
      "id",
      "name",
      "value",
      "indeterminate",
      "required",
      "disabled",
      "invalid",
      "readOnly",
      "aria-label",
      "aria-labelledby",
      "aria-describedby",
      "tabIndex",
      "onFocus",
      "onBlur",
    ],
    ["variant", "colorScheme", "size"]
  );

  const formControlProps = useFormControl<HTMLInputElement>(inputProps);

  const variant = () => {
    return (
      variantProps.variant ?? checkboxGroupContext?.state?.variant ?? theme?.defaultProps?.root?.variant ?? "outline"
    );
  };

  const colorScheme = () => {
    return (
      variantProps.colorScheme ??
      checkboxGroupContext?.state?.colorScheme ??
      theme?.defaultProps?.root?.colorScheme ??
      "primary"
    );
  };

  const size = () => {
    return variantProps.size ?? checkboxGroupContext?.state?.size ?? theme?.defaultProps?.root?.size ?? "md";
  };

  const id = () => formControlProps.id ?? defaultId;
  const name = () => inputProps.name ?? checkboxGroupContext?.state.name;
  const required = () => formControlProps.required ?? checkboxGroupContext?.state.required;
  const disabled = () => formControlProps.disabled ?? checkboxGroupContext?.state.disabled;
  const invalid = () => formControlProps.invalid ?? checkboxGroupContext?.state.invalid;
  const readOnly = () => formControlProps.readOnly ?? checkboxGroupContext?.state.readOnly;

  // Internal state for uncontrolled checkbox.
  // eslint-disable-next-line solid/reactivity
  const [checkedState, setCheckedState] = createSignal(!!local.defaultChecked);

  const isControlled = () => local.checked !== undefined;

  const checked = () => {
    if (checkboxGroupContext) {
      const checkboxGroupValue = checkboxGroupContext.state.value;
      return checkboxGroupValue != null
        ? checkboxGroupValue.some(val => String(inputProps.value) === String(val))
        : undefined;
    }

    // Not in CheckboxGroup
    return isControlled() ? !!local.checked : checkedState();
  };

  const dataIndeterminate = () => (inputProps.indeterminate ? "" : undefined);
  const dataChecked = () => (checked() ? "" : undefined);
  const dataRequired = () => (required() ? "" : undefined);
  const dataDisabled = () => (disabled() ? "" : undefined);
  const dataInvalid = () => (invalid() ? "" : undefined);
  const dataReadonly = () => (readOnly() ? "" : undefined);

  const ariaRequired = () => (required() ? true : undefined);
  const ariaDisabled = () => (disabled() ? true : undefined);
  const ariaInvalid = () => (invalid() ? true : undefined);
  const ariaReadonly = () => (readOnly() ? true : undefined);

  const containerClasses = () => {
    return classNames(
      local.class,
      hopeCheckboxClass,
      checkboxContainerStyles({
        size: size(),
      })
    );
  };

  const inputClasses = () => classNames(hopeCheckboxInputClass, visuallyHiddenStyles());

  const controlClasses = () => {
    return classNames(
      hopeCheckboxControlClass,
      checkboxControlStyles({
        variant: variant(),
        colorScheme: colorScheme(),
        size: size(),
      })
    );
  };

  const labelClasses = () =>
    classNames(
      hopeCheckboxLabelClass,
      checkboxLabelStyles({
        size: size(),
      })
    );

  const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = event => {
    if (inputProps.readOnly || inputProps.disabled) {
      event.preventDefault();
      return;
    }

    if (!isControlled()) {
      const target = event.target as HTMLInputElement;
      setCheckedState(target.checked);
    }

    callAllHandlers(checkboxGroupContext?.onChange, local.onChange)(event);
  };

  return (
    <hope.label
      class={containerClasses()}
      __baseStyle={theme?.baseStyle?.root}
      for={inputProps.id}
      data-indeterminate={dataIndeterminate()}
      data-checked={dataChecked()}
      data-required={dataRequired()}
      data-disabled={dataDisabled()}
      data-invalid={dataInvalid()}
      data-readonly={dataReadonly()}
      {...others}
    >
      <input
        ref={inputProps.ref}
        type="checkbox"
        id={id()}
        tabIndex={inputProps.tabIndex}
        value={inputProps.value}
        name={name()}
        checked={checked()}
        required={required()}
        disabled={disabled()}
        readOnly={readOnly()}
        aria-required={ariaRequired()}
        aria-disabled={ariaDisabled()}
        aria-invalid={ariaInvalid()}
        aria-readonly={ariaReadonly()}
        aria-label={inputProps["aria-label"]}
        aria-labelledby={inputProps["aria-labelledby"]}
        aria-describedby={formControlProps["aria-describedby"]}
        class={inputClasses()}
        onChange={onChange}
        onFocus={formControlProps.onFocus}
        onBlur={formControlProps.onBlur}
      />
      <hope.span
        aria-hidden={true}
        class={controlClasses()}
        __baseStyle={theme?.baseStyle?.control}
        data-indeterminate={dataIndeterminate()}
        data-checked={dataChecked()}
        data-required={dataRequired()}
        data-disabled={dataDisabled()}
        data-invalid={dataInvalid()}
        data-readonly={dataReadonly()}
      >
        <Switch>
          <Match when={inputProps.indeterminate}>{local.iconIndeterminate}</Match>
          <Match when={checked() && !inputProps.indeterminate}>{local.iconChecked}</Match>
        </Switch>
      </hope.span>
      <Show when={local.children}>
        <hope.span
          class={labelClasses()}
          __baseStyle={theme?.baseStyle?.label}
          data-indeterminate={dataIndeterminate()}
          data-checked={dataChecked()}
          data-required={dataRequired()}
          data-disabled={dataDisabled()}
          data-invalid={dataInvalid()}
          data-readonly={dataReadonly()}
        >
          {local.children}
        </hope.span>
      </Show>
    </hope.label>
  );
}

Checkbox.toString = () => createClassSelector(hopeCheckboxClass);
