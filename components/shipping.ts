import { SIZE_OPTIONS } from "./products";
import type { SizeSystem } from "./products";

export type ShippingRegion = "GB" | "EU" | "US" | "CA" | "ROW";
export type ShippingDestination = "GB" | "INT";
export type UkService = "tracked48" | "tracked24";
export type ParcelKind = "bag" | "medium" | "large";

export type ShippingParcel = {
  kind: ParcelKind;
  pairs: number;
  productWeight: number;
  packagingWeight: number;
  packagingCost: number;
  totalWeight: number;
  postage: number;
};

export type ShippingCalculationConfig = {
  mediumCapacity: number;
  largeCapacity: number;
  bagWeight: number;
  mediumWeight: number;
  largeWeight: number;
  mediumCost: number;
  largeCost: number;
  destination: ShippingDestination;
  service: UkService;
  country: string;
};

export type OrderLineForShipping = {
  sizeSystem: SizeSystem;
  size: string;
  quantity: number;
};

export const UK_RATES = {
  tracked48: {
    bag: [[2000, 365]],
    medium: [[2000, 555], [10000, 735], [20000, 1185]],
  },
  tracked24: {
    bag: [[2000, 465]],
    medium: [[2000, 655], [10000, 855], [20000, 1385]],
  },
} as const;

export const INT_TRACKED_WEIGHTS = [250, 500, 750, 1000, 1250, 1500, 2000];
export const INT_HEAVIER_WEIGHTS = [
  1000,
  2000,
  3000,
  4000,
  5000,
  7500,
  10000,
  15000,
  20000,
];

// Royal Mail online prices effective from 7 April 2026.
// Recheck this table whenever Royal Mail publishes a later price guide.
const INTERNATIONAL_DATA = `
France|990,1085,1110,1115,1115,1115,1115|1175,1175,1320,1320,1320,1580,1580,2035,2035
Germany|815,940,995,995,995,995,995|1170,1170,1260,1370,1435,1575,1935,2980,3745
Ireland|880,880,880,880,1030,1030,1030|1110,1110,1130,1210,1340,1540,1670,1885,1995
Belgium|965,1060,1115,1190,1230,1230,1300|1300,1610,1865,3360,3665,5445,5810,7860,9510
Italy|965,1060,1115,1190,1230,1230,1300|1405,1695,1980,2520,2800,3190,3750,5540,6790
Netherlands|920,1010,1065,1085,1125,1125,1190|1235,1370,1585,2855,3115,4630,6340,7900,9500
Poland|985,1070,1130,1200,1245,1245,1315|1355,1640,1900,2910,3740,5445,7455,8565,10925
Romania|1415,1500,1560,1630,1675,1675,1745|1785,2070,2330,3290,4170,5445,7455,8565,10925
Spain|960,1020,1075,1140,1185,1185,1250|1480,1710,1980,2450,2900,3800,4600,5500,6000
Sweden|965,1060,1115,1190,1230,1230,1300|1300,1610,1865,2995,3665,5340,7310,8360,10710
Norway|1090,1250,1305,1405,1500,1560,1605|1665,2335,2730,3455,4065,5685,7765,9985,12960
Switzerland|1195,1195,1225,1320,1375,1430,1455|1635,2155,2680,3385,3990,5000,5900,7500,9400
Turkey|1165,1390,1450,1565,1675,1745,1795|1630,2325,2735,3485,4125,5800,7960,10200,11700
Rest of Europe Zone 1|895,1005,1070,1095,1180,1180,1200|1430,1520,1735,1785,1840,2405,2925,3965,4945
Rest of Europe Zone 2|985,1070,1145,1210,1245,1245,1315|1355,1640,1900,3425,3740,5555,6855,7865,8525
Rest of Europe Zone 3|1215,1440,1500,1615,1725,1795,1845|1730,2425,2835,3585,4225,5900,8060,10300,11800
USA|1217,1425,1753,1753,2020,2020,2020|2520,3150,3240,3980,4550,5950,7600,11070,13300
Brazil|1230,1560,1920,2230,2515,2615,2805|2585,2880,2985,3890,4840,6535,9975,12595,17340
Canada|1444,1444,1701,2027,2295,2452,2452|2410,2505,2940,3285,3790,4825,6325,6500,6880
China|1140,1315,1315,1315,1775,1775,1775|2535,2825,3345,3915,4695,5405,6780,9350,11000
Hong Kong|1155,1435,1715,1990,2240,2540,2725|2635,2940,3125,3970,4690,6035,7975,10595,13340
India|1250,1580,1850,2145,2415,2510,2690|2585,2880,3250,3860,4940,5655,6975,8800,10945
Japan|1245,1580,1850,2145,2415,2710,2910|2740,3055,3135,3790,4440,6035,7475,10895,12840
Thailand|1295,1570,1825,2010,2245,2480,2660|2740,3055,3485,4175,5235,7055,9990,13570,18705
Rest of World Zone 1|1440,1815,2125,2465,2775,2885,2990|2790,3110,3555,4255,5335,7185,10775,13820,19050
Australia|1235,1585,1840,1940,2510,2510,2510|2750,3510,3885,4550,4950,6395,8030,12340,17000
New Zealand|1530,1630,2025,2025,2720,3005,3205|2750,3650,4040,4600,5500,7000,9120,12835,17715
Rest of World Zone 2|1490,1915,2375,2790,3185,3490,3755|2970,3790,4195,4660,5595,7625,10575,14320,18470
`.trim();

