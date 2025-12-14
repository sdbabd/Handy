import React from "react";
import { RefreshCcw } from "lucide-react";

import { SettingsGroup } from "../../ui/SettingsGroup";
import { SettingContainer } from "../../ui/SettingContainer";
import { ResetButton } from "../../ui/ResetButton";

import { ProviderSelect } from "./ProviderSelect";
import { BaseUrlField } from "./BaseUrlField";
import { ApiKeyField } from "./ApiKeyField";
import { ModelSelect } from "./ModelSelect";
import { usePostProcessProviderState } from "./usePostProcessProviderState";

const DisabledNotice: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="p-4 bg-mid-gray/5 rounded-lg border border-mid-gray/20 text-center">
    <p className="text-sm text-mid-gray">{children}</p>
  </div>
);

const PostProcessingSettingsApiComponent: React.FC = () => {
  const state = usePostProcessProviderState();

  return (
    <>
      <SettingContainer
        title="Provider"
        description="Select an OpenAI-compatible provider."
        descriptionMode="tooltip"
        layout="horizontal"
        grouped={true}
      >
        <div className="flex items-center gap-2">
          <ProviderSelect
            options={state.providerOptions}
            value={state.selectedProviderId}
            onChange={state.handleProviderSelect}
          />
        </div>
      </SettingContainer>

      <>
        <SettingContainer
            title="Base URL"
            description="API base URL for the selected provider. Customize this endpoint for compatible services or self-hosted instances."
            descriptionMode="tooltip"
            layout="horizontal"
            grouped={true}
          >
            <div className="flex items-center gap-2">
              <BaseUrlField
                value={state.baseUrl}
                onBlur={state.handleBaseUrlChange}
                placeholder="https://api.openai.com/v1"
                disabled={state.isBaseUrlUpdating}
                className="min-w-[380px]"
              />
            </div>
          </SettingContainer>

          <SettingContainer
            title="API Key"
            description="API key for the selected provider."
            descriptionMode="tooltip"
            layout="horizontal"
            grouped={true}
          >
            <div className="flex items-center gap-2">
              <ApiKeyField
                value={state.apiKey}
                onBlur={state.handleApiKeyChange}
                placeholder="sk-..."
                disabled={state.isApiKeyUpdating}
                className="min-w-[320px]"
              />
            </div>
          </SettingContainer>
        </>

      <SettingContainer
        title="Model"
        description={
          state.isCustomProvider
            ? "Provide the model identifier expected by your custom endpoint."
            : "Choose a model exposed by the selected provider."
        }
        descriptionMode="tooltip"
        layout="stacked"
        grouped={true}
      >
        <div className="flex items-center gap-2">
          <ModelSelect
            value={state.model}
            options={state.modelOptions}
            disabled={state.isModelUpdating}
            isLoading={state.isFetchingModels}
            placeholder={
              state.modelOptions.length > 0
                ? "Search or select a model"
                : "Type a model name"
            }
            onSelect={state.handleModelSelect}
            onCreate={state.handleModelCreate}
            onBlur={() => {}}
            className="flex-1 min-w-[380px]"
          />
          <ResetButton
            onClick={state.handleRefreshModels}
            disabled={state.isFetchingModels}
            ariaLabel="Refresh models"
            className="flex h-10 w-10 items-center justify-center"
          >
            <RefreshCcw
              className={`h-4 w-4 ${state.isFetchingModels ? "animate-spin" : ""}`}
            />
          </ResetButton>
        </div>
      </SettingContainer>
    </>
  );
};

export const PostProcessingSettingsApi = React.memo(
  PostProcessingSettingsApiComponent,
);
PostProcessingSettingsApi.displayName = "PostProcessingSettingsApi";