/**
 * Curated vehicle database for the Car Picker.
 * Structure: { Make: { Model: [ { name, front, rear? } ] } }
 * front/rear are tyre dimension strings like "205/55R16".
 * If rear is omitted it equals front (non-staggered).
 */
const VEHICLE_DB = {
  Abarth: {
    "124 Spider": [
      { name: "1.4 Turbo (170 hp)", front: "205/45R17" },
      { name: "1.4 Turbo (170 hp) 18\"", front: "215/40R18" },
    ],
    "500 / 595": [
      { name: "1.4 T-Jet (135 hp)", front: "195/45R16" },
      { name: "595 Competizione (180 hp)", front: "205/40R17" },
    ],
  },
  "Alfa Romeo": {
    Giulia: [
      { name: "2.0 Turbo (200 hp)", front: "225/45R18" },
      { name: "2.2 Diesel (190 hp)", front: "225/45R18" },
      { name: "Quadrifoglio (510 hp)", front: "245/35R19", rear: "285/30R19" },
    ],
    Stelvio: [
      { name: "2.0 Turbo (200 hp)", front: "235/60R18" },
      { name: "2.2 Diesel (210 hp)", front: "235/60R18" },
      { name: "Quadrifoglio (510 hp)", front: "255/45R20", rear: "285/40R20" },
    ],
    Tonale: [
      { name: "1.5 Hybrid (130 hp)", front: "225/55R18" },
      { name: "1.3 PHEV (280 hp)", front: "235/45R19" },
    ],
  },
  Audi: {
    A1: [
      { name: "25 TFSI (95 hp)", front: "195/55R16" },
      { name: "30 TFSI (116 hp)", front: "205/55R16" },
      { name: "35 TFSI (150 hp)", front: "215/45R17" },
    ],
    A3: [
      { name: "30 TFSI (110 hp)", front: "205/55R16" },
      { name: "35 TFSI (150 hp)", front: "225/45R17" },
      { name: "S3 (310 hp)", front: "235/35R19" },
      { name: "RS3 (400 hp)", front: "255/30R19" },
    ],
    A4: [
      { name: "35 TFSI (150 hp)", front: "225/50R17" },
      { name: "40 TFSI (204 hp)", front: "225/50R17" },
      { name: "40 TDI (204 hp)", front: "225/50R17" },
      { name: "S4 (354 hp)", front: "255/35R19" },
    ],
    A5: [
      { name: "35 TFSI (150 hp)", front: "225/50R17" },
      { name: "40 TFSI (204 hp)", front: "245/40R18" },
      { name: "S5 (354 hp)", front: "255/35R19" },
    ],
    A6: [
      { name: "40 TFSI (204 hp)", front: "225/55R17" },
      { name: "45 TFSI (265 hp)", front: "245/45R18" },
      { name: "50 TDI (286 hp)", front: "245/45R18" },
      { name: "S6 (450 hp)", front: "255/40R19" },
    ],
    A8: [
      { name: "50 TDI (286 hp)", front: "235/55R18" },
      { name: "60 TFSI (460 hp)", front: "255/45R19" },
    ],
    Q3: [
      { name: "35 TFSI (150 hp)", front: "215/65R17" },
      { name: "40 TFSI (190 hp)", front: "235/55R18" },
      { name: "RS Q3 (400 hp)", front: "255/35R20" },
    ],
    Q5: [
      { name: "40 TFSI (204 hp)", front: "235/65R17" },
      { name: "45 TFSI (265 hp)", front: "235/60R18" },
      { name: "SQ5 (354 hp)", front: "255/45R20" },
    ],
    Q7: [
      { name: "45 TFSI (245 hp)", front: "235/65R18" },
      { name: "50 TDI (286 hp)", front: "255/55R19" },
      { name: "SQ7 (507 hp)", front: "285/40R21" },
    ],
    Q8: [
      { name: "50 TDI (286 hp)", front: "265/55R19" },
      { name: "RS Q8 (600 hp)", front: "295/35R23" },
    ],
    "e-tron / Q8 e-tron": [
      { name: "50 (313 hp)", front: "255/55R19" },
      { name: "55 (408 hp)", front: "265/45R21" },
    ],
  },
  BMW: {
    "1-Series": [
      { name: "116i (109 hp)", front: "205/55R16" },
      { name: "118i (140 hp)", front: "225/45R17" },
      { name: "120i (178 hp)", front: "225/40R18" },
      { name: "M135i (306 hp)", front: "225/40R18" },
    ],
    "2-Series": [
      { name: "218i Gran Coupe (140 hp)", front: "225/45R17" },
      { name: "220i Coupe (184 hp)", front: "225/45R17" },
      { name: "M240i (374 hp)", front: "245/35R19", rear: "255/35R19" },
    ],
    "3-Series": [
      { name: "318i (156 hp)", front: "225/50R17" },
      { name: "320i (184 hp)", front: "225/45R18" },
      { name: "330i (258 hp)", front: "225/45R18" },
      { name: "330e PHEV (292 hp)", front: "225/45R18" },
      { name: "M340i (374 hp)", front: "255/35R19" },
      { name: "M3 (480 hp)", front: "275/35R19", rear: "285/30R20" },
    ],
    "4-Series": [
      { name: "420i (184 hp)", front: "225/45R18" },
      { name: "430i (258 hp)", front: "245/40R18" },
      { name: "M4 (480 hp)", front: "275/35R19", rear: "285/30R20" },
    ],
    "5-Series": [
      { name: "520i (184 hp)", front: "225/55R17" },
      { name: "530i (252 hp)", front: "245/45R18" },
      { name: "540i (340 hp)", front: "245/45R18" },
      { name: "M550i (530 hp)", front: "255/40R19" },
      { name: "M5 (600 hp)", front: "275/35R20", rear: "285/35R20" },
    ],
    X1: [
      { name: "sDrive18i (136 hp)", front: "225/55R17" },
      { name: "xDrive23i (218 hp)", front: "225/55R18" },
    ],
    X3: [
      { name: "xDrive20i (184 hp)", front: "225/60R18" },
      { name: "xDrive30i (245 hp)", front: "245/50R19" },
      { name: "M40i (360 hp)", front: "245/45R20" },
    ],
    X5: [
      { name: "xDrive40i (340 hp)", front: "265/50R19" },
      { name: "xDrive45e PHEV (394 hp)", front: "265/50R19" },
      { name: "M50i (530 hp)", front: "275/40R21", rear: "315/35R21" },
    ],
    iX: [
      { name: "xDrive40 (326 hp)", front: "255/50R20" },
      { name: "xDrive50 (523 hp)", front: "255/45R21", rear: "275/40R22" },
    ],
    i4: [
      { name: "eDrive35 (286 hp)", front: "225/45R18" },
      { name: "eDrive40 (340 hp)", front: "245/40R19" },
      { name: "M50 (544 hp)", front: "255/35R19", rear: "275/30R20" },
    ],
  },
  Citro\u00ebn: {
    C3: [
      { name: "1.2 PureTech (83 hp)", front: "195/65R15" },
      { name: "1.2 PureTech (110 hp)", front: "205/55R16" },
    ],
    C4: [
      { name: "1.2 PureTech (130 hp)", front: "205/55R17" },
      { name: "\u00eb-C4 Electric (136 hp)", front: "215/60R17" },
    ],
    "C5 Aircross": [
      { name: "1.2 PureTech (130 hp)", front: "215/65R17" },
      { name: "Hybrid (225 hp)", front: "225/55R18" },
    ],
  },
  Cupra: {
    Born: [
      { name: "150 kW (204 hp)", front: "215/45R19" },
      { name: "170 kW (231 hp)", front: "215/45R20" },
    ],
    Formentor: [
      { name: "1.5 TSI (150 hp)", front: "225/50R18" },
      { name: "2.0 TSI 4Drive (310 hp)", front: "245/35R20" },
    ],
    Leon: [
      { name: "1.5 TSI (150 hp)", front: "225/45R17" },
      { name: "2.0 TSI (245 hp)", front: "235/35R19" },
    ],
  },
  Dacia: {
    Duster: [
      { name: "TCe 130 (130 hp)", front: "215/65R16" },
      { name: "dCi 115 4x4 (115 hp)", front: "215/60R17" },
    ],
    Sandero: [
      { name: "TCe 90 (90 hp)", front: "185/65R15" },
      { name: "Stepway TCe 110 (110 hp)", front: "195/55R16" },
    ],
    Spring: [
      { name: "Electric (45 hp)", front: "165/70R14" },
    ],
  },
  Fiat: {
    500: [
      { name: "1.0 Mild Hybrid (70 hp)", front: "185/55R15" },
      { name: "500e Electric (118 hp)", front: "205/45R17" },
    ],
    "500X": [
      { name: "1.0 T3 (120 hp)", front: "215/60R16" },
      { name: "1.3 T4 (150 hp)", front: "225/45R18" },
    ],
    Tipo: [
      { name: "1.0 T3 (100 hp)", front: "205/55R16" },
      { name: "1.6 Diesel (130 hp)", front: "225/45R17" },
    ],
  },
  Ford: {
    Fiesta: [
      { name: "1.0 EcoBoost (100 hp)", front: "195/60R15" },
      { name: "1.0 EcoBoost (125 hp)", front: "205/50R16" },
      { name: "ST (200 hp)", front: "205/40R18" },
    ],
    Focus: [
      { name: "1.0 EcoBoost (125 hp)", front: "205/55R16" },
      { name: "1.5 EcoBoost (182 hp)", front: "215/50R17" },
      { name: "ST (280 hp)", front: "235/35R19" },
    ],
    Kuga: [
      { name: "1.5 EcoBoost (150 hp)", front: "225/65R17" },
      { name: "2.5 PHEV (225 hp)", front: "225/55R19" },
    ],
    Mustang: [
      { name: "2.3 EcoBoost (270 hp)", front: "235/55R17" },
      { name: "5.0 V8 GT (450 hp)", front: "255/40R19", rear: "275/40R19" },
      { name: "Mach-E AWD (351 hp)", front: "225/55R19" },
    ],
    Puma: [
      { name: "1.0 EcoBoost (125 hp)", front: "215/55R17" },
      { name: "ST (200 hp)", front: "225/40R19" },
    ],
  },
  Honda: {
    Civic: [
      { name: "1.5 VTEC Turbo (182 hp)", front: "235/40R18" },
      { name: "2.0 e:HEV (184 hp)", front: "235/40R18" },
      { name: "Type R (330 hp)", front: "265/30R19" },
    ],
    "CR-V": [
      { name: "1.5 VTEC Turbo (193 hp)", front: "235/60R18" },
      { name: "2.0 e:HEV (184 hp)", front: "235/60R18" },
    ],
    "HR-V": [
      { name: "1.5 e:HEV (131 hp)", front: "215/60R17" },
    ],
    Jazz: [
      { name: "1.5 e:HEV (109 hp)", front: "185/60R15" },
    ],
    "ZR-V": [
      { name: "2.0 e:HEV (184 hp)", front: "225/55R18" },
    ],
  },
  Hyundai: {
    i10: [
      { name: "1.0 (67 hp)", front: "165/70R14" },
      { name: "1.2 (84 hp)", front: "185/55R16" },
    ],
    i20: [
      { name: "1.0 T-GDI (100 hp)", front: "195/55R16" },
      { name: "N (204 hp)", front: "215/40R18" },
    ],
    i30: [
      { name: "1.0 T-GDI (120 hp)", front: "205/55R16" },
      { name: "1.5 T-GDI (160 hp)", front: "225/45R17" },
      { name: "N (280 hp)", front: "235/35R19" },
    ],
    Ioniq5: [
      { name: "Standard Range (170 hp)", front: "235/55R19" },
      { name: "Long Range AWD (325 hp)", front: "255/45R20" },
    ],
    Ioniq6: [
      { name: "Long Range (229 hp)", front: "245/45R19" },
      { name: "Long Range AWD (325 hp)", front: "245/40R20" },
    ],
    Kona: [
      { name: "1.0 T-GDI (120 hp)", front: "215/60R17" },
      { name: "Electric (204 hp)", front: "215/55R17" },
    ],
    "Santa Fe": [
      { name: "1.6 T-GDI HEV (230 hp)", front: "235/60R18" },
      { name: "1.6 T-GDI PHEV (265 hp)", front: "255/45R20" },
    ],
    Tucson: [
      { name: "1.6 T-GDI (150 hp)", front: "215/70R16" },
      { name: "1.6 T-GDI HEV (230 hp)", front: "235/55R18" },
      { name: "1.6 T-GDI PHEV (265 hp)", front: "235/50R19" },
    ],
  },
  Kia: {
    Ceed: [
      { name: "1.0 T-GDI (120 hp)", front: "205/55R16" },
      { name: "1.5 T-GDI (160 hp)", front: "225/45R17" },
    ],
    EV6: [
      { name: "Standard Range (170 hp)", front: "235/55R19" },
      { name: "Long Range AWD (325 hp)", front: "255/45R20" },
      { name: "GT (585 hp)", front: "255/40R21" },
    ],
    Niro: [
      { name: "1.6 HEV (141 hp)", front: "205/60R16" },
      { name: "EV (204 hp)", front: "215/55R17" },
    ],
    Sportage: [
      { name: "1.6 T-GDI (150 hp)", front: "215/70R16" },
      { name: "1.6 T-GDI HEV (230 hp)", front: "235/55R18" },
      { name: "1.6 T-GDI PHEV (265 hp)", front: "235/50R19" },
    ],
    Stonic: [
      { name: "1.0 T-GDI (100 hp)", front: "205/55R16" },
    ],
  },
  Mazda: {
    "2": [{ name: "1.5 (90 hp)", front: "185/65R15" }],
    "3": [
      { name: "2.0 e-Skyactiv (150 hp)", front: "215/45R18" },
      { name: "2.0 e-Skyactiv X (186 hp)", front: "215/45R18" },
    ],
    "CX-30": [
      { name: "2.0 e-Skyactiv (150 hp)", front: "215/65R16" },
      { name: "2.0 e-Skyactiv X (186 hp)", front: "215/55R18" },
    ],
    "CX-5": [
      { name: "2.0 Skyactiv-G (165 hp)", front: "225/65R17" },
      { name: "2.5 Skyactiv-G (194 hp)", front: "225/55R19" },
    ],
    "CX-60": [
      { name: "3.3 e-Skyactiv D (254 hp)", front: "235/50R20" },
      { name: "2.5 PHEV (327 hp)", front: "235/50R20" },
    ],
    MX5: [
      { name: "1.5 (132 hp)", front: "195/50R16" },
      { name: "2.0 (184 hp)", front: "205/45R17" },
    ],
  },
  "Mercedes-Benz": {
    "A-Class": [
      { name: "A180 (136 hp)", front: "205/55R16" },
      { name: "A200 (163 hp)", front: "225/45R17" },
      { name: "A250 (224 hp)", front: "225/40R18" },
      { name: "A35 AMG (306 hp)", front: "235/35R19" },
    ],
    "C-Class": [
      { name: "C180 (170 hp)", front: "225/50R17" },
      { name: "C200 (204 hp)", front: "225/45R18" },
      { name: "C300 (258 hp)", front: "225/45R18" },
      { name: "C43 AMG (408 hp)", front: "245/40R19", rear: "275/35R19" },
      { name: "C63 AMG (680 hp)", front: "265/35R20", rear: "275/35R20" },
    ],
    "E-Class": [
      { name: "E200 (204 hp)", front: "225/55R17" },
      { name: "E300 (258 hp)", front: "245/45R18" },
      { name: "E53 AMG (457 hp)", front: "255/40R19", rear: "285/35R19" },
    ],
    GLA: [
      { name: "GLA200 (163 hp)", front: "215/60R17" },
      { name: "GLA250 (224 hp)", front: "235/50R18" },
      { name: "AMG GLA35 (306 hp)", front: "235/45R19" },
    ],
    GLC: [
      { name: "GLC200 (204 hp)", front: "235/60R18" },
      { name: "GLC300 (258 hp)", front: "255/45R20" },
      { name: "AMG GLC43 (390 hp)", front: "255/40R21" },
    ],
    EQA: [
      { name: "250 (190 hp)", front: "235/55R18" },
      { name: "300 4MATIC (228 hp)", front: "235/50R19" },
    ],
    EQC: [
      { name: "400 4MATIC (408 hp)", front: "235/50R20" },
    ],
  },
  Mini: {
    Cooper: [
      { name: "Cooper (156 hp)", front: "175/65R15" },
      { name: "Cooper S (178 hp)", front: "205/45R17" },
      { name: "JCW (231 hp)", front: "215/40R18" },
    ],
    Countryman: [
      { name: "Cooper (136 hp)", front: "225/55R17" },
      { name: "Cooper S ALL4 (178 hp)", front: "225/50R18" },
    ],
  },
  Nissan: {
    Juke: [
      { name: "1.0 DIG-T (114 hp)", front: "215/60R17" },
      { name: "1.6 Hybrid (143 hp)", front: "215/55R18" },
    ],
    Leaf: [
      { name: "40 kWh (150 hp)", front: "205/55R16" },
      { name: "62 kWh e+ (217 hp)", front: "215/50R17" },
    ],
    Qashqai: [
      { name: "1.3 DIG-T (140 hp)", front: "215/65R17" },
      { name: "1.5 e-Power (190 hp)", front: "235/55R19" },
    ],
  },
  Opel: {
    Astra: [
      { name: "1.2 Turbo (110 hp)", front: "205/55R16" },
      { name: "1.2 Turbo (130 hp)", front: "225/45R17" },
      { name: "PHEV (180 hp)", front: "225/40R18" },
    ],
    Corsa: [
      { name: "1.2 (75 hp)", front: "185/65R15" },
      { name: "1.2 Turbo (100 hp)", front: "195/55R16" },
      { name: "Corsa-e (136 hp)", front: "205/45R17" },
    ],
    Mokka: [
      { name: "1.2 Turbo (130 hp)", front: "215/60R17" },
      { name: "Mokka-e (136 hp)", front: "215/55R18" },
    ],
  },
  Peugeot: {
    208: [
      { name: "1.2 PureTech (75 hp)", front: "195/55R16" },
      { name: "1.2 PureTech (130 hp)", front: "205/45R17" },
      { name: "e-208 (136 hp)", front: "205/45R17" },
    ],
    308: [
      { name: "1.2 PureTech (130 hp)", front: "205/55R16" },
      { name: "1.6 Hybrid (180 hp)", front: "225/40R18" },
    ],
    2008: [
      { name: "1.2 PureTech (130 hp)", front: "215/60R17" },
      { name: "e-2008 (136 hp)", front: "215/60R17" },
    ],
    3008: [
      { name: "1.2 PureTech (130 hp)", front: "215/65R17" },
      { name: "1.6 Hybrid (225 hp)", front: "225/55R18" },
    ],
    5008: [
      { name: "1.2 PureTech (130 hp)", front: "215/65R17" },
      { name: "1.6 Hybrid (225 hp)", front: "235/55R18" },
    ],
  },
  Polestar: {
    "2": [
      { name: "Single Motor (231 hp)", front: "245/45R19" },
      { name: "Dual Motor (408 hp)", front: "245/40R20" },
    ],
  },
  Porsche: {
    "911 (992)": [
      { name: "Carrera (385 hp)", front: "245/35R20", rear: "305/30R21" },
      { name: "Carrera S (450 hp)", front: "245/35R20", rear: "305/30R21" },
      { name: "Turbo S (650 hp)", front: "255/35R20", rear: "315/30R21" },
    ],
    Cayenne: [
      { name: "Cayenne (340 hp)", front: "255/55R19" },
      { name: "S (474 hp)", front: "275/45R20" },
      { name: "Turbo GT (640 hp)", front: "285/35R22", rear: "315/30R22" },
    ],
    Macan: [
      { name: "Macan (265 hp)", front: "235/60R18" },
      { name: "S (380 hp)", front: "255/45R20" },
      { name: "GTS (440 hp)", front: "255/40R21", rear: "295/35R21" },
    ],
    Taycan: [
      { name: "Taycan (408 hp)", front: "225/55R19", rear: "275/45R19" },
      { name: "4S (530 hp)", front: "245/45R20", rear: "285/40R20" },
      { name: "Turbo S (761 hp)", front: "265/35R21", rear: "305/30R21" },
    ],
  },
  Renault: {
    Captur: [
      { name: "1.0 TCe (90 hp)", front: "205/60R16" },
      { name: "1.6 E-Tech Hybrid (145 hp)", front: "215/55R17" },
    ],
    Clio: [
      { name: "1.0 TCe (90 hp)", front: "195/55R16" },
      { name: "1.6 E-Tech Hybrid (145 hp)", front: "205/45R17" },
    ],
    Megane: [
      { name: "1.3 TCe (140 hp)", front: "205/55R16" },
      { name: "E-Tech Electric (220 hp)", front: "215/45R20" },
    ],
    Arkana: [
      { name: "1.3 TCe (140 hp)", front: "215/60R17" },
      { name: "1.6 E-Tech Hybrid (145 hp)", front: "215/55R18" },
    ],
  },
  Seat: {
    Arona: [
      { name: "1.0 TSI (95 hp)", front: "205/60R16" },
      { name: "1.5 TSI (150 hp)", front: "215/45R18" },
    ],
    Ibiza: [
      { name: "1.0 TSI (95 hp)", front: "185/65R15" },
      { name: "1.5 TSI (150 hp)", front: "215/45R17" },
    ],
    Leon: [
      { name: "1.0 TSI (110 hp)", front: "205/55R16" },
      { name: "1.5 TSI (150 hp)", front: "225/45R17" },
    ],
  },
  Skoda: {
    Fabia: [
      { name: "1.0 TSI (95 hp)", front: "185/60R15" },
      { name: "1.0 TSI (110 hp)", front: "195/55R16" },
    ],
    Kamiq: [
      { name: "1.0 TSI (95 hp)", front: "205/60R16" },
      { name: "1.5 TSI (150 hp)", front: "215/45R18" },
    ],
    Karoq: [
      { name: "1.0 TSI (110 hp)", front: "215/60R17" },
      { name: "1.5 TSI (150 hp)", front: "215/55R18" },
    ],
    Kodiaq: [
      { name: "1.5 TSI (150 hp)", front: "215/65R17" },
      { name: "2.0 TSI 4x4 (245 hp)", front: "235/50R19" },
      { name: "RS (245 hp)", front: "235/45R20" },
    ],
    Octavia: [
      { name: "1.0 TSI (110 hp)", front: "205/55R16" },
      { name: "1.5 TSI (150 hp)", front: "225/45R17" },
      { name: "2.0 TSI (204 hp)", front: "225/40R18" },
      { name: "RS (245 hp)", front: "225/40R19" },
    ],
    Superb: [
      { name: "1.5 TSI (150 hp)", front: "215/55R17" },
      { name: "2.0 TSI (272 hp)", front: "235/40R19" },
    ],
    Enyaq: [
      { name: "iV 60 (179 hp)", front: "235/55R19" },
      { name: "iV 80 (204 hp)", front: "235/50R20" },
      { name: "RS iV (299 hp)", front: "255/40R21" },
    ],
  },
  Subaru: {
    Forester: [
      { name: "2.0 e-Boxer (150 hp)", front: "225/60R17" },
      { name: "2.0 e-Boxer (150 hp) 18\"", front: "225/55R18" },
    ],
    Impreza: [
      { name: "2.0 e-Boxer (150 hp)", front: "225/40R18" },
    ],
    Outback: [
      { name: "2.5i (169 hp)", front: "225/65R17" },
      { name: "2.5i (169 hp) 18\"", front: "225/60R18" },
    ],
    XV: [
      { name: "2.0 e-Boxer (150 hp)", front: "225/55R18" },
    ],
  },
  Tesla: {
    "Model 3": [
      { name: "Standard Range+ (283 hp)", front: "235/45R18" },
      { name: "Long Range (346 hp)", front: "235/40R19", rear: "255/35R19" },
      { name: "Performance (480 hp)", front: "235/35R20", rear: "275/30R20" },
    ],
    "Model Y": [
      { name: "Standard Range (283 hp)", front: "255/45R19" },
      { name: "Long Range (346 hp)", front: "255/40R20" },
      { name: "Performance (480 hp)", front: "255/35R21", rear: "275/35R21" },
    ],
    "Model S": [
      { name: "Dual Motor (670 hp)", front: "245/45R19" },
      { name: "Plaid (1020 hp)", front: "265/35R21", rear: "295/30R21" },
    ],
    "Model X": [
      { name: "Dual Motor (670 hp)", front: "265/45R20" },
      { name: "Plaid (1020 hp)", front: "265/35R22", rear: "285/35R22" },
    ],
  },
  Toyota: {
    Aygo: [
      { name: "1.0 VVT-i (72 hp)", front: "165/65R15" },
    ],
    "Aygo X": [
      { name: "1.0 VVT-i (72 hp)", front: "175/65R15" },
    ],
    Corolla: [
      { name: "1.8 Hybrid (122 hp)", front: "195/65R15" },
      { name: "2.0 Hybrid (184 hp)", front: "225/40R18" },
    ],
    "C-HR": [
      { name: "1.8 Hybrid (122 hp)", front: "215/60R17" },
      { name: "2.0 Hybrid (184 hp)", front: "225/50R18" },
    ],
    Camry: [
      { name: "2.5 Hybrid (218 hp)", front: "215/55R17" },
    ],
    "RAV4": [
      { name: "2.5 Hybrid (222 hp)", front: "225/65R17" },
      { name: "2.5 PHEV (306 hp)", front: "235/55R19" },
    ],
    Yaris: [
      { name: "1.0 VVT-i (72 hp)", front: "175/70R14" },
      { name: "1.5 Hybrid (116 hp)", front: "185/60R15" },
      { name: "GR Yaris (261 hp)", front: "225/40R18" },
    ],
    "Yaris Cross": [
      { name: "1.5 Hybrid (116 hp)", front: "215/50R18" },
    ],
    Supra: [
      { name: "2.0 (258 hp)", front: "255/40R18", rear: "275/40R18" },
      { name: "3.0 (340 hp)", front: "255/35R19", rear: "275/35R19" },
    ],
    bZ4X: [
      { name: "FWD (204 hp)", front: "235/60R18" },
      { name: "AWD (218 hp)", front: "235/50R20" },
    ],
  },
  Volkswagen: {
    Golf: [
      { name: "1.0 TSI (110 hp)", front: "205/55R16" },
      { name: "1.5 TSI (150 hp)", front: "225/45R17" },
      { name: "2.0 TSI GTI (245 hp)", front: "225/40R18" },
      { name: "2.0 TSI R (320 hp)", front: "235/35R19" },
    ],
    Polo: [
      { name: "1.0 TSI (95 hp)", front: "185/65R15" },
      { name: "1.0 TSI (110 hp)", front: "195/55R16" },
      { name: "GTI (207 hp)", front: "215/40R18" },
    ],
    "T-Cross": [
      { name: "1.0 TSI (95 hp)", front: "205/60R16" },
      { name: "1.0 TSI (110 hp)", front: "215/45R18" },
    ],
    "T-Roc": [
      { name: "1.0 TSI (110 hp)", front: "215/60R16" },
      { name: "1.5 TSI (150 hp)", front: "215/55R17" },
      { name: "R (300 hp)", front: "225/40R19" },
    ],
    Tiguan: [
      { name: "1.5 TSI (150 hp)", front: "215/65R17" },
      { name: "2.0 TSI 4Motion (245 hp)", front: "235/50R19" },
      { name: "R (320 hp)", front: "255/40R20" },
    ],
    Passat: [
      { name: "1.5 TSI (150 hp)", front: "215/55R17" },
      { name: "2.0 TSI (272 hp)", front: "235/40R19" },
    ],
    Touareg: [
      { name: "3.0 TDI (286 hp)", front: "255/55R19" },
      { name: "3.0 TDI (340 hp)", front: "285/40R21" },
      { name: "R (462 hp)", front: "285/40R21" },
    ],
    ID3: [
      { name: "Pro (204 hp)", front: "215/55R18" },
      { name: "Pro S (204 hp)", front: "215/50R19" },
    ],
    ID4: [
      { name: "Pure (170 hp)", front: "235/55R19" },
      { name: "Pro (204 hp)", front: "235/50R20" },
      { name: "GTX (299 hp)", front: "255/40R21" },
    ],
    ID5: [
      { name: "Pro (204 hp)", front: "235/50R20" },
      { name: "GTX (299 hp)", front: "255/40R21" },
    ],
    Transporter: [
      { name: "T6.1 2.0 TDI (110 hp)", front: "215/65R16" },
      { name: "T6.1 2.0 TDI (150 hp)", front: "215/60R17" },
      { name: "Multivan T7 (136 hp)", front: "215/60R17" },
    ],
  },
  Volvo: {
    XC40: [
      { name: "T2 (129 hp)", front: "215/60R17" },
      { name: "T3 (163 hp)", front: "225/55R18" },
      { name: "T5 R-Design (247 hp)", front: "235/50R19" },
      { name: "Recharge Pure Electric (231 hp)", front: "235/50R19" },
    ],
    XC60: [
      { name: "B4 (197 hp)", front: "235/60R18" },
      { name: "B5 (250 hp)", front: "235/55R19" },
      { name: "T8 Recharge (455 hp)", front: "255/45R20" },
    ],
    XC90: [
      { name: "B5 (250 hp)", front: "235/60R18" },
      { name: "T8 Recharge (455 hp)", front: "275/40R21" },
    ],
    S60: [
      { name: "B4 (197 hp)", front: "225/50R17" },
      { name: "B5 (250 hp)", front: "235/45R18" },
      { name: "T8 Recharge (455 hp)", front: "245/35R20" },
    ],
    S90: [
      { name: "B4 (197 hp)", front: "225/55R17" },
      { name: "B5 (250 hp)", front: "245/45R18" },
      { name: "T8 Recharge (455 hp)", front: "245/40R19" },
    ],
    V60: [
      { name: "B3 (163 hp)", front: "205/60R16" },
      { name: "B4 (197 hp)", front: "225/50R17" },
      { name: "B5 (250 hp)", front: "235/45R18" },
      { name: "T8 Recharge (455 hp)", front: "245/35R20" },
      { name: "Cross Country B5 (250 hp)", front: "235/50R18" },
    ],
    V90: [
      { name: "B4 (197 hp)", front: "225/55R17" },
      { name: "B5 (250 hp)", front: "245/45R18" },
      { name: "Cross Country B5 (250 hp)", front: "245/45R19" },
    ],
    C40: [
      { name: "Recharge Pure Electric (231 hp)", front: "235/50R19" },
      { name: "Recharge Twin (408 hp)", front: "255/40R20" },
    ],
    EX30: [
      { name: "Single Motor (272 hp)", front: "225/50R18" },
      { name: "Twin Motor (428 hp)", front: "245/40R20" },
    ],
    EX90: [
      { name: "Single Motor (279 hp)", front: "265/45R20" },
      { name: "Twin Motor (517 hp)", front: "275/35R22" },
    ],
  },
};

export function getManufacturers() {
  return Object.keys(VEHICLE_DB).sort();
}

export function getModels(manufacturer) {
  if (!manufacturer || !VEHICLE_DB[manufacturer]) return [];
  return Object.keys(VEHICLE_DB[manufacturer]).sort();
}

export function getVariants(manufacturer, model) {
  if (!manufacturer || !model || !VEHICLE_DB[manufacturer]?.[model]) return [];
  return VEHICLE_DB[manufacturer][model];
}

export function parseTyreDimension(dim) {
  const m = dim.replace(/\s/g, "").toUpperCase().match(/^(\d{3})\/(\d{2})R(\d{2})/);
  if (!m) return null;
  return { width: m[1], aspectRatio: m[2], diameter: m[3] };
}