export const INTERNATIONAL_RATES: Record<
  string,
  { tracked: number[]; heavier: number[] }
> = Object.fromEntries(
  INTERNATIONAL_DATA.split("\n").map((line) => {
    const [country, tracked, heavier] = line.split("|");
    return [
      country,
      {
        tracked: tracked.split(",").map(Number),
        heavier: heavier.split(",").map(Number),
      },
    ];
  })
);

export const INTERNATIONAL_COUNTRIES = Object.keys(INTERNATIONAL_RATES);


export type ShippingCountry = {
  code: string;
  name: string;
  region: ShippingRegion;
  rateKey: string;
};

export const SHIPPING_COUNTRIES: readonly ShippingCountry[] = [
  {
    "code": "GB",
    "name": "United Kingdom",
    "region": "GB",
    "rateKey": "GB"
  },
  {
    "code": "AF",
    "name": "Afghanistan",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "AL",
    "name": "Albania",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "DZ",
    "name": "Algeria",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "AD",
    "name": "Andorra",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "AO",
    "name": "Angola",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "AG",
    "name": "Antigua and Barbuda",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "AR",
    "name": "Argentina",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "AM",
    "name": "Armenia",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "AU",
    "name": "Australia",
    "region": "ROW",
    "rateKey": "Australia"
  },
  {
    "code": "AT",
    "name": "Austria",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "AZ",
    "name": "Azerbaijan",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "BS",
    "name": "Bahamas",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "BH",
    "name": "Bahrain",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "BD",
    "name": "Bangladesh",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "BB",
    "name": "Barbados",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "BY",
    "name": "Belarus",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "BE",
    "name": "Belgium",
    "region": "EU",
    "rateKey": "Belgium"
  },
  {
    "code": "BZ",
    "name": "Belize",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "BJ",
    "name": "Benin",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "BT",
    "name": "Bhutan",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "BO",
    "name": "Bolivia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "BA",
    "name": "Bosnia and Herzegovina",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "BW",
    "name": "Botswana",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "BR",
    "name": "Brazil",
    "region": "ROW",
    "rateKey": "Brazil"
  },
  {
    "code": "BN",
    "name": "Brunei",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "BG",
    "name": "Bulgaria",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "BF",
    "name": "Burkina Faso",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "BI",
    "name": "Burundi",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "CV",
    "name": "Cabo Verde",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "KH",
    "name": "Cambodia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "CM",
    "name": "Cameroon",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "CA",
    "name": "Canada",
    "region": "CA",
    "rateKey": "Canada"
  },
  {
    "code": "CF",
    "name": "Central African Republic",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "TD",
    "name": "Chad",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "CL",
    "name": "Chile",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "CN",
    "name": "China",
    "region": "ROW",
    "rateKey": "China"
  },
  {
    "code": "CO",
    "name": "Colombia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "KM",
    "name": "Comoros",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "CR",
    "name": "Costa Rica",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "HR",
    "name": "Croatia",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "CU",
    "name": "Cuba",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "CY",
    "name": "Cyprus",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "CZ",
    "name": "Czechia",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "CI",
    "name": "Côte d’Ivoire",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "CD",
    "name": "Democratic Republic of the Congo",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "DK",
    "name": "Denmark",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 1"
  },
  {
    "code": "DJ",
    "name": "Djibouti",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "DM",
    "name": "Dominica",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "DO",
    "name": "Dominican Republic",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "EC",
    "name": "Ecuador",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "EG",
    "name": "Egypt",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "SV",
    "name": "El Salvador",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "GQ",
    "name": "Equatorial Guinea",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "ER",
    "name": "Eritrea",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "EE",
    "name": "Estonia",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "SZ",
    "name": "Eswatini",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "ET",
    "name": "Ethiopia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "FJ",
    "name": "Fiji",
    "region": "ROW",
    "rateKey": "Rest of World Zone 2"
  },
  {
    "code": "FI",
    "name": "Finland",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "FR",
    "name": "France",
    "region": "EU",
    "rateKey": "France"
  },
  {
    "code": "GA",
    "name": "Gabon",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "GM",
    "name": "Gambia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "GE",
    "name": "Georgia",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "DE",
    "name": "Germany",
    "region": "EU",
    "rateKey": "Germany"
  },
  {
    "code": "GH",
    "name": "Ghana",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "GR",
    "name": "Greece",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "GL",
    "name": "Greenland",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "GD",
    "name": "Grenada",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "GT",
    "name": "Guatemala",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "GN",
    "name": "Guinea",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "GW",
    "name": "Guinea-Bissau",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "GY",
    "name": "Guyana",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "HT",
    "name": "Haiti",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "HN",
    "name": "Honduras",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "HK",
    "name": "Hong Kong",
    "region": "ROW",
    "rateKey": "Hong Kong"
  },
  {
    "code": "HU",
    "name": "Hungary",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "IS",
    "name": "Iceland",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "IN",
    "name": "India",
    "region": "ROW",
    "rateKey": "India"
  },
  {
    "code": "ID",
    "name": "Indonesia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "IR",
    "name": "Iran",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "IQ",
    "name": "Iraq",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "IE",
    "name": "Ireland",
    "region": "EU",
    "rateKey": "Ireland"
  },
  {
    "code": "IL",
    "name": "Israel",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "IT",
    "name": "Italy",
    "region": "EU",
    "rateKey": "Italy"
  },
  {
    "code": "JM",
    "name": "Jamaica",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "JP",
    "name": "Japan",
    "region": "ROW",
    "rateKey": "Japan"
  },
  {
    "code": "JO",
    "name": "Jordan",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "KZ",
    "name": "Kazakhstan",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "KE",
    "name": "Kenya",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "KI",
    "name": "Kiribati",
    "region": "ROW",
    "rateKey": "Rest of World Zone 2"
  },
  {
    "code": "XK",
    "name": "Kosovo",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "KW",
    "name": "Kuwait",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "KG",
    "name": "Kyrgyzstan",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "LA",
    "name": "Laos",
    "region": "ROW",
    "rateKey": "Rest of World Zone 2"
  },
  {
    "code": "LV",
    "name": "Latvia",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "LB",
    "name": "Lebanon",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "LS",
    "name": "Lesotho",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "LR",
    "name": "Liberia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "LY",
    "name": "Libya",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "LI",
    "name": "Liechtenstein",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "LT",
    "name": "Lithuania",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "LU",
    "name": "Luxembourg",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "MO",
    "name": "Macao",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MG",
    "name": "Madagascar",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MW",
    "name": "Malawi",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MY",
    "name": "Malaysia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MV",
    "name": "Maldives",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "ML",
    "name": "Mali",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MT",
    "name": "Malta",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "MH",
    "name": "Marshall Islands",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MQ",
    "name": "Martinique",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MR",
    "name": "Mauritania",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MU",
    "name": "Mauritius",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MX",
    "name": "Mexico",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "FM",
    "name": "Micronesia, Federated States of",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MD",
    "name": "Moldova",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "MC",
    "name": "Monaco",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 1"
  },
  {
    "code": "MN",
    "name": "Mongolia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "ME",
    "name": "Montenegro",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "MA",
    "name": "Morocco",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MZ",
    "name": "Mozambique",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MM",
    "name": "Myanmar",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "NA",
    "name": "Namibia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "NR",
    "name": "Nauru",
    "region": "ROW",
    "rateKey": "Rest of World Zone 2"
  },
  {
    "code": "NP",
    "name": "Nepal",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "NL",
    "name": "Netherlands",
    "region": "EU",
    "rateKey": "Netherlands"
  },
  {
    "code": "NZ",
    "name": "New Zealand",
    "region": "ROW",
    "rateKey": "New Zealand"
  },
  {
    "code": "NI",
    "name": "Nicaragua",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "NE",
    "name": "Niger",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "NG",
    "name": "Nigeria",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "KP",
    "name": "North Korea",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "MK",
    "name": "North Macedonia",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "NO",
    "name": "Norway",
    "region": "EU",
    "rateKey": "Norway"
  },
  {
    "code": "OM",
    "name": "Oman",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "PK",
    "name": "Pakistan",
    "region": "ROW",
    "rateKey": "Pakistan"
  },
  {
    "code": "PW",
    "name": "Palau",
    "region": "ROW",
    "rateKey": "Rest of World Zone 2"
  },
  {
    "code": "PS",
    "name": "Palestine",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "PA",
    "name": "Panama",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "PG",
    "name": "Papua New Guinea",
    "region": "ROW",
    "rateKey": "Rest of World Zone 2"
  },
  {
    "code": "PY",
    "name": "Paraguay",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "PE",
    "name": "Peru",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "PH",
    "name": "Philippines",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "PL",
    "name": "Poland",
    "region": "EU",
    "rateKey": "Poland"
  },
  {
    "code": "PT",
    "name": "Portugal",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "QA",
    "name": "Qatar",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "CG",
    "name": "Republic of the Congo",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "RO",
    "name": "Romania",
    "region": "EU",
    "rateKey": "Romania"
  },
  {
    "code": "RU",
    "name": "Russia",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "RW",
    "name": "Rwanda",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "BL",
    "name": "Saint Barthélemy",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "KN",
    "name": "Saint Kitts and Nevis",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "LC",
    "name": "Saint Lucia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "VC",
    "name": "Saint Vincent and the Grenadines",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "WS",
    "name": "Samoa",
    "region": "ROW",
    "rateKey": "Rest of World Zone 2"
  },
  {
    "code": "SM",
    "name": "San Marino",
    "region": "EU",
    "rateKey": "Italy"
  },
  {
    "code": "ST",
    "name": "Sao Tome and Principe",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "SA",
    "name": "Saudi Arabia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "SN",
    "name": "Senegal",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "RS",
    "name": "Serbia",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "SC",
    "name": "Seychelles",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "SL",
    "name": "Sierra Leone",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "SG",
    "name": "Singapore",
    "region": "ROW",
    "rateKey": "Rest of World Zone 2"
  },
  {
    "code": "SK",
    "name": "Slovakia",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "SI",
    "name": "Slovenia",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 2"
  },
  {
    "code": "SB",
    "name": "Solomon Islands",
    "region": "ROW",
    "rateKey": "Rest of World Zone 2"
  },
  {
    "code": "SO",
    "name": "Somalia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "ZA",
    "name": "South Africa",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "KR",
    "name": "South Korea",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "SS",
    "name": "South Sudan",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "ES",
    "name": "Spain",
    "region": "EU",
    "rateKey": "Spain"
  },
  {
    "code": "LK",
    "name": "Sri Lanka",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "SD",
    "name": "Sudan",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "SR",
    "name": "Suriname",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "SE",
    "name": "Sweden",
    "region": "EU",
    "rateKey": "Sweden"
  },
  {
    "code": "CH",
    "name": "Switzerland",
    "region": "EU",
    "rateKey": "Switzerland"
  },
  {
    "code": "SY",
    "name": "Syria",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "TW",
    "name": "Taiwan",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "TJ",
    "name": "Tajikistan",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "TZ",
    "name": "Tanzania",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "TH",
    "name": "Thailand",
    "region": "ROW",
    "rateKey": "Thailand"
  },
  {
    "code": "TL",
    "name": "Timor-Leste",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "TG",
    "name": "Togo",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "TO",
    "name": "Tonga",
    "region": "ROW",
    "rateKey": "Rest of World Zone 2"
  },
  {
    "code": "TT",
    "name": "Trinidad and Tobago",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "TN",
    "name": "Tunisia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "TM",
    "name": "Turkmenistan",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "TV",
    "name": "Tuvalu",
    "region": "ROW",
    "rateKey": "Rest of World Zone 2"
  },
  {
    "code": "TR",
    "name": "Türkiye",
    "region": "EU",
    "rateKey": "Turkey"
  },
  {
    "code": "UG",
    "name": "Uganda",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "UA",
    "name": "Ukraine",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "AE",
    "name": "United Arab Emirates",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "US",
    "name": "United States",
    "region": "US",
    "rateKey": "USA"
  },
  {
    "code": "UY",
    "name": "Uruguay",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "UZ",
    "name": "Uzbekistan",
    "region": "EU",
    "rateKey": "Rest of Europe Zone 3"
  },
  {
    "code": "VU",
    "name": "Vanuatu",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "VA",
    "name": "Vatican City",
    "region": "EU",
    "rateKey": "Italy"
  },
  {
    "code": "VE",
    "name": "Venezuela",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "VN",
    "name": "Vietnam",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "YE",
    "name": "Yemen",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "ZM",
    "name": "Zambia",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  },
  {
    "code": "ZW",
    "name": "Zimbabwe",
    "region": "ROW",
    "rateKey": "Rest of World Zone 1"
  }
] as const;

