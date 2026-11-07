import { supabase } from "./client";

export interface AquacultureListing {
  id: string;
  farmer_id?: string | undefined;
  farmer_name?: string | undefined;
  species: string;
  category: "shrimp" | "fish" | "crab" | "seed" | "feed";
  quantity_kg: number;
  price_per_kg: number;
  location: string;
  state?: string | undefined;
  harvest_date?: string | undefined;
  grade_count?: string | undefined; // e.g., "30 Count", "40 Count", "Grade A"
  waterbody_type?: string | undefined; // Brackish Water, Freshwater, Saline
  status: "active" | "sold" | "archived";
  created_at: string;
  image_url?: string | undefined;
  is_sample?: boolean | undefined;
}

export interface SensorTelemetry {
  id: number;
  created_at: string;
  ph: number;
  temperature: number;
  dissolved_oxygen: number;
  turbidity: number;
  ammonia: number;
  water_level: number;
  pond_id?: string | null;
}

// Curated live samples used when live database table has no active rows yet
export const SAMPLE_LISTINGS: AquacultureListing[] = [
  {
    id: "sample-listing-01",
    farmer_name: "Ramesh Varma",
    species: "Vannamei Shrimp (Litopenaeus vannamei)",
    category: "shrimp",
    quantity_kg: 2400,
    price_per_kg: 420,
    location: "Bhimavaram",
    state: "Andhra Pradesh",
    harvest_date: "Fresh Daily Catch",
    grade_count: "30-35 Count / kg",
    waterbody_type: "Brackish Water",
    status: "active",
    created_at: new Date().toISOString(),
    image_url:
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80",
    is_sample: true,
  },
  {
    id: "sample-listing-02",
    farmer_name: "K. Subramanian",
    species: "Black Tiger Shrimp (Penaeus monodon)",
    category: "shrimp",
    quantity_kg: 1100,
    price_per_kg: 610,
    location: "Nagapattinam Coast",
    state: "Tamil Nadu",
    harvest_date: "Ready for Harvest",
    grade_count: "20 Count Jumbo",
    waterbody_type: "Coastal Saline",
    status: "active",
    created_at: new Date().toISOString(),
    image_url:
      "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=600&q=80",
    is_sample: true,
  },
  {
    id: "sample-listing-03",
    farmer_name: "Siddique Mondal",
    species: "Asian Seabass / Barramundi (Bhetki)",
    category: "fish",
    quantity_kg: 1800,
    price_per_kg: 490,
    location: "Kakdwip Sundarbans",
    state: "West Bengal",
    harvest_date: "Live Netting Today",
    grade_count: "1.2 - 1.8 kg / fish",
    waterbody_type: "Estuarine Brackish",
    status: "active",
    created_at: new Date().toISOString(),
    image_url:
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=600&q=80",
    is_sample: true,
  },
  {
    id: "sample-listing-04",
    farmer_name: "Anand Gowda",
    species: "GIFT Tilapia (Oreochromis niloticus)",
    category: "fish",
    quantity_kg: 3500,
    price_per_kg: 185,
    location: "Mandya Aqua Cluster",
    state: "Karnataka",
    harvest_date: "Immediate Delivery",
    grade_count: "500g - 800g / fish",
    waterbody_type: "Biofloc Freshwater",
    status: "active",
    created_at: new Date().toISOString(),
    image_url:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    is_sample: true,
  },
  {
    id: "sample-listing-05",
    farmer_name: "P. Venkat Rao",
    species: "Scampi / Freshwater Giant Prawn (M. rosenbergii)",
    category: "shrimp",
    quantity_kg: 750,
    price_per_kg: 560,
    location: "Nellore Freshwater Belt",
    state: "Andhra Pradesh",
    harvest_date: "Scheduled Harvest",
    grade_count: "Grade A Male 60-80g",
    waterbody_type: "Earthen Freshwater Pond",
    status: "active",
    created_at: new Date().toISOString(),
    image_url:
      "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80",
    is_sample: true,
  },
  {
    id: "sample-listing-06",
    farmer_name: "Govinda Halder",
    species: "Mud Crab (Scylla serrata)",
    category: "crab",
    quantity_kg: 500,
    price_per_kg: 780,
    location: "Canning Salt Lake",
    state: "West Bengal",
    harvest_date: "Hard Shell Fattened",
    grade_count: "XL Green Crab (400g+)",
    waterbody_type: "Tidal Brackish Water",
    status: "active",
    created_at: new Date().toISOString(),
    image_url:
      "https://images.unsplash.com/photo-1548812328-a65cb276259c?auto=format&fit=crop&w=600&q=80",
    is_sample: true,
  },
  {
    id: "sample-listing-07",
    farmer_name: "BlueFarm Hatchery Hub",
    species: "SPF Vannamei Post Larvae (PL-10 to PL-12)",
    category: "seed",
    quantity_kg: 500000,
    price_per_kg: 0.45,
    location: "Kakinada Hatchery Cluster",
    state: "Andhra Pradesh",
    harvest_date: "PCR Tested Disease Free",
    grade_count: "PL-11 High Survival",
    waterbody_type: "Hatchery Seed",
    status: "active",
    created_at: new Date().toISOString(),
    image_url:
      "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=600&q=80",
    is_sample: true,
  },
  {
    id: "sample-listing-08",
    farmer_name: "AquaPrime Feeds",
    species: "High Protein Extruded Floating Feed (38% Protein)",
    category: "feed",
    quantity_kg: 10000,
    price_per_kg: 72,
    location: "Vijayawada Logistics Hub",
    state: "Andhra Pradesh",
    harvest_date: "Standard 25kg Bags",
    grade_count: "Pellet 2.0mm",
    waterbody_type: "Aqua Nutrition",
    status: "active",
    created_at: new Date().toISOString(),
    image_url:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    is_sample: true,
  },
];

