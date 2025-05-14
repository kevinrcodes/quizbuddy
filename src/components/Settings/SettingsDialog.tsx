import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { useToast } from "../../contexts/toast";

type APIProvider = "openai" | "gemini";

type AIModel = {
  id: string;
  name: string;
  description: string;
};

type ModelCategory = {
  key: 'extractionModel' | 'solutionModel' | 'debuggingModel';
  title: string;
  description: string;
  openaiModels: AIModel[];
  geminiModels: AIModel[];
};

// Define available models for each category
const modelCategories: ModelCategory[] = [
  {
    key: 'extractionModel',
    title: 'Problem Extraction',
    description: 'Model used to analyze screenshots and extract problem details',
    openaiModels: [
      {
        id: "gpt-4o",
        name: "gpt-4o",
        description: "Best overall performance for problem extraction"
      },
      {
        id: "gpt-4o-mini",
        name: "gpt-4o-mini",
        description: "Faster, more cost-effective option"
      }
    ],
    geminiModels: [
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        description: "Best overall performance for problem extraction"
      },
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        description: "Faster, more cost-effective option"
      }
    ]
  },
  {
    key: 'solutionModel',
    title: 'Solution Generation',
    description: 'Model used to generate coding solutions',
    openaiModels: [
      {
        id: "gpt-4o",
        name: "gpt-4o",
        description: "Strong overall performance for coding tasks"
      },
      {
        id: "gpt-4o-mini",
        name: "gpt-4o-mini",
        description: "Faster, more cost-effective option"
      }
    ],
    geminiModels: [
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        description: "Strong overall performance for coding tasks"
      },
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        description: "Faster, more cost-effective option"
      }
    ]
  },
  {
    key: 'debuggingModel',
    title: 'Debugging',
    description: 'Model used to debug and improve solutions',
    openaiModels: [
      {
        id: "gpt-4o",
        name: "gpt-4o",
        description: "Best for analyzing code and error messages"
      },
      {
        id: "gpt-4o-mini",
        name: "gpt-4o-mini",
        description: "Faster, more cost-effective option"
      }
    ],
    geminiModels: [
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        description: "Best for analyzing code and error messages"
      },
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        description: "Faster, more cost-effective option"
      }
    ]
  }
];

interface SettingsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({ open: externalOpen, onOpenChange }: SettingsDialogProps) {
  const [open, setOpen] = useState(externalOpen ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<APIProvider>("gemini");
  const [selectedModels, setSelectedModels] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  // Handle open state changes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  // Load current settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const config = await window.electronAPI.getConfig();
        if (config) {
          setSelectedProvider(config.apiProvider || "gemini");
          setSelectedModels({
            extractionModel: config.extractionModel || "gemini-2.0-flash",
            solutionModel: config.solutionModel || "gemini-2.0-flash",
            debuggingModel: config.debuggingModel || "gemini-2.0-flash"
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        showToast("Error", "Failed to load settings", "error");
      }
    };

    if (open) {
      loadSettings();
    }
  }, [open, showToast]);

  const handleProviderChange = (provider: APIProvider) => {
    setSelectedProvider(provider);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await window.electronAPI.updateConfig({
        apiProvider: selectedProvider,
        extractionModel: selectedModels.extractionModel,
        solutionModel: selectedModels.solutionModel,
        debuggingModel: selectedModels.debuggingModel
      });
      showToast("Success", "Settings saved successfully", "success");
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
      showToast("Error", "Failed to save settings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your AI model preferences
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Model Provider Selection */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-white">AI Provider</label>
            <div className="flex gap-2">
              <Button
                variant={selectedProvider === "gemini" ? "default" : "outline"}
                onClick={() => handleProviderChange("gemini")}
                className="flex-1"
              >
                Gemini
              </Button>
              <Button
                variant={selectedProvider === "openai" ? "default" : "outline"}
                onClick={() => handleProviderChange("openai")}
                className="flex-1"
              >
                OpenAI
              </Button>
            </div>
          </div>

          {/* Model Selection for each category */}
          {modelCategories.map((category) => (
            <div key={category.key} className="grid gap-2">
              <label className="text-sm font-medium text-white">
                {category.title}
              </label>
              <select
                className="bg-black border border-white/20 rounded-md px-3 py-2 text-white"
                value={selectedModels[category.key] || ""}
                onChange={(e) =>
                  setSelectedModels((prev) => ({
                    ...prev,
                    [category.key]: e.target.value,
                  }))
                }
              >
                {selectedProvider === "gemini"
                  ? category.geminiModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))
                  : category.openaiModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
              </select>
              <p className="text-sm text-white/60">
                {category.description}
              </p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}