"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { EnhancedLabEquipment } from "@/components/EnhancedLabEquipment";
import { EquipmentRack } from "@/components/EquipmentRack";
import { EnhancedLabTable } from "@/components/EnhancedLabTable";
import { EnhancedChemicalLibrary } from "@/components/EnhancedChemicalLibrary";
import { DragDropProvider } from "@/components/DragDropProvider";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useExperimentProtection } from "@/hooks/useExperimentProtection";
import { Beaker, Settings, ChevronDown, Play, RotateCcw, Save, Layers, AlertTriangle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from "axios";
import useChemicalReactionEngine from '@/components/ChemicalReactionEngine';
import useExperimentScoring, { ExperimentScorePanel } from '@/components/ExperimentScoring';
import EducationalTooltips from '@/components/EducationalTooltips';
import SafetyWarnings from '@/components/SafetyWarnings';
import logo from '../assets/Reactron_Logo.png'
import { Navigate, useNavigate } from 'react-router-dom';

interface PlacedEquipment {
  id: string;
  position: [number, number, number];
  type: string;
  contents: string[];
  chemicalObjects: Array<{ name: string; volume: number; color: string }>;
  totalVolume: number;
}

interface ExperimentState {
  status: "idle" | "active" | "paused" | "completed";
  startTime?: Date;
  currentSession?: string;
  autoSaveEnabled: boolean;
}

const STORAGE_KEY = "virtual-lab-state";

const ScienceLab = () => {
  const [placedEquipment, setPlacedEquipment] = useState<PlacedEquipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [reactions, setReactions] = useState<any[]>([]);
  const [experimentState, setExperimentState] = useState<ExperimentState>({ status: "idle", autoSaveEnabled: true });
  const [isExperimentStarted, setIsExperimentStarted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const navigate = useNavigate();

  const reactionEngine = useChemicalReactionEngine();
  const scoring = useExperimentScoring();

  useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);

    setPlacedEquipment(parsed.placedEquipment || []);
    setReactions(parsed.reactions || []);

    // ✅ Restore experiment state with date fix
    setExperimentState(() => {
      const state = parsed.experimentState || { status: "idle", autoSaveEnabled: true };
      if (state.startTime && typeof state.startTime === "string") {
        state.startTime = new Date(state.startTime);
      }
      if (state.endTime && typeof state.endTime === "string") {
        state.endTime = new Date(state.endTime);
      }
      return state;
    });

    setIsExperimentStarted(parsed.isExperimentStarted || false);

    // ✅ Restore score & badges correctly
    if (parsed.score) {
      for (let i = 0; i < Math.floor(parsed.score / 10); i++) {
        scoring.award(10);
      }
    }
    if (parsed.badges && parsed.badges.length > 0) {
      parsed.badges.forEach((b: string) => scoring.awardBadge(b));
    }
  }
}, []);



  // Persist state to localStorage
  useEffect(() => {
    const data = {
      placedEquipment,
      reactions,
      experimentState,
      isExperimentStarted,
      score: scoring.score,
      badges: scoring.badges,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [placedEquipment, reactions, experimentState, isExperimentStarted, scoring.score, scoring.badges]);

  // Experiment protection (warn before leaving)
  useExperimentProtection({
    isExperimentActive: isExperimentStarted,
    onBeforeUnload: () => {
      if (placedEquipment.length || reactions.length) saveExperiment(true);
    },
  });

  // Auto-save to backend every 60s
  useEffect(() => {
    if (!isExperimentStarted || !experimentState.autoSaveEnabled || !user) return;
    const interval = setInterval(() => {
      if (placedEquipment.length || reactions.length) saveExperiment(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [isExperimentStarted, placedEquipment, reactions, experimentState.autoSaveEnabled, user]);

  // --- Handlers ---
  const startExperiment = () => {
    if (isExperimentStarted) return;
    const sessionId = `exp-${Date.now()}`;
    setExperimentState({ status: "active", startTime: new Date(), currentSession: sessionId, autoSaveEnabled: true });
    setIsExperimentStarted(true);
    scoring.award(10, "Experiment Started");
    toast({ title: "Experiment Started! 🧪", description: "You can now interact with equipment and chemicals." });
  };

  const performReset = () => {
    setReactions([]);
    setSelectedEquipment(null);
    setPlacedEquipment([]);
    setIsExperimentStarted(false);
    setExperimentState({ status: "idle", autoSaveEnabled: true });
    scoring.reset();
    localStorage.removeItem(STORAGE_KEY);
    toast({ title: "Lab Reset", description: "All equipment cleared. Click Start to begin a new experiment." });
  };

  const resetLab = () => {
    if (experimentState.status === "active") setShowResetConfirm(true);
    else performReset();
  };

  const saveExperiment = async (isAutoSave = false) => {
    if (!user) return toast({ title: "Authentication Required", description: "Please sign in to save your experiments.", variant: "destructive" });
    if (experimentState.status === "idle") return toast({ title: "No Active Experiment", description: "Start an experiment first to save progress.", variant: "destructive" });

    try {
      const experimentData = {
        user_id: user.uid,
        experiment_name: `Lab Session ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        chemicals_used: placedEquipment.flatMap(eq => eq.contents),
        results: {
          reactions: reactions.length,
          equipment_used: placedEquipment.length,
          chemicals_mixed: placedEquipment.reduce((total, eq) => total + eq.chemicalObjects.length, 0),
          session_duration: experimentState.startTime ? Math.round((Date.now() - experimentState.startTime.getTime()) / 1000) : 0,
          equipment_details: placedEquipment.map(eq => ({ type: eq.type, chemicals: eq.chemicalObjects, totalVolume: eq.totalVolume })),
          reactions_performed: reactions.map(r => ({ name: r.name, type: r.type, timestamp: r.startedAt })),
          timestamp: new Date().toISOString(),
        },
        score: scoring.score,
      };

      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/add-experiment`, { experimentData });
      if (response.status === 200) toast({ title: isAutoSave ? "Auto-saved" : "Experiment Saved! 💾", description: `Progress saved with ${scoring.score} points.` });
    } catch {
      toast({ title: "Save Failed", description: "Could not save experiment. Please try again.", variant: "destructive" });
    }
  };

  const handleVolumeChange = (equipmentId: string, newTotalVolume: number) => {
    if (!isExperimentStarted) return toast({ title: "Experiment Not Started", description: "Click 'Start' in Lab Controls to begin experimenting.", variant: "destructive" });

    setPlacedEquipment(prev =>
      prev.map(eq => {
        if (eq.id !== equipmentId) return eq;
        const chemicals = eq.chemicalObjects || [];
        if (chemicals.length) {
          const total = chemicals.reduce((s, c) => s + Number(c.volume || 0), 0);
          const scale = total ? Number(newTotalVolume) / total : 0;
          const scaled = chemicals.map(c => ({ ...c, volume: Number(c.volume || 0) * scale }));
          return { ...eq, chemicalObjects: scaled, totalVolume: scaled.reduce((s, c) => s + Number(c.volume || 0), 0) };
        }
        return { ...eq, totalVolume: Number(newTotalVolume || 0) };
      })
    );
    toast({ title: "Volume Adjusted", description: `Volume set to ${newTotalVolume}ml` });
  };

  const handleEquipmentPlace = (equipmentId: string, position: [number, number, number]) => {
    if (!isExperimentStarted) return toast({ title: "Experiment Not Started", description: "Click 'Start' to place equipment.", variant: "destructive" });

    setPlacedEquipment(prev => [...prev, { id: `${equipmentId}-${Date.now()}`, position, type: equipmentId, contents: [], chemicalObjects: [], totalVolume: 0 }]);
    scoring.award(10, `Placed ${equipmentId}`);
    toast({ title: "Equipment Placed", description: `${equipmentId} has been placed on the workbench.` });
  };

  const handleChemicalAdd = (equipmentId: string, chemical: any, volume: number) => {
    if (!isExperimentStarted) return toast({ title: "Experiment Not Started", description: "Click 'Start' in Lab Controls to begin experimenting.", variant: "destructive" });

    const vol = Number(volume || 0);
    setPlacedEquipment(prev =>
      prev.map(eq => {
        if (eq.id !== equipmentId) return eq;

        const newChemicalObjects = [...(eq.chemicalObjects || []), { name: chemical.name, volume: vol, color: chemical.color || chemical.colorHex || "#87CEEB" }];
        const newContents = [...(eq.contents || []), chemical.name];
        const updated = { ...eq, chemicalObjects: newChemicalObjects, contents: newContents, totalVolume: newChemicalObjects.reduce((sum, c) => sum + Number(c.volume || 0), 0) };

        try {
          const reaction = reactionEngine.perform(newChemicalObjects.map(c => c.name), 20);
          if (reaction) {
            setReactions(prev => [...prev, { ...reaction, id: `${reaction.id}-${Date.now()}`, equipmentId: eq.id, startedAt: Date.now() }]);
            scoring.award(50, `Reaction: ${reaction.name}`);
            scoring.awardBadge(reaction.type || "reaction");
          }
          scoring.award(15, `Added ${chemical.name}`);
        } catch (e) {
          console.error("Reaction engine error", e);
        }

        return updated;
      })
    );

    toast({ title: "Chemical Added", description: `${chemical.name} (${vol}ml) added to equipment.` });
  };

  const handleChemicalSelect = (chemical: any) => {
    if (!isExperimentStarted) return toast({ title: "Experiment Not Started", description: "Click 'Start' in Lab Controls to begin experimenting.", variant: "destructive" });
    if (selectedEquipment) handleChemicalAdd(selectedEquipment, chemical, 5);
    else toast({ title: "No Equipment Selected", description: "Please select equipment first.", variant: "destructive" });
  };

  const experimentDetails = [
    { label: "Equipment placed", value: placedEquipment.length },
    { label: "Chemicals added", value: placedEquipment.reduce((total, eq) => total + eq.chemicalObjects.length, 0) },
    { label: "Reactions performed", value: reactions.length },
    { label: "Current score", value: `${scoring.score} points` },
    { label: "Session duration", value: experimentState.startTime ? `${Math.round((Date.now() - experimentState.startTime.getTime()) / 60000)} min` : "0 min" },
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      <ExperimentScorePanel score={scoring.score} badges={scoring.badges} />
      <SafetyWarnings alerts={reactionEngine.safetyAlerts} onClear={reactionEngine.clearSafetyAlerts} />
      <EducationalTooltips reaction={reactionEngine.activeReactions[reactionEngine.activeReactions.length - 1]} />

      <DragDropProvider>
        <header className="flex items-center justify-between px-6 py-3 bg-card border-b shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              
              <div>
                <button onClick={() => navigate ('/')} ><img className="w-44 h-12 items-center justify-center -mb-2" src={logo}/> </button>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={isExperimentStarted ? "default" : "outline"} className="flex items-center gap-1 px-3 py-1.5">
                  <Settings className="w-4 h-4" />
                  Lab Control
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={startExperiment} disabled={isExperimentStarted}>
                  <Play className="w-4 h-4 mr-2" />
                  {isExperimentStarted ? "Experiment Active" : "Start"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={resetLab}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => saveExperiment(false)} disabled={!isExperimentStarted}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          <UserMenu />
        </header>

        <div className="flex flex-1 min-h-0">
          <div className="w-8 flex-shrink-0" />
          <div className="flex-1 relative min-w-0">
            <Canvas camera={{ position: [0, 8, 22], fov: 25 }} shadows className="w-full h-full">
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} castShadow />
              <OrbitControls enableZoom enableRotate />
              <Environment preset="studio" />
              <EnhancedLabTable onEquipmentPlace={handleEquipmentPlace} placedEquipment={placedEquipment} />
              {placedEquipment.map(eq => (
                <EnhancedLabEquipment
                  key={eq.id}
                  selectedEquipment={selectedEquipment}
                  setSelectedEquipment={setSelectedEquipment}
                  reactions={reactions}
                  setReactions={setReactions}
                  position={eq.position}
                  equipmentType={eq.type}
                  equipmentId={eq.id}
                  equipmentContents={eq.contents}
                  chemicalObjects={eq.chemicalObjects}
                  totalVolume={eq.totalVolume}
                  onVolumeChange={(newVol) => handleVolumeChange(eq.id, newVol)}
                  onChemicalAdd={(chem, vol) => handleChemicalAdd(eq.id, chem, vol)}
                />
              ))}
              <Grid args={[30, 30]} position={[0, -0.5, 0]} cellSize={1} cellThickness={0.5} cellColor="#6B7280" sectionSize={5} sectionThickness={1} sectionColor="#374151" fadeDistance={25} fadeStrength={1} />
            </Canvas>
          </div>

          <div className="w-96 bg-card border-l border-border flex flex-col h-full">
            {!isExperimentStarted && (
              <div className="p-4 bg-muted border-b flex items-center justify-center text-sm font-medium text-muted-foreground gap-2">
                <Play className="w-4 h-4" /> Click "Start" in Lab Controls to begin
              </div>
            )}

            <Tabs defaultValue="chemicals" className="flex flex-col h-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="chemicals" disabled={!isExperimentStarted}>Chemicals</TabsTrigger>
                <TabsTrigger value="equipment" disabled={!isExperimentStarted}>Equipment</TabsTrigger>
              </TabsList>

              <TabsContent value="chemicals" className="p-4 flex-1 overflow-y-auto">
                <div className={!isExperimentStarted ? "opacity-50 pointer-events-none" : ""}>
                  <EnhancedChemicalLibrary onChemicalSelect={handleChemicalSelect} selectedEquipment={selectedEquipment} />
                </div>
              </TabsContent>

              <TabsContent value="equipment" className="p-4 flex-1 overflow-y-auto">
                <div className={!isExperimentStarted ? "opacity-50 pointer-events-none" : ""}>
                  <EquipmentRack onEquipmentSelect={() => {}} position={[0, 0, 0]} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <ConfirmationDialog
          isOpen={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
          onConfirm={performReset}
          title="Reset Active Experiment?"
          description="You have an active experiment in progress. Resetting will permanently delete all your progress:"
          icon={AlertTriangle}
          iconColor="text-orange-600"
          confirmText="Reset Anyway"
          cancelText="Save First"
          confirmVariant="destructive"
          details={experimentDetails}
        >
          <p className="text-xs text-muted-foreground mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
            💡 <strong>Tip:</strong> Consider saving your experiment first to preserve your progress and points.
          </p>
        </ConfirmationDialog>
      </DragDropProvider>
    </div>
  );
};

export default ScienceLab;
