import React, { useState } from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";
import { tokens, typography, useAppTheme } from "@/theme";

type Variant = "default" | "title" | "description";

type LabelProps = {
  children: React.ReactNode;
};
type ErrorProps = {
  children?: React.ReactNode;
};

type CounterProps = {
  valueLength: number;
  maxLength: number;
};

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: Variant;
  maxLength?: number;
}

import { TextStyle } from "react-native";

type VariantConfig = {
  input: TextStyle;
  maxLength: number;
  multiline: boolean;
};

export function TextField({
  variant = "default",
  style,
  maxLength,
  ...props
}: TextFieldProps) {
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  const variants: Record<Variant, VariantConfig> = {
    default: {
      input: {
        fontSize: typography.scale.body.fontSize,
        lineHeight: typography.scale.body.lineHeight,
        padding: tokens.spacing[4],
        backgroundColor: colors.card,
        borderRadius: tokens.radius.lg,
        borderWidth: 1,
      },
      maxLength: 100,
      multiline: false,
    },

    title: {
      input: {
        fontSize: typography.scale.display.fontSize,
        lineHeight: typography.scale.display.lineHeight,
        fontWeight: 700,
        paddingVertical: 8,
      },
      maxLength: 50,
      multiline: true,
    },

    description: {
      input: {
        fontSize: typography.scale.body.fontSize,
        lineHeight: typography.scale.body.lineHeight,
        padding: tokens.spacing[4],
        minHeight: 100,
        backgroundColor: colors.card,
        borderRadius: tokens.radius.lg,
        borderWidth: 1,
      },
      maxLength: 200,
      multiline: true,
    },
  };
  const config = variants[variant];

  const borderColor = isFocused ? colors.primary : colors.border;

  return (
    <View style={{ gap: 6 }}>
      <TextInput
        {...props}
        multiline={config.multiline}
        maxLength={maxLength ?? config.maxLength}
        placeholderTextColor={colors.subtitle}
        textAlignVertical={config.multiline ? "top" : "center"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          {
            color: colors.foreground,
            borderColor: config.input.borderWidth ? borderColor : "transparent",
          },
          config.input,
          style,
        ]}
      />

      {config.multiline && (
        <CharacterCounter
          valueLength={props.value?.length ?? 0}
          maxLength={maxLength ?? config.maxLength}
        />
      )}
    </View>
  );
}

export const Label = ({ children }: LabelProps) => {
  const { colors } = useAppTheme();

  return (
    <Text
      style={{
        color: colors.muted,
        fontSize: typography.scale.caption.fontSize,
        lineHeight: typography.scale.caption.lineHeight,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    >
      {children}
    </Text>
  );
};

export const FieldError = ({ children }: ErrorProps) => {
  const { colors } = useAppTheme();

  if (!children) return null;

  return (
    <Text
      style={{
        color: colors.error,
        fontSize: typography.scale.caption.fontSize,
        lineHeight: typography.scale.caption.lineHeight,
      }}
    >
      {children}
    </Text>
  );
};

export const CharacterCounter = ({ valueLength, maxLength }: CounterProps) => {
  const { colors } = useAppTheme();

  return (
    <Text
      style={{
        color: colors.subtitle,
        fontSize: typography.scale.caption.fontSize,
        lineHeight: typography.scale.caption.lineHeight,
      }}
    >
      {valueLength}/{maxLength}
    </Text>
  );
};
