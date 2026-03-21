-- ============================================================
-- AgriLearn Seed Data
-- Run AFTER schema.sql in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- LEARNING MODULES (6 modules in English)
-- ============================================================
INSERT INTO public.learning_modules (title, description, category, level, content, duration_minutes, language, is_active)
VALUES
(
  'Intro to Crop Rotation',
  'Improve soil health and yields through strategic crop rotation techniques used across South Africa.',
  'Crops', 'beginner',
  E'Crop rotation is the practice of growing different types of crops in the same area across a sequence of growing seasons.\n\nBENEFITS\n• Reduces soil erosion\n• Increases soil fertility naturally\n• Controls pests and diseases\n• Improves water retention\n• Reduces need for synthetic fertilizers\n\nBASIC 4-YEAR ROTATION\n1. Year 1: Legumes (nitrogen fixers — beans, peas, groundnuts)\n2. Year 2: Brassicas (heavy feeders — cabbage, broccoli, kale)\n3. Year 3: Root vegetables (carrots, beetroot, onions)\n4. Year 4: Fallow or cover crops (rye, vetch)\n\nGETTING STARTED\nStart by mapping your land into equal sections and assigning each section a different crop family. Keep detailed records of what grew where each year.\n\nLEGUME CROPS\nLegumes are particularly valuable in rotation because they fix atmospheric nitrogen into the soil through symbiotic bacteria in their root nodules. This natural fertilization can reduce or eliminate the need for synthetic nitrogen fertilizers.\n\nExamples: Beans, peas, soybeans, cowpeas, groundnuts\n\nPRACTICAL TIPS\n• Start small — rotate just 2 or 3 crops before adding complexity\n• Keep a farm diary recording crop varieties, yields, and observations\n• Test soil before and after each cycle to track improvement\n• Join a local farming cooperative to share knowledge and resources',
  15, 'en', true
),
(
  'Water Management Basics',
  'Efficient irrigation strategies for small-scale farms in South Africa''s varying climates.',
  'Irrigation', 'beginner',
  E'Efficient water use is critical for profitable, sustainable farming in South Africa where water scarcity is a growing concern.\n\nDRIP IRRIGATION\nDelivers water directly to the plant root zone, reducing evaporation by up to 60%. This method is ideal for row crops, orchards, and vegetables.\n\nAdvantages:\n• Up to 50% water savings vs flood irrigation\n• Reduces weed growth between rows\n• Prevents fungal diseases by keeping foliage dry\n• Can deliver nutrients with water (fertigation)\n\nRAINWATER HARVESTING\nCollect and store rainwater during rainy seasons for use during dry periods. A 100m² roof can collect approximately 50,000 litres annually in a 500mm rainfall area.\n\nStorage options:\n• JoJo tanks (2,500L–10,000L) — affordable and durable\n• Farm dams — large scale, higher cost\n• Underground cisterns — protect from evaporation\n\nSCHEDULING\nWater early morning (4–8 AM) or evening to minimize evaporation. Avoid watering during peak heat (10 AM – 4 PM) when evaporation rates are highest.\n\nSOIL MOISTURE MANAGEMENT\n• Sandy soils: Water frequently but in small amounts — water drains fast\n• Clay soils: Water less frequently but more deeply — water holds longer\n• Loamy soils: Ideal for most crops, moderate watering schedule\n\nWATER CONSERVATION TIPS\n• Mulch around plants to retain moisture and reduce temperature\n• Use raised beds to improve drainage and reduce water needs\n• Plant windbreaks to reduce evaporation from wind\n• Check irrigation systems weekly for leaks or blockages',
  20, 'en', true
),
(
  'Soil Testing & pH',
  'Understand your soil composition and learn how to optimize it for better crop yields.',
  'Soil', 'intermediate',
  E'Knowing your soil composition is the foundation of successful farming.\n\nWHAT TO TEST\n• pH level (ideal: 6.0–7.0 for most crops)\n• Nitrogen (N), Phosphorus (P), Potassium (K) — the NPK values\n• Organic matter content\n• Micronutrients: Iron, Zinc, Manganese, Boron\n• Cation Exchange Capacity (CEC) — soil''s ability to hold nutrients\n\nHOW TO TEST\n1. Collect samples from 8–10 spots in your field\n2. Take samples from 15–20cm depth (root zone)\n3. Mix all samples together and take a 500g subsample\n4. Use a home test kit (available at farm stores) or send to an accredited lab\n5. Repeat testing annually, same time of year\n\nADJUSTING pH\n• Too acidic (below 6.0): Add agricultural lime (dolomite) at 1–2 tons/hectare\n• Too alkaline (above 7.5): Add agricultural sulfur or organic matter\n• Always retest after 3 months to measure the effect\n\nNPK EXPLAINED\n• Nitrogen (N): Promotes leafy green growth and overall plant vigor\n• Phosphorus (P): Encourages root development and flowering/fruiting\n• Potassium (K): Improves overall plant health, water uptake, and disease resistance\n\nORGANIC MATTER\nAim for 3–5% organic matter content. Increase it by:\n• Adding compost (2–5 tons/hectare annually)\n• Incorporating crop residues after harvest\n• Using green manure cover crops\n• Applying well-composted animal manure\n\nSOIL STRUCTURE\nGood soil structure means:\n• Well-draining but moisture-retentive\n• Easy for roots to penetrate\n• Rich in earthworms and microorganisms\n• Doesn''t crust over when dry',
  25, 'en', true
),
(
  'Pest Identification Guide',
  'Learn to identify and manage the most common crop pests found on South African farms.',
  'Pest Control', 'beginner',
  E'Early identification is key to controlling pest damage before it becomes economically significant.\n\nCOMMON PESTS IN SOUTH AFRICA\n• Aphids: Small, soft-bodied insects clustered on new growth. Often green, black, or brown. Excrete sticky honeydew, encouraging sooty mold.\n• Whiteflies: Tiny white insects on leaf undersides. Spread viral diseases. Populations explode in warm conditions.\n• Cutworms: Caterpillars that cut seedlings at soil level at night. Most damaging in early season.\n• Bollworms (Helicoverpa): Major pest of maize and cotton. Larvae bore into ears and bolls.\n• Red Spider Mite: Tiny mites causing yellow stippling on leaves. Thrives in hot, dry conditions.\n• Fall Armyworm: Invasive pest devastating maize crops across Africa. Feeds at night.\n\nSIGNS OF INFESTATION\n• Holes in leaves with irregular margins (caterpillars)\n• Yellow or stippled leaves (mites, whitefly)\n• Wilting seedlings at soil level (cutworms)\n• Sticky residue on leaves (aphids)\n• Entry holes in fruit or grain heads (bollworm)\n\nINTEGRATED PEST MANAGEMENT (IPM)\n1. Monitor regularly — walk your fields weekly, check undersides of leaves\n2. Set action thresholds — not every pest requires treatment\n3. Use biological controls first (beneficial insects, Bt sprays)\n4. Apply pesticides as last resort, following safety guidelines\n\nBIOLOGICAL CONTROLS\n• Ladybirds eat 50–60 aphids per day\n• Ground beetles eat soil-dwelling pests including cutworms\n• Parasitic wasps attack caterpillars and whitefly\n• Birds eat a wide variety of insects — welcome them with perches\n• Bacillus thuringiensis (Bt) spray targets caterpillars, safe for beneficial insects\n\nSAFE PESTICIDE USE\n• Always read and follow label instructions\n• Wear gloves, goggles, and mask during application\n• Never spray on windy days or near water sources\n• Respect pre-harvest intervals — check label for number of days\n• Store chemicals locked away, away from children and animals',
  18, 'en', true
),
(
  'Selling at Farmers Markets',
  'Learn how to price, package, and present your produce for maximum sales at South African markets.',
  'Business', 'beginner',
  E'Farmers markets offer direct access to customers and better margins than wholesale — but success requires preparation.\n\nPRICING STRATEGY\n• Research what competitors charge at the same market before your first stall\n• Calculate your full cost: seeds, water, fertilizer, labor, transport, stall fee, packaging\n• Add a 25–40% profit margin to cover risks, crop losses, and reinvestment\n• Price in round numbers ending in .50 or .00 for easy change\n• Offer a "market special" on slower-moving items rather than discounting everything\n\nDISPLAY TIPS\n• Use height variation — raised items at back, short items in front create visual interest\n• Keep produce clean, polished, and sorted by size for a professional appearance\n• Use clear, handwritten price signs in large font — customers won''t ask if prices are visible\n• Include your farm name and a brief story: "Grown in Mpumalanga using no pesticides"\n• Use baskets, wooden crates, and cloth for a farm-fresh aesthetic\n• Group products thematically (salad items together, soup vegetables together)\n\nCUSTOMER SERVICE\n• Smile and greet every customer who approaches your stall\n• Know your produce — how to store it, how to cook it, what varieties you grow\n• Offer samples when permitted by market rules — tasting converts browsers to buyers\n• Build relationships — learn regular customers'' names and preferences\n• Take contact details with permission for WhatsApp updates on what''s available\n\nRECORD KEEPING\n• Track what sells well each week and what gets taken home\n• Note which products need price adjustments\n• Record expenses and income for each market for tax purposes\n• Keep records for 5 years (SARS requirement)\n\nBUILDING YOUR BRAND\n• Create a simple logo for your farm\n• Consistent packaging and signage builds recognition\n• A QR code linking to your WhatsApp or social media can grow your following',
  22, 'en', true
),
(
  'Livestock Health Basics',
  'Essential preventive health management for cattle, goats, sheep, and poultry on small-scale farms.',
  'Livestock', 'beginner',
  E'Healthy livestock is the foundation of a profitable livestock operation. Prevention is always cheaper than treatment.\n\nDAILY CHECKS\n• Fresh, clean water always available — animals drink 4–10% of body weight daily\n• Observe animals for signs of illness: lethargy, isolation, loss of appetite\n• Monitor feed consumption — changes can indicate health issues\n• Check for injuries or wounds that need treatment\n• Count your animals daily — predators and theft are real risks\n\nVACCINATION SCHEDULE\nWork with a local veterinarian to establish a vaccination program specific to your region and species.\n\nCommon vaccinations in South Africa:\n• Cattle: Brucellosis (heifers 4–8 months), Lumpy Skin Disease (annual), Foot and Mouth Disease (controlled area schedule), Botulism\n• Goats/Sheep: Pasteurella (annual), Pulpy Kidney/Enterotoxaemia (before green pasture season), Anthrax (where endemic), Rift Valley Fever\n• Poultry: Newcastle Disease (essential, monthly for layers), Marek''s Disease (at hatch), Infectious Bronchitis\n\nSIGNS OF ILLNESS\n• Dull, sunken eyes or discharge from eyes/nose\n• Dry, cracked nose in cattle (healthy cattle have moist noses)\n• Rough or dull coat/feathers\n• Isolation from the rest of the herd or flock\n• Abnormal droppings (too loose, too hard, blood-tinged)\n• Labored or rapid breathing\n• Swollen joints or limping\n• Drop in milk production or sudden weight loss\n\nPREVENTIVE MEASURES\n• Quarantine all new animals for 2–3 weeks before introducing to herd/flock\n• Maintain clean, well-ventilated housing and remove manure regularly\n• Rotate grazing pastures — rest each camp for 4–6 weeks to break parasite cycles\n• Deworm according to a veterinary schedule and rotate dewormers to prevent resistance\n• Cull chronically sick animals — they drain resources and spread disease\n\nEMERGENCY PREPAREDNESS\n• Know your nearest state vet office for notifiable diseases\n• Keep a farm first aid kit: antiseptic, bandages, thermometer, syringes, electrolyte powder\n• Record all treatments, vaccines, and deaths for traceability',
  30, 'en', true
)
ON CONFLICT DO NOTHING;


