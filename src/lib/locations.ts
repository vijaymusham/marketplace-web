export type LocationCity = {
  name: string;
  neighbourhoods: string[];
};

export type LocationState = {
  name: string;
  cities: LocationCity[];
};

/** Cascading State → City → Neighbourhood for the sell form list picker. */
export const locationTree: LocationState[] = [
  {
    name: "Maharashtra",
    cities: [
      {
        name: "Mumbai",
        neighbourhoods: [
          "Andheri",
          "Bandra",
          "Powai",
          "Worli",
          "Colaba",
          "Thane",
          "Navi Mumbai",
        ],
      },
      {
        name: "Pune",
        neighbourhoods: [
          "Hinjewadi",
          "Kothrud",
          "Viman Nagar",
          "Baner",
          "Koregaon Park",
          "Hadapsar",
        ],
      },
      {
        name: "Nashik",
        neighbourhoods: ["College Road", "Gangapur Road", "Panchavati", "CIDCO"],
      },
    ],
  },
  {
    name: "Gujarat",
    cities: [
      {
        name: "Surat",
        neighbourhoods: ["Adajan", "Vesu", "Katargam", "Varachha"],
      },
      {
        name: "Ahmedabad",
        neighbourhoods: ["SG Highway", "Satellite", "Navrangpura", "Bopal"],
      },
    ],
  },
  {
    name: "Karnataka",
    cities: [
      {
        name: "Bengaluru",
        neighbourhoods: [
          "Koramangala",
          "Whitefield",
          "Indiranagar",
          "HSR Layout",
          "Jayanagar",
          "Electronic City",
        ],
      },
    ],
  },
  {
    name: "Telangana",
    cities: [
      {
        name: "Hyderabad",
        neighbourhoods: [
          "Hitec City",
          "Gachibowli",
          "Banjara Hills",
          "Secunderabad",
          "Madhapur",
        ],
      },
    ],
  },
  {
    name: "Delhi",
    cities: [
      {
        name: "Delhi",
        neighbourhoods: [
          "Connaught Place",
          "Dwarka",
          "Rohini",
          "Saket",
          "Karol Bagh",
          "Lajpat Nagar",
        ],
      },
    ],
  },
  {
    name: "Tamil Nadu",
    cities: [
      {
        name: "Chennai",
        neighbourhoods: ["OMR", "Anna Nagar", "Adyar", "T Nagar", "Velachery"],
      },
      {
        name: "Coimbatore",
        neighbourhoods: ["RS Puram", "Peelamedu", "Gandhipuram", "Saibaba Colony"],
      },
    ],
  },
  {
    name: "West Bengal",
    cities: [
      {
        name: "Kolkata",
        neighbourhoods: [
          "Salt Lake",
          "Park Street",
          "Howrah",
          "New Town",
          "Ballygunge",
        ],
      },
    ],
  },
  {
    name: "Rajasthan",
    cities: [
      {
        name: "Jaipur",
        neighbourhoods: ["Malviya Nagar", "Vaishali Nagar", "C-Scheme", "Mansarovar"],
      },
    ],
  },
  {
    name: "Uttar Pradesh",
    cities: [
      {
        name: "Lucknow",
        neighbourhoods: ["Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar"],
      },
      {
        name: "Kanpur",
        neighbourhoods: ["Swaroop Nagar", "Kakadeo", "Civil Lines", "Kalyanpur"],
      },
    ],
  },
  {
    name: "Madhya Pradesh",
    cities: [
      {
        name: "Indore",
        neighbourhoods: ["Vijay Nagar", "Palasia", "Rajwada", "Bhawarkuan"],
      },
      {
        name: "Bhopal",
        neighbourhoods: ["MP Nagar", "Arera Colony", "Kolar Road", "New Market"],
      },
    ],
  },
  {
    name: "Andaman & Nicobar Islands",
    cities: [
      {
        name: "Port Blair",
        neighbourhoods: [
          "Aberdeen Bazar",
          "Junglighat",
          "Delanipur",
          "Haddo",
          "Carbyn's Cove",
        ],
      },
    ],
  },
];

export function getCitiesForState(stateName: string): LocationCity[] {
  return locationTree.find((s) => s.name === stateName)?.cities ?? [];
}

export function getNeighbourhoods(stateName: string, cityName: string): string[] {
  return (
    getCitiesForState(stateName).find((c) => c.name === cityName)?.neighbourhoods ??
    []
  );
}