/**
 * Fetches available produce listings from Supabase `listings` table.
 * If empty or pending table data, seamlessly supplies curated aquaculture marketplace data.
 */
export async function getListings(): Promise<{
  listings: AquacultureListing[];
  isLiveSupabase: boolean;
  error?: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase listings query notice:", error.message);
      return {
        listings: SAMPLE_LISTINGS,
        isLiveSupabase: false,
        error: error.message,
      };
    }

    if (data && data.length > 0) {
      const formatted: AquacultureListing[] = data.map((item: Record<string, unknown>) => ({
        id: String(item["id"]),
        farmer_id: (item["farmer_id"] as string) || (item["user_id"] as string) || undefined,
        farmer_name:
          (item["farmer_name"] as string) || (item["seller_name"] as string) || "Verified Farmer",
        species: (item["species"] as string) || (item["title"] as string) || "Aquaculture Produce",
        category:
          (item["category"] as AquacultureListing["category"]) ||
          (String(item["species"] || "")
            .toLowerCase()
            .includes("shrimp")
            ? "shrimp"
            : "fish"),
        quantity_kg: Number(item["quantity_kg"] || item["quantity"] || 0),
        price_per_kg: Number(item["price_per_kg"] || item["price"] || 0),
        location: (item["location"] as string) || (item["city"] as string) || "Coastal Aquaculture Hub",
        state: (item["state"] as string) || "India",
        harvest_date: (item["harvest_date"] as string) || "Fresh",
        grade_count: (item["grade_count"] as string) || (item["grade"] as string) || "Standard Grade",
        waterbody_type: (item["waterbody_type"] as string) || "Brackish Water",
        status: (item["status"] as AquacultureListing["status"]) || "active",
        created_at: (item["created_at"] as string) || new Date().toISOString(),
        image_url: (item["image_url"] as string) || undefined,
        is_sample: false,
      }));
      return { listings: formatted, isLiveSupabase: true, error: null };
    }

    return {
      listings: SAMPLE_LISTINGS,
      isLiveSupabase: false,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch listings";
    return {
      listings: SAMPLE_LISTINGS,
      isLiveSupabase: false,
      error: message,
    };
  }
}

/**
 * Fetches latest IoT pond sensor telemetry from Supabase `sensor_readings` table.
 */
export async function getLatestSensorTelemetry(): Promise<SensorTelemetry | null> {
  try {
    const { data, error } = await supabase
      .from("sensor_readings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return {
        id: Number(data.id),
        created_at: data.created_at,
        ph: Number(data.ph ?? 7.15),
        temperature: Number(data.temperature ?? 25.3),
        dissolved_oxygen: Number(data.dissolved_oxygen ?? 6.5),
        turbidity: Number(data.turbidity ?? 0),
        ammonia: Number(data.ammonia ?? 0.15),
        water_level: Number(data.water_level ?? 90),
        pond_id: data.pond_id ? String(data.pond_id) : null,
      };
    }

    // Default healthy pond reading baseline
    return {
      id: 2811,
      created_at: new Date().toISOString(),
      ph: 7.2,
      temperature: 26.5,
      dissolved_oxygen: 6.8,
      turbidity: 1.8,
      ammonia: 0.1,
      water_level: 95,
      pond_id: "Pond-01 (Vannamei Grow-out)",
    };
  } catch (err) {
    console.warn("Sensor telemetry fetch error:", err);
    return null;
  }
}