export function getShippingCountry(code: string) {
  const normalized = code.toUpperCase();
  return SHIPPING_COUNTRIES.find((country) => country.code === normalized) ?? null;
}

export function getShippingCountries(
  region?: ShippingRegion
): ShippingCountry[] {
  if (!region) return [...SHIPPING_COUNTRIES];
  return SHIPPING_COUNTRIES.filter((country) => country.region === region);
}

export function getSizeWeight(sizeSystem: SizeSystem, size: string): number {
  const option = SIZE_OPTIONS.find((item) =>
    sizeSystem === "UK"
      ? item.uk === size
      : sizeSystem === "EU"
        ? item.eu === size
        : item.us === size
  );

  return option?.weightGrams ?? 0;
}

export function getPairWeights(lines: OrderLineForShipping[]): number[] {
  return lines.flatMap((line) =>
    Array.from({ length: Math.max(0, Math.floor(line.quantity)) }, () =>
      getSizeWeight(line.sizeSystem, line.size)
    )
  );
}

function getUkPrice(kind: ParcelKind, grams: number, service: UkService) {
  const bands = kind === "bag" ? UK_RATES[service].bag : UK_RATES[service].medium;
  return bands.find(([max]) => grams <= max)?.[1] ?? null;
}

export function getInternationalPrice(
  country: string,
  grams: number,
  kind: ParcelKind
) {
  const countryInfo = getShippingCountry(country);
  const rateKey = countryInfo?.rateKey ?? country;
  const rates = INTERNATIONAL_RATES[rateKey];
  if (!rates) return null;

  if (kind === "bag") {
    const index = INT_TRACKED_WEIGHTS.findIndex((max) => grams <= max);
    return index < 0 ? null : rates.tracked[index];
  }

  const index = INT_HEAVIER_WEIGHTS.findIndex((max) => grams <= max);
  return index < 0 ? null : rates.heavier[index];
}