-- ============================================================
-- DEMO PRODUCT LISTINGS
-- (These use a dummy farmer_id; in production, real user UUIDs are used)
-- Note: For demo purposes, we insert with a system note on farmer_id
-- These will only work if you first create farmer accounts and use their UUIDs
-- Instead, run this after registering at least one farmer account:
-- UPDATE public.product_listings SET farmer_id = '<your-farmer-uuid>' WHERE farmer_id IS NULL;
-- ============================================================

-- Uncomment and replace {FARMER_UUID} with a real profile UUID after registration:
/*
INSERT INTO public.product_listings (farmer_id, title, description, category, price, quantity, unit, location, status)
VALUES
  ('{FARMER_UUID}', 'Fresh Tomatoes', 'Ripe, juicy farm-fresh tomatoes. Grown without pesticides. Available for pickup or delivery within Durban area. Minimum order 5kg.', 'Vegetables', 12.50, 50, 'kg', 'Durban, KZN', 'active'),
  ('{FARMER_UUID}', 'Free-Range Eggs', 'Organic free-range eggs from happy hens. Fresh daily. No hormones or antibiotics. Our hens roam freely on natural pasture.', 'Poultry', 4.00, 200, 'dozen', 'Johannesburg, GP', 'active'),
  ('{FARMER_UUID}', 'Butternut Squash', 'Large, sweet butternut squash. Perfect for soups and roasting. Harvested at peak ripeness.', 'Vegetables', 8.00, 100, 'kg', 'Pretoria, GP', 'active'),
  ('{FARMER_UUID}', 'Mango Harvest', 'Sweet Keitt mangoes, freshly harvested. Bulk orders welcome. Grown in our Limpopo orchard.', 'Fruits', 25.00, 300, 'kg', 'Limpopo', 'active'),
  ('{FARMER_UUID}', 'Yellow Maize', 'Grade A yellow maize, dried and ready for milling or livestock feed. Moisture content below 14%.', 'Grains', 3.50, 2000, 'kg', 'Free State', 'active'),
  ('{FARMER_UUID}', 'Fresh Milk', 'Raw milk from Jersey cows. Collected daily. Contact for delivery schedule.', 'Dairy', 15.00, 100, 'litre', 'Western Cape', 'active');
*/
