import React, { useState } from "react";
import { View, Pressable, Modal, FlatList } from "react-native";
import { tokens, typography, useAppTheme } from "@/theme";
import { Icon } from "./Icon";
import { Text } from "./Text";

type SelectFieldProps<T> = {
  value?: string;
  options: T[];
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
  onChange: (value: string) => void;

  placeholder?: string;
  emptyMessage?: string;
  renderEmpty?: () => React.ReactNode;
};

export function SelectField<T>(props: SelectFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = props.options.find((o) => props.getValue(o) === props.value);

  return (
    <>
      <SelectTrigger
        label={selected ? props.getLabel(selected) : undefined}
        placeholder={props.placeholder}
        onPress={() => setIsOpen(true)}
      />

      <SelectModal open={isOpen} onClose={() => setIsOpen(false)}>
        {props.options.length === 0 ? (
          <SelectEmpty
            emptyMessage={props.emptyMessage}
            renderEmpty={props.renderEmpty}
          />
        ) : (
          <SelectList
            options={props.options}
            value={props.value}
            getLabel={props.getLabel}
            getValue={props.getValue}
            onChange={(val) => {
              props.onChange(val);
              setIsOpen(false);
            }}
          />
        )}
      </SelectModal>
    </>
  );
}

function SelectTrigger({
  label,
  placeholder = "Select...",
  onPress,
}: {
  label?: string;
  placeholder?: string;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: tokens.spacing[4],
        backgroundColor: colors.card,
        borderRadius: tokens.radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text color={label ? "foreground" : "subtitle"}>
        {label ?? placeholder}
      </Text>

      <Icon color="muted" name="chevron-down" type="MaterialCommunityIcons" />
    </Pressable>
  );
}

function SelectModal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { colors } = useAppTheme();

  return (
    <Modal visible={open} transparent animationType="fade">
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          padding: tokens.spacing[5],
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: tokens.radius.lg,
            padding: tokens.spacing[4],
          }}
        >
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}

function SelectList<T>({
  options,
  value,
  getLabel,
  getValue,
  onChange,
}: {
  options: T[];
  value?: string;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
  onChange: (value: string) => void;
}) {
  const { colors } = useAppTheme();

  return (
    <FlatList
      data={options}
      keyExtractor={(item) => getValue(item)}
      renderItem={({ item }) => {
        const isSelected = getValue(item) === value;

        return (
          <Pressable
            onPress={() => onChange(getValue(item))}
            style={{
              padding: tokens.spacing[4],
              backgroundColor: isSelected ? colors.primaryMuted : "transparent",
              borderRadius: tokens.radius.lg,
            }}
          >
            <Text color="foreground" weight={isSelected ? "bold" : "regular"}>
              {getLabel(item)}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

function SelectEmpty({
  emptyMessage,
  renderEmpty,
}: {
  emptyMessage?: string;
  renderEmpty?: () => React.ReactNode;
}) {
  if (renderEmpty) return <>{renderEmpty()}</>;

  return (
    <View
      style={{
        padding: tokens.spacing[4],
        alignItems: "center",
      }}
    >
      <Text color="subtitle">{emptyMessage ?? "No options available"}</Text>
    </View>
  );
}