function capacityFor(
  kind: ParcelKind,
  config: ShippingCalculationConfig
) {
  if (kind === "bag") return 1;
  if (kind === "medium") return config.mediumCapacity;
  return config.largeCapacity;
}

function packagingWeightFor(
  kind: ParcelKind,
  config: ShippingCalculationConfig
) {
  if (kind === "bag") return config.bagWeight;
  if (kind === "medium") return config.mediumWeight;
  return config.largeWeight;
}

function packagingCostFor(
  kind: ParcelKind,
  config: ShippingCalculationConfig
) {
  if (kind === "bag") return 0;
  if (kind === "medium") return config.mediumCost;
  return config.largeCost;
}

function makeParcel(
  kind: ParcelKind,
  weights: number[],
  config: ShippingCalculationConfig
): ShippingParcel | null {
  const productWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const packagingWeight = packagingWeightFor(kind, config);
  const packagingCost = packagingCostFor(kind, config);
  const totalWeight = productWeight + packagingWeight;

  const postage =
    config.destination === "GB"
      ? getUkPrice(kind, totalWeight, config.service)
      : getInternationalPrice(config.country, totalWeight, kind);

  if (postage === null) return null;

  return {
    kind,
    pairs: weights.length,
    productWeight,
    packagingWeight,
    packagingCost,
    totalWeight,
    postage,
  };
}

