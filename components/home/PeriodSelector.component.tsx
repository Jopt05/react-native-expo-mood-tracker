import { ThemeContext } from "@/context/Theme.context";
import { Period, PERIODS } from "@/hooks/useStats.hook";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface PeriodSelectorProps {
  selected: Period;
  onChange: (period: Period) => void;
}

export default function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  const { theme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  const handleSelect = (period: Period) => {
    onChange(period);
    setOpen(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="flex flex-row items-center gap-1 py-1 px-3 rounded-lg"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Text
          className="font-[Montserrat-regular] text-xs"
          style={{ color: theme.colors.primary }}
        >
          Last {selected} days
        </Text>
        <Ionicons
          name="chevron-down"
          size={12}
          color={theme.colors.primary}
        />
      </TouchableOpacity>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View
            className="rounded-xl py-2 w-48"
            style={{ backgroundColor: theme.colors.card }}
          >
            {PERIODS.map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => handleSelect(period)}
                className="py-3 px-4"
                style={{
                  backgroundColor:
                    selected === period ? theme.colors.background : "transparent",
                }}
              >
                <Text
                  className="font-[Montserrat-regular] text-sm"
                  style={{ color: theme.colors.primary }}
                >
                  Last {period} days
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
