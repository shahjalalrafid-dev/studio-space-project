/**
 * Seeds the `studios` collection in MongoDB Atlas with demo listings so the
 * dynamic homepage sections (Featured Studios, category counters) have data.
 *
 * Run it as often as you like — every document is upserted by `slug`, so the
 * script is idempotent and never creates duplicates.
 *
 *   npm run db:seed
 */

import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URL;
const DATABASE = "studio-space";
const COLLECTION = "studios";

if (!uri) {
  console.error("MONGO_DB_URL is missing — run with: node --env-file=.env");
  process.exit(1);
}

/** Shared artwork (Wikimedia Commons, served at 1920px). */
const IMG = {
  photoLoft:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Studio_Bts_%28140066927%29.jpeg/1920px-Studio_Bts_%28140066927%29.jpeg",
  photoBay:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Elizabeth_%288661998433%29.jpg/1920px-Elizabeth_%288661998433%29.jpg",
  stageBlackbox:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Sound_stage_4%2C_Shinfield_Studios.jpg/1920px-Sound_stage_4%2C_Shinfield_Studios.jpg",
  stageTwin:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Sound_stage_1_and_2%2C_Shinfield_Studios.jpg/1920px-Sound_stage_1_and_2%2C_Shinfield_Studios.jpg",
  stagePractical:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Movie_production.jpg/1920px-Movie_production.jpg",
  stageLighting:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Field_Production_Lighting_and_Camera_Rig_2.jpg/1920px-Field_Production_Lighting_and_Camera_Rig_2.jpg",
  podcastTable:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Podcasting-wcwc.jpg/1920px-Podcasting-wcwc.jpg",
  podcastBooth:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Adobe_Connect_Webinar_%26_Podcast_setting.jpg/1920px-Adobe_Connect_Webinar_%26_Podcast_setting.jpg",
  musicNeve:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Neve_81_Series_Mixing_Console.jpg/1920px-Neve_81_Series_Mixing_Console.jpg",
  musicLoft:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Recording_studio_console_for_DAW_work_%282016-03-23_15.01.29_by_DayronV_%40pixabay_1290087%29.jpg/1920px-Recording_studio_console_for_DAW_work_%282016-03-23_15.01.29_by_DayronV_%40pixabay_1290087%29.jpg",
  musicAbbey:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Abbey_Road_Studios_2010-04-08_-_control_room_of_Studio_2.jpg/1920px-Abbey_Road_Studios_2010-04-08_-_control_room_of_Studio_2.jpg",
  artWet:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Workshop_of_Temo_Svirely_2013.jpg/1920px-Workshop_of_Temo_Svirely_2013.jpg",
  artAtelier:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Seattle_-_Seward_Park_Art_Studio%2C_1976_%2838364638954%29_%282%29_%28cropped%29.jpg/1920px-Seattle_-_Seward_Park_Art_Studio%2C_1976_%2838364638954%29_%282%29_%28cropped%29.jpg",
  chroma:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Green_screen_studio_%2825113564876%29.jpg/1920px-Green_screen_studio_%2825113564876%29.jpg",
};

