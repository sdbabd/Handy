import React, { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "../../ui/Button";
import { commands } from "@/bindings";

interface TestConnectionButtonProps {
  providerId: string;
  disabled?: boolean;
  className?: string;
}

export const TestConnectionButton: React.FC<TestConnectionButtonProps> = React.memo(
  ({ providerId, disabled = false, className = "" }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
      type: "success" | "error" | null;
      message: string;
    }>({ type: null, message: "" });

    const handleTest = async () => {
      if (disabled || isLoading) return;

      setIsLoading(true);
      setResult({ type: null, message: "" });

      try {
        const response = await commands.testPostProcessConnection(providerId);
        if (response.status === "ok") {
          setResult({
            type: "success",
            message: response.data,
          });
        } else {
          setResult({
            type: "error",
            message: response.error || "Test failed",
          });
        }
      } catch (error) {
        console.error("Test connection error:", error);
        setResult({
          type: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (result.type === "success") {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Connected</span>
        </div>
      );
    }

    if (result.type === "error") {
      return (
        <div className="flex flex-col gap-1">
          <Button
            onClick={handleTest}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className={`${className} text-red-600 hover:bg-red-50`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
          {result.message && (
            <span className="text-xs text-red-600 max-w-[200px] break-words">
              {result.message}
            </span>
          )}
        </div>
      );
    }

    return (
      <Button
        onClick={handleTest}
        disabled={isLoading || disabled}
        variant="ghost"
        size="sm"
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Testing...
          </>
        ) : (
          "Test Connection"
        )}
      </Button>
    );
  },
);

TestConnectionButton.displayName = "TestConnectionButton";