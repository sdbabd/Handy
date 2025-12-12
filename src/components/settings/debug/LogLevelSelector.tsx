import React from "react";
import { useTranslation } from "react-i18next";
import { SettingContainer } from "../../ui/SettingContainer";
import { Dropdown, type DropdownOption } from "../../ui/Dropdown";
import { useSettings } from "../../../hooks/useSettings";
import type { LogLevel } from "../../../bindings";

const getLogLevelOptions = (t: (key: string) => string): DropdownOption[] => [
  { value: "error", label: t('settings.debug.levels.error') },
  { value: "warn", label: t('settings.debug.levels.warn') },
  { value: "info", label: t('settings.debug.levels.info') },
  { value: "debug", label: t('settings.debug.levels.debug') },
  { value: "trace", label: t('settings.debug.levels.trace') },
];

interface LogLevelSelectorProps {
  descriptionMode?: "tooltip" | "inline";
  grouped?: boolean;
}

export const LogLevelSelector: React.FC<LogLevelSelectorProps> = ({
  descriptionMode = "tooltip",
  grouped = false,
}) => {
  const { t } = useTranslation();
  const { settings, updateSetting, isUpdating } = useSettings();
  const currentLevel = settings?.log_level ?? "debug";
  const logLevelOptions = getLogLevelOptions(t);

  const handleSelect = async (value: string) => {
    if (value === currentLevel) return;

    try {
      await updateSetting("log_level", value as LogLevel);
    } catch (error) {
      console.error("Failed to update log level:", error);
    }
  };

  return (
    <SettingContainer
      title={t('settings.debug.logLevel.title')}
      description={t('settings.debug.logLevel.description')}
      descriptionMode={descriptionMode}
      grouped={grouped}
      layout="horizontal"
    >
      <Dropdown
        options={logLevelOptions}
        selectedValue={currentLevel}
        onSelect={handleSelect}
        disabled={!settings || isUpdating("log_level")}
      />
    </SettingContainer>
  );
};