const STUDIOS = [
  {
    slug: "daylight-cyclorama-loft",
    title: "Daylight Cyclorama Loft",
    category: "photo-studio",
    city: "Brooklyn",
    area: "Bushwick",
    country: "USA",
    pricePerHour: 68,
    rating: 4.9,
    reviews: 132,
    image: IMG.photoLoft,
    description:
      "A 420 sq ft infinity bay with a 12ft white cyc, blackout curtains on every window and a freight lift that swallows a 6m dolly. Natural light until 3pm, then four Profoto heads take over.",
    tags: ["12ft cyc wall", "Profoto strobes", "Makeup station"],
    capacity: 8,
    sizeSqft: 420,
    host: { name: "Mara Whitfield", verified: true },
    createdAt: new Date("2026-08-14T10:00:00.000Z"),
  },
  {
    slug: "seamless-white-bay-4",
    title: "Seamless White Bay No. 4",
    category: "photo-studio",
    city: "Los Angeles",
    area: "Silver Lake",
    country: "USA",
    pricePerHour: 54,
    rating: 4.8,
    reviews: 96,
    image: IMG.photoBay,
    description:
      "Street-level white bay built for fashion lookbooks: 30ft of seamless paper, tethering station, and a rolling garment rack that reaches the loading dock in under a minute.",
    tags: ["Seamless paper", "Tethering desk", "Street parking"],
    capacity: 6,
    sizeSqft: 350,
    host: { name: "Ivo Castellano", verified: true },
    createdAt: new Date("2026-09-02T10:00:00.000Z"),
  },
  {
    slug: "blackbox-cinema-stage",
    title: "Blackbox Cinema Stage",
    category: "sound-stage",
    city: "Atlanta",
    area: "Doghead Farm",
    country: "USA",
    pricePerHour: 145,
    rating: 4.9,
    reviews: 88,
    image: IMG.stageBlackbox,
    description:
      "Full blackout soundstage with a 24ft grid, three pre-rigged power drops and a cyclorama wall on the north side. Drive-in access for a grip truck and a 40ft air wall.",
    tags: ["24ft lighting grid", "Drive-in access", "Acoustic panels"],
    capacity: 20,
    sizeSqft: 2400,
    host: { name: "Junie Park", verified: true },
    createdAt: new Date("2026-07-21T10:00:00.000Z"),
  },
  {
    slug: "twin-grid-sound-stage",
    title: "Twin Grid Sound Stage",
    category: "sound-stage",
    city: "Austin",
    area: "East Side",
    country: "USA",
    pricePerHour: 132,
    rating: 4.7,
    reviews: 64,
    image: IMG.stageTwin,
    description:
      "Two adjoining stages split by a sound-rated partition — shoot a talking-head interview on one side while a product macro set stays live on the other.",
    tags: ["Split partition", "Pipe & drape", "Green room"],
    capacity: 18,
    sizeSqft: 2100,
    host: { name: "Deacon Ellis", verified: true },
    createdAt: new Date("2026-10-01T10:00:00.000Z"),
  },
  {
    slug: "practical-set-stage",
    title: "Practical Set Stage",
    category: "sound-stage",
    city: "Albuquerque",
    area: "Nob Hill",
    country: "USA",
    pricePerHour: 118,
    rating: 4.8,
    reviews: 51,
    image: IMG.stagePractical,
    description:
      "A built apartment practical set with working kitchen, dimmable practicals and a surround catwalk — ready for dialogue days without striking a single flat.",
    tags: ["Built practical set", "Surround catwalk", "Video village"],
    capacity: 16,
    sizeSqft: 1800,
    host: { name: "Renata Ortiz", verified: true },
    createdAt: new Date("2026-06-11T10:00:00.000Z"),
  },
  {
    slug: "writers-table-podcast-room",
    title: "The Writers' Table Podcast Room",
    category: "podcast-room",
    city: "Chicago",
    area: "Wicker Park",
    country: "USA",
    pricePerHour: 32,
    rating: 4.9,
    reviews: 141,
    image: IMG.podcastTable,
    description:
      "Four Shure SM7Bs around one oak table, a treated room that measures RT60 under 0.4s, and a producer desk with a RODECaster ready to record the moment you sit down.",
    tags: ["4× SM7B", "Treated room", "Live producer desk"],
    capacity: 5,
    sizeSqft: 260,
    host: { name: "Priya Anand", verified: true },
    createdAt: new Date("2026-10-19T10:00:00.000Z"),
  },
  {
    slug: "broadcast-booth-12",
    title: "Broadcast Booth 12",
    category: "podcast-room",
    city: "Toronto",
    area: "Queen West",
    country: "Canada",
    pricePerHour: 28,
    rating: 4.7,
    reviews: 77,
    image: IMG.podcastBooth,
    description:
      "A two-seat broadcast booth with a live camera pair, so your audio-only episode can still ship video clips to every platform before you leave the building.",
    tags: ["Camera pair", "Stream encoder", "Sound lock"],
    capacity: 3,
    sizeSqft: 150,
    host: { name: "Noah Beckett", verified: true },
    createdAt: new Date("2026-09-27T10:00:00.000Z"),
  },
  {
    slug: "neve-control-room-a",
    title: "Neve Control Room A",
    category: "music-suite",
    city: "Nashville",
    area: "Music Row",
    country: "USA",
    pricePerHour: 95,
    rating: 5.0,
    reviews: 59,
    image: IMG.musicNeve,
    description:
      "A 24-channel Neve console feeding an iso booth and a 40ft live room with a grand. Engineer available on request; bring your own outboard if you prefer your own colour.",
    tags: ["Neve console", "Iso booth", "Grand piano"],
    capacity: 12,
    sizeSqft: 900,
    host: { name: "Cassie Monroe", verified: true },
    createdAt: new Date("2026-05-30T10:00:00.000Z"),
  },
  {
    slug: "loft-writing-suite",
    title: "Loft Writing Suite",
    category: "music-suite",
    city: "Portland",
    area: "Central Eastside",
    country: "USA",
    pricePerHour: 62,
    rating: 4.8,
    reviews: 103,
    image: IMG.musicLoft,
    description:
      "A calm DAW-forward suite: dual calibration monitors, a key-weighted controller, analog synths on the wall and a couch that has finished more than one record.",
    tags: ["Calibrated monitors", "Analog synths", "Vocal chain"],
    capacity: 6,
    sizeSqft: 480,
    host: { name: "Theo Lindqvist", verified: true },
    createdAt: new Date("2026-08-08T10:00:00.000Z"),
  },
  {
    slug: "control-room-panorama",
    title: "Panorama Control Room",
    category: "music-suite",
    city: "London",
    area: "St Pancras",
    country: "UK",
    pricePerHour: 88,
    rating: 4.9,
    reviews: 47,
    image: IMG.musicAbbey,
    description:
      "Reference monitoring through a 180° window into the live room, recallable patches and a mastering-grade conversion chain for sessions that have to leave finished.",
    tags: ["Mastering chain", "Live-room view", "Recallable patchbay"],
    capacity: 8,
    sizeSqft: 720,
    host: { name: "Edith Marlowe", verified: true },
    createdAt: new Date("2026-04-17T10:00:00.000Z"),
  },
  {
    slug: "makers-wet-studio",
    title: "Maker's Wet Studio",
    category: "art-workshop",
    city: "Seattle",
    area: "Georgetown",
    country: "USA",
    pricePerHour: 41,
    rating: 4.9,
    reviews: 67,
    image: IMG.artWet,
    description:
      "Sinks, spray booths and washable floors built for paint-heavy workshops — tables seat twelve, and every surface has already survived a class of first-timers.",
    tags: ["12 worktables", "Spray booth", "Washable floors"],
    capacity: 14,
    sizeSqft: 1100,
    host: { name: "Yara Okonkwo", verified: true },
    createdAt: new Date("2026-09-12T10:00:00.000Z"),
  },
  {
    slug: "seward-park-atelier",
    title: "Seward Park Atelier",
    category: "art-workshop",
    city: "Seattle",
    area: "Seward Park",
    country: "USA",
    pricePerHour: 37,
    rating: 4.8,
    reviews: 44,
    image: IMG.artAtelier,
    description:
      "North-facing atelier with wall-to-wall easels, a racking kiln in the corner and gallery hanging rails for when the work needs an audience the same evening.",
    tags: ["North light", "Kiln access", "Gallery rails"],
    capacity: 10,
    sizeSqft: 780,
    host: { name: "Greta Lind", verified: true },
    createdAt: new Date("2026-10-24T10:00:00.000Z"),
  },
  {
    slug: "chroma-bay-03",
    title: "Chroma Bay 03",
    category: "green-screen",
    city: "Las Vegas",
    area: "Arts District",
    country: "USA",
    pricePerHour: 86,
    rating: 4.7,
    reviews: 39,
    image: IMG.chroma,
    description:
      "A 16ft cyc painted chroma green with even 5600K wash lighting, tracking markers pre-laid and a monitor wall for real-time key checks.",
    tags: ["Even wash lighting", "Tracking markers", "Monitor wall"],
    capacity: 12,
    sizeSqft: 950,
    host: { name: "Marco Vidal", verified: true },
    createdAt: new Date("2026-11-01T10:00:00.000Z"),
  },
];

const client = new MongoClient(uri);

try {
  await client.connect();
  const collection = client.db(DATABASE).collection(COLLECTION);

  let upserted = 0;
  for (const studio of STUDIOS) {
    const { slug, ...doc } = studio;
    await collection.updateOne(
      { slug },
      { $set: { ...doc, slug, updatedAt: new Date() } },
      { upsert: true },
    );
    upserted += 1;
  }

  const total = await collection.countDocuments();
  const byCategory = await collection
    .aggregate([{ $group: { _id: "$category", n: { $sum: 1 } } }])
    .toArray();

  console.log(`Seeded ${upserted} studios (${total} total in "${COLLECTION}"):`);
  for (const row of byCategory) {
    console.log(`  · ${row._id}: ${row.n}`);
  }
} finally {
  await client.close();
}
