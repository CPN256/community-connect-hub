import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Loader2, Heart } from "lucide-react";

const SafeCheckinButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [contactCount, setContactCount] = useState(0);

  const handleCheckin = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Sign in to notify your emergency contacts.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      let lat: number | null = null, lng: number | null = null;
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 })
        );
        lat = pos.coords.latitude; lng = pos.coords.longitude;
      } catch { /* GPS optional */ }

      const { error } = await supabase.from("safety_checkins" as any).insert({
        user_id: user.id,
        message: "I'm safe",
        latitude: lat,
        longitude: lng,
      });
      if (error) throw error;

      const { data: contacts } = await supabase
        .from("emergency_contacts" as any)
        .select("id")
        .eq("user_id", user.id);
      setContactCount((contacts as any[] | null)?.length ?? 0);
      setOpenModal(true);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleCheckin}
        disabled={loading}
        size="lg"
        className="bg-success hover:bg-success/90 text-success-foreground font-bold shadow-elevated"
      >
        {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <ShieldCheck className="h-5 w-5 mr-2" />}
        I'm Safe
      </Button>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="mx-auto bg-success/10 p-4 rounded-full w-fit mb-3">
              <Heart className="h-10 w-10 text-success" />
            </div>
            <DialogTitle className="font-heading text-2xl">Check-in logged!</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            {contactCount > 0
              ? `Your ${contactCount} emergency contact${contactCount === 1 ? "" : "s"} will see your safe status on your profile.`
              : "Add emergency contacts in your profile so they can see your safety status."}
          </p>
          <Button onClick={() => setOpenModal(false)} className="mt-2">Done</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SafeCheckinButton;
