import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Baby, Calendar, Heart, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetPregnancyTracker,
  useSetPregnancyTracker,
} from "../hooks/useQueries";

const weekGuide = {
  4: {
    size: "Poppy seed",
    milestone: "Implantation complete. Neural tube forming.",
  },
  5: {
    size: "Sesame seed",
    milestone: "Heart begins to beat. Brain and spinal cord developing.",
  },
  6: {
    size: "Lentil",
    milestone: "Facial features forming. Arm and leg buds appear.",
  },
  7: {
    size: "Blueberry",
    milestone: "Brain growing rapidly. Hands and feet forming.",
  },
  8: {
    size: "Kidney bean",
    milestone: "All major organs forming. Fingers and toes visible.",
  },
  9: {
    size: "Grape",
    milestone: "Embryo becomes a fetus. Muscles developing.",
  },
  10: {
    size: "Kumquat",
    milestone: "Vital organs functional. Baby can swallow.",
  },
  11: {
    size: "Fig",
    milestone: "Fingernails forming. Baby is moving actively.",
  },
  12: {
    size: "Lime",
    milestone: "Reflexes developing. Kidneys producing urine.",
  },
  13: {
    size: "Peach",
    milestone: "Second trimester begins. Fingerprints forming.",
  },
  14: {
    size: "Lemon",
    milestone: "Baby can make facial expressions. Sucking reflex present.",
  },
  16: {
    size: "Avocado",
    milestone: "Baby can hear sounds. Skeleton hardening.",
  },
  18: {
    size: "Sweet potato",
    milestone: "Baby is very active. Vernix coating forming.",
  },
  20: { size: "Banana", milestone: "Halfway point! Baby can hear your voice." },
  22: {
    size: "Papaya",
    milestone: "Eyebrows and eyelids visible. Grip reflex present.",
  },
  24: {
    size: "Ear of corn",
    milestone: "Lungs developing. Baby responds to touch.",
  },
  26: {
    size: "Scallion",
    milestone: "Eyes can open. Brain developing rapidly.",
  },
  28: {
    size: "Eggplant",
    milestone: "Third trimester begins. Baby can dream.",
  },
  30: {
    size: "Cabbage",
    milestone: "Baby gaining weight rapidly. Bones hardening.",
  },
  32: {
    size: "Squash",
    milestone: "Baby practicing breathing. Immune system developing.",
  },
  34: {
    size: "Butternut squash",
    milestone: "Baby is head-down. Lungs nearly mature.",
  },
  36: {
    size: "Honeydew melon",
    milestone: "Baby considered early term. Gaining 1oz/day.",
  },
  38: { size: "Leek", milestone: "Baby is full term. Ready for birth." },
  40: { size: "Watermelon", milestone: "Due date! Baby is fully developed." },
};

function getWeekInfo(week) {
  const keys = Object.keys(weekGuide)
    .map(Number)
    .sort((a, b) => a - b);
  let best = keys[0];
  for (const k of keys) {
    if (week >= k) best = k;
  }
  return (
    weekGuide[best] || {
      size: "Growing",
      milestone: "Your baby is developing beautifully.",
    }
  );
}

