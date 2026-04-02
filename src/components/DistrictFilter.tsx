import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

const UGANDA_DISTRICTS = [
  "Kampala", "Wakiso", "Mukono", "Jinja", "Mbale", "Gulu", "Lira", "Soroti",
  "Mbarara", "Kabale", "Fort Portal", "Kasese", "Masaka", "Entebbe", "Hoima",
  "Arua", "Tororo", "Iganga", "Mityana", "Luweero", "Mpigi", "Kayunga",
  "Masindi", "Pallisa", "Kumi", "Kapchorwa", "Moroto", "Kotido", "Kitgum",
  "Pader", "Nebbi", "Adjumani", "Moyo", "Yumbe", "Koboko", "Bundibugyo",
  "Ntungamo", "Bushenyi", "Rukungiri", "Kanungu", "Kisoro", "Rakai",
];

interface DistrictFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const DistrictFilter = ({ value, onChange }: DistrictFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48 bg-card">
          <SelectValue placeholder="All Districts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Districts</SelectItem>
          {UGANDA_DISTRICTS.map((d) => (
            <SelectItem key={d} value={d}>{d}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DistrictFilter;
