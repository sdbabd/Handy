import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/Dropdown";
import { SettingContainer } from "../ui/SettingContainer";
import { useSettings } from "../../hooks/useSettings";
import { RecordingRetentionPeriod } from "@/bindings";

interface RecordingRetentionPeriodProps {
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
}

export const RecordingRetentionPeriodSelector: React.FC<RecordingRetentionPeriodProps> =
  React.memo(({ descriptionMode = "tooltip", grouped = false }) => {
    const { t } = useTranslation();
    const { getSetting, updateSetting, isUpdating } = useSettings();

    const selectedRetentionPeriod =
      getSetting("recording_retention_period") || "never";
    const historyLimit = getSetting("history_limit") || 5;

    const handleRetentionPeriodSelect = async (period: string) => {
      await updateSetting(
        "recording_retention_period",
        period as RecordingRetentionPeriod,
      );
    };

    const retentionOptions = [
      { value: "never", label: t('settings.debug.recordingRetentionPeriod.never') },
      { value: "preserve_limit", label: t('settings.debug.recordingRetentionPeriod.preserve', { count: historyLimit }) },
      { value: "days3", label: t('settings.debug.recordingRetentionPeriod.after3days') },
      { value: "weeks2", label: t('settings.debug.recordingRetentionPeriod.after2weeks') },
      { value: "months3", label: t('settings.debug.recordingRetentionPeriod.after3months') },
    ];

    return (
      <SettingContainer
        title={t('settings.debug.recordingRetentionPeriod.title')}
        description={t('settings.debug.recordingRetentionPeriod.description')}
        descriptionMode={descriptionMode}
        grouped={grouped}
      >
        <Dropdown
          options={retentionOptions}
          selectedValue={selectedRetentionPeriod}
          onSelect={handleRetentionPeriodSelect}
          placeholder={t('settings.debug.recordingRetentionPeriod.placeholder')}
          disabled={isUpdating("recording_retention_period")}
        />
      </SettingContainer>
    );
  });

RecordingRetentionPeriodSelector.displayName =
  "RecordingRetentionPeriodSelector";