export default function PregnancyTrackerTab() {
  const { data: tracker, isLoading } = useGetPregnancyTracker();
  const setTracker = useSetPregnancyTracker();
  const [lmpInput, setLmpInput] = useState("");

  const handleSave = async () => {
    if (!lmpInput) {
      toast.error("Please enter your Last Menstrual Period date");
      return;
    }
    const lmpMs = new Date(lmpInput).getTime();
    if (Number.isNaN(lmpMs)) {
      toast.error("Invalid date");
      return;
    }
    const lmpNs = BigInt(lmpMs) * BigInt(1_000_000);
    const nowMs = Date.now();
    const weekNum = Math.floor((nowMs - lmpMs) / (7 * 24 * 60 * 60 * 1000)) + 1;
    const clampedWeek = Math.max(1, Math.min(42, weekNum));
    const info = getWeekInfo(clampedWeek);
    const weekDesc = `Week ${clampedWeek}: Baby is the size of a ${info.size}. ${info.milestone}`;
    try {
      await setTracker.mutateAsync({ lmpDate: lmpNs, weekDesc });
      toast.success("Pregnancy tracker updated!");
      setLmpInput("");
    } catch {
      toast.error("Failed to save tracker. Please try again.");
    }
  };

  // Calculate from saved tracker
  const savedLmpMs = tracker ? Number(tracker.lmpDate) / 1_000_000 : null;
  const savedEddMs = tracker
    ? Number(tracker.estimatedDueDate) / 1_000_000
    : null;
  const currentWeek = tracker ? Number(tracker.currentWeek) : null;
  const weekInfo = currentWeek ? getWeekInfo(currentWeek) : null;

  const formatDate = (ms) =>
    new Date(ms).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const progressPct = currentWeek
    ? Math.min(100, Math.round((currentWeek / 40) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="medical-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center">
            <Baby className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              Pregnancy Week Tracker
            </h3>
            <p className="text-xs text-muted-foreground">
              Enter your LMP to track your pregnancy
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="lmpDate">Last Menstrual Period (LMP) Date</Label>
            <Input
              id="lmpDate"
              type="date"
              value={lmpInput}
              onChange={(e) => setLmpInput(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="rounded-xl"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleSave}
              disabled={setTracker.isPending || !lmpInput}
              className="rounded-xl gap-2 w-full sm:w-auto"
            >
              {setTracker.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" /> Update Tracker
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tracker Results */}
      {isLoading ? (
        <div className="medical-card p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-2 text-sm">
            Loading tracker...
          </p>
        </div>
      ) : tracker && currentWeek !== null && weekInfo ? (
        <>
          {/* Week Progress */}
          <div className="medical-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground">
                Your Pregnancy Progress
              </h3>
              <Badge className="bg-pink-100 text-pink-700 border-pink-200 rounded-full">
                Week {currentWeek} of 40
              </Badge>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 mb-2">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.7 0.15 340), oklch(0.6 0.18 320))",
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mb-5">
              <span>Week 1</span>
              <span>{progressPct}% complete</span>
              <span>Week 40</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 text-center">
                <div className="text-2xl font-bold text-pink-600 font-display">
                  {currentWeek}
                </div>
                <div className="text-xs text-pink-500 font-medium mt-0.5">
                  Current Week
                </div>
              </div>
              {savedLmpMs && (
                <div className="p-4 bg-secondary/50 rounded-2xl text-center">
                  <div className="text-sm font-bold text-foreground font-display">
                    {formatDate(savedLmpMs)}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">
                    LMP Date
                  </div>
                </div>
              )}
              {savedEddMs && (
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                  <div className="text-sm font-bold text-primary font-display">
                    {formatDate(savedEddMs)}
                  </div>
                  <div className="text-xs text-primary/70 font-medium mt-0.5">
                    Estimated Due Date
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Baby Growth Guide */}
          <div className="medical-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="font-display font-semibold text-foreground">
                Week {currentWeek} – Baby Growth Guide
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-secondary/50 rounded-2xl flex items-center gap-3">
                <div className="text-3xl">🍑</div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Baby's Size
                  </div>
                  <div className="font-semibold text-foreground">
                    {weekInfo.size}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-secondary/50 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Milestone
                  </div>
                  <div className="text-sm text-foreground leading-relaxed">
                    {weekInfo.milestone}
                  </div>
                </div>
              </div>
            </div>
            {tracker.weekDescription && (
              <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100">
                <p className="text-sm text-pink-700 leading-relaxed">
                  {tracker.weekDescription}
                </p>
              </div>
            )}
          </div>

          {/* Trimester Info */}
          <div className="medical-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Trimester Overview
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "1st Trimester",
                  range: "Weeks 1–13",
                  active: currentWeek <= 13,
                },
                {
                  label: "2nd Trimester",
                  range: "Weeks 14–27",
                  active: currentWeek >= 14 && currentWeek <= 27,
                },
                {
                  label: "3rd Trimester",
                  range: "Weeks 28–40",
                  active: currentWeek >= 28,
                },
              ].map((t) => (
                <div
                  key={t.label}
                  className={`p-3 rounded-xl text-center border transition-all ${
                    t.active
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-secondary/30 border-border text-muted-foreground"
                  }`}
                >
                  <div
                    className={`text-xs font-bold mb-0.5 ${t.active ? "text-primary" : ""}`}
                  >
                    {t.label}
                  </div>
                  <div className="text-xs opacity-70">{t.range}</div>
                  {t.active && (
                    <Badge className="mt-1.5 text-xs bg-primary/20 text-primary border-primary/30 rounded-full">
                      Current
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="medical-card p-10 text-center">
          <Baby className="w-14 h-14 text-pink-300 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-foreground mb-2">
            Start Tracking Your Pregnancy
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Enter your Last Menstrual Period (LMP) date above to calculate your
            current pregnancy week, estimated due date, and view your baby's
            growth guide.
          </p>
        </div>
      )}
    </div>
  );
}
