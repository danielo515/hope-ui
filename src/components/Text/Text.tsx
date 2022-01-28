import { mergeProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useTheme } from "@/contexts/HopeContext";
import { utilityStyleProps } from "@/theme/utilityStyles";

import { ElementType, PolymorphicComponentProps } from "../types";
import { commonProps, createCssSelector, generateClassList } from "../utils";
import { textStyles, TextVariants } from "./Text.styles";

export type ThemeableTextOptions = Omit<TextVariants, "lineClamp">;

export type TextProps<C extends ElementType> = PolymorphicComponentProps<C, TextVariants>;

const hopeTextClass = "hope-text";

/**
 * Text component is the used to render text and paragraphs within an interface.
 * It renders a <p> tag by default.
 */
export function Text<C extends ElementType = "p">(props: TextProps<C>) {
  const theme = useTheme().components.Text;

  const defaultProps: TextProps<"p"> = {
    as: "p",
    color: theme?.defaultProps?.color ?? "dark900",
    size: theme?.defaultProps?.size ?? "base",
    weight: theme?.defaultProps?.weight ?? "normal",
    align: theme?.defaultProps?.align ?? "left",
  };

  props = mergeProps(defaultProps, props);
  const [local, styleProps, others] = splitProps(props, commonProps, [
    ...utilityStyleProps,
    "css",
    "size",
    "font",
    "weight",
    "letterSpacing",
    "align",
    "capitalized",
    "uppercased",
    "lowercased",
    "lineClamp",
  ]);

  const classList = () => {
    return generateClassList({
      hopeClass: hopeTextClass,
      baseClass: textStyles(styleProps),
      class: local.class,
      className: local.className,
      classList: local.classList,
    });
  };

  return <Dynamic component={local.as} classList={classList()} {...others} />;
}

Text.toString = () => createCssSelector(hopeTextClass);