function packWithCounts(
  weights: number[],
  bagCount: number,
  mediumCount: number,
  largeCount: number,
  config: ShippingCalculationConfig
): ShippingParcel[] | null {
  const capacity =
    bagCount +
    mediumCount * capacityFor("medium", config) +
    largeCount * capacityFor("large", config);

  if (capacity < weights.length) return null;

  const bins: { kind: ParcelKind; weights: number[]; capacity: number }[] = [
    ...Array.from({ length: largeCount }, () => ({
      kind: "large" as const,
      weights: [] as number[],
      capacity: capacityFor("large", config),
    })),
    ...Array.from({ length: mediumCount }, () => ({
      kind: "medium" as const,
      weights: [] as number[],
      capacity: capacityFor("medium", config),
    })),
    ...Array.from({ length: bagCount }, () => ({
      kind: "bag" as const,
      weights: [] as number[],
      capacity: 1,
    })),
  ];

  const sorted = [...weights].sort((a, b) => b - a);

  for (const weight of sorted) {
    let placed = false;

    for (const bin of bins) {
      if (bin.weights.length >= bin.capacity) continue;
      const candidate = [...bin.weights, weight];
      const provisional = makeParcel(bin.kind, candidate, config);
      if (!provisional) continue;

      bin.weights.push(weight);
      placed = true;
      break;
    }

    if (!placed) return null;
  }

  const parcels: ShippingParcel[] = [];
  for (const bin of bins) {
    if (!bin.weights.length) continue;
    const parcel = makeParcel(bin.kind, bin.weights, config);
    if (!parcel) return null;
    parcels.push(parcel);
  }

  return parcels;
}

export function calculateShippingPlan(
  weights: number[],
  config: ShippingCalculationConfig
): ShippingParcel[] {
  if (!weights.length) return [];

  const pairCount = weights.length;
  const maxLarge = Math.ceil(pairCount / Math.max(1, config.largeCapacity));
  const maxMedium = Math.ceil(pairCount / Math.max(1, config.mediumCapacity));

  let best: ShippingParcel[] | null = null;
  let bestTotal = Infinity;

  // For one pair the SOMSOA bag is always the intended package.
  if (pairCount === 1) {
    return packWithCounts(weights, 1, 0, 0, config) ?? [];
  }

  // Compare practical combinations of bags, medium cartons and large cartons.
  for (let largeCount = 0; largeCount <= maxLarge; largeCount += 1) {
    for (let mediumCount = 0; mediumCount <= maxMedium; mediumCount += 1) {
      const usedCartonCapacity =
        largeCount * config.largeCapacity +
        mediumCount * config.mediumCapacity;

      const remainingPairs = Math.max(0, pairCount - usedCartonCapacity);
      const bagCount = remainingPairs;

      if (
        usedCartonCapacity === 0 &&
        bagCount === 0
      ) {
        continue;
      }

      const parcels = packWithCounts(
        weights,
        bagCount,
        mediumCount,
        largeCount,
        config
      );

      if (!parcels) continue;

      const total = parcels.reduce(
        (sum, parcel) => sum + parcel.postage + parcel.packagingCost,
        0
      );

      if (total < bestTotal) {
        bestTotal = total;
        best = parcels;
      }
    }
  }

  return best ?? [];
}
