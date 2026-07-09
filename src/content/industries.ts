// Industries Cubiccode serves  authoritative copy. Drives /industries/[slug] + homepage grid.

export type Industry = {
  slug: string;
  icon: string; // lucide-react name
  title: string;
  short: string; // homepage grid description
  headline: string;
  subheadline: string;
  cta: string;
  problem: string; // opening problem paragraph
  solutions: string[]; // "How We Help" bullets
  /**
   * "How We Do It Better"  one block per point, rendered as a numbered card.
   * Keep these balanced (roughly 140175 chars each) so no card looks starved
   * or overstuffed next to its neighbours.
   */
  better: string[];
  /** "The Result"  short outcome phrases, rendered as a row of outcome cards. */
  result: string[];
  proof?: { value: string; label: string }[];
};

export const industries: Industry[] = [
  {
    slug: "manufacturing",
    icon: "Factory",
    title: "Industries & Manufacturing Units",
    short:
      "B2B catalogues that win buyers, ERP that ties production to dispatch, and automation that ends the spreadsheet era.",
    headline: "Your factory runs on precision. Your digital systems should too.",
    subheadline:
      "B2B catalogues that win buyers, ERP that ties production to inventory to dispatch, and automation that ends the spreadsheet era  built for manufacturers who are ready to scale.",
    cta: "Modernise Your Operations",
    problem:
      "Your buyers are searching online before they ever call  but your website is an outdated brochure, or you don't have one. Inside the plant, production, inventory, purchase and dispatch live in separate spreadsheets and people's heads. Orders get missed, stock runs out or piles up, and you can't see your true margins until month-end. Meanwhile, more digital-savvy competitors are quietly taking your buyers.",
    solutions: [
      "B2B product catalogue websites that present your full range, certifications and capabilities to serious buyers.",
      "RFQ & enquiry portals so quote requests are captured, routed and tracked  never lost.",
      "Custom ERP connecting production, inventory, procurement, accounts and dispatch into one live view.",
      "Dealer & distributor portals for ordering, pricing and stock visibility.",
      "Workflow automation for approvals, purchase orders, low-stock alerts and reporting.",
      "Industrial SEO so buyers searching your products and city find you first.",
    ],
    better: [
      "We map your actual shop-floor and back-office workflow before we write a single line of code, then build systems that fit how you already work.",
      "One accountable team carries you from that first workflow map through to deployment and support, under audited ISO 9001:2015 processes.",
      "The software is yours outright. No per-seat licences, no vendor lock-in, and no month-end scramble to discover what your true margins were.",
    ],
    result: [
      "Real-time visibility from raw material to dispatch",
      "Fewer costly errors across production",
      "A digital front door that wins qualified B2B enquiries",
    ],
  },
  {
    slug: "education",
    icon: "GraduationCap",
    title: "Education & Training Institutes",
    short:
      "Admission-driven websites, student portals and automation  built by a team that runs its own award-winning institutes.",
    headline: "Fill more seats. Lose fewer enquiries. Run admissions on autopilot.",
    subheadline:
      "Admission-driven websites, student portals and automation built by a team that runs its own award-winning training institutes  so we know exactly what converts a curious parent into an enrolled student.",
    cta: "Grow Your Admissions",
    problem:
      "Every admission season, enquiries pour in through calls, WhatsApp and walk-ins  and a painful number slip through the cracks because no one followed up in time. Your website looks dated next to competitors, fee and attendance tracking is manual, and you have no easy way to nurture interested parents until they enrol.",
    solutions: [
      "Lead generation  capture intent leads through cookies, Google search and Meta.",
      "Admission-focused websites engineered to capture and convert enquiries.",
      "Lead-capture & follow-up automation so no interested parent is ever forgotten.",
      "Student & admission portals for applications, fees, attendance and results.",
      "Learning Management Systems (LMS) for online and blended courses.",
      "Local & education SEO so you rank when parents search “best [course] in [city]”.",
      "Fee & communication automation  reminders, receipts and updates that send themselves.",
    ],
    better: [
      "We're not guessing at this industry, we live in it. Cubiccode runs its own training brands, so every system we ship has already been tested on our own institutes.",
      "Our co-founder was named Best Youngest Digital Marketing Teacher in India, and that classroom experience shapes how we design admissions and student journeys.",
      "We build the systems we'd want for ourselves: enquiry capture that never leaks, follow-ups that run on their own, and admin your staff stop dreading.",
    ],
    result: [
      "More enquiries captured, more of them converted",
      "Less admin for your teaching and office staff",
      "A presence that makes your institute the obvious choice",
    ],
  },
  {
    slug: "logistics",
    icon: "Truck",
    title: "Logistics & Transport",
    short:
      "Tracking dashboards, online booking and fleet & dispatch systems that replace “where's my shipment?” calls with real-time answers.",
    headline: "Give your customers visibility. Give yourself control.",
    subheadline:
      "Tracking dashboards, online booking, and fleet & dispatch systems that replace endless “where's my shipment?” calls with real-time answers.",
    cta: "Streamline Your Fleet",
    problem:
      "Your customers call constantly to ask where their consignment is  and your team digs through spreadsheets and phone calls to answer. Bookings come over the phone, dispatch is coordinated on WhatsApp, and you have no single view of your fleet, drivers or deliveries. As volume grows, the chaos grows faster.",
    solutions: [
      "Customer tracking portals  real-time shipment status, no phone call required.",
      "Online booking platforms for instant consignment and load booking.",
      "Fleet & dispatch dashboards  vehicles, drivers, routes and deliveries in one view.",
      "Custom logistics ERP connecting bookings, dispatch, billing and accounts.",
      "Automated notifications  pickup, in-transit and delivery updates sent automatically.",
      "SEO & web presence so shippers searching for transport partners find you.",
    ],
    better: [
      "We start with your biggest bottleneck, usually status-tracking calls or dispatch coordination, and remove that one first before touching anything else.",
      "Every change ships with clear before-and-after metrics, so you see exactly how many hours and how many phone calls you've eliminated. Nothing is taken on faith.",
      "Then we widen the fix outward, from tracking to dispatch to reporting, until growth stops meaning more chaos and more calls for your team to field.",
    ],
    result: [
      "Customers who self-serve their own tracking",
      "A dispatch team running on data, not guesswork",
      "An operation that scales without the chaos",
    ],
  },
  {
    slug: "healthcare",
    icon: "Stethoscope",
    title: "Healthcare  Hospitals, Clinics & Wellness",
    short:
      "Appointment-booking websites, patient portals and reminder automation that fill your calendar and free your front desk.",
    headline: "More patients booked. Fewer no-shows. A practice that runs itself.",
    subheadline:
      "Appointment-booking websites, patient portals and reminder automation for hospitals, clinics and wellness centres  built to fill your calendar and free up your front desk.",
    cta: "Grow Your Practice",
    problem:
      "Patients want to book online at 11pm  but your only option is calling during clinic hours, so they book your competitor instead. Your front desk is buried in appointment calls and reminder follow-ups, no-shows eat into revenue, and when patients search for your speciality in your city, you're nowhere near the top of Google.",
    solutions: [
      "Appointment-booking websites  patients book 24/7, your calendar fills itself.",
      "Automated reminders  SMS/WhatsApp/email that slash no-shows.",
      "Patient portals for records, reports, prescriptions and follow-ups.",
      "Clinic & hospital management dashboards  appointments, doctors, billing in one place.",
      "Local SEO & Google Business Profile  own the “[speciality] near me” searches.",
      "Review & reputation building  turn happy patients into your best marketing.",
    ],
    better: [
      "We design for the realities of a busy practice. Booking flows are simple enough for a nervous or elderly patient to finish on the first try, without a phone call.",
      "Automated reminders quietly cut no-shows, and patient information is handled with the privacy and care your practice is held to.",
      "Local SEO puts you above the clinic down the road, so you're the first result when someone searches in a moment of need, not the fourth.",
    ],
    result: [
      "A calendar that stays booked out",
      "A front desk freed from phone tag",
      "Fewer no-shows, week after week",
      "Top-of-search presence that brings new patients",
    ],
  },
  {
    slug: "construction",
    icon: "Building2",
    title: "Construction & Real Estate",
    short:
      "Stunning project showcases, property listing portals and lead systems that turn browsers into buyers.",
    headline: "Showcase your projects. Capture every lead. Close more deals.",
    subheadline:
      "Stunning project showcases, property listing portals and lead systems that turn browsers into buyers  and make sure no enquiry ever slips away.",
    cta: "Sell More Properties",
    problem:
      "Property is sold on emotion and trust  but your projects are shown in low-res photos on a slow, dated website, and high-value enquiries arrive and then vanish into an inbox with no follow-up. You're spending on ads to generate leads, then leaking them because there's no system to capture and nurture them.",
    solutions: [
      "Premium project & property showcase websites with galleries, walkthroughs and floor plans.",
      "Property listing portals with search, filters and enquiry capture.",
      "Lead-capture & CRM systems so every enquiry is logged, assigned and followed up.",
      "Follow-up automation  instant responses and nurture sequences that keep leads warm.",
      "Real estate SEO & local visibility for “flats/plots/villas in [location]”.",
      "Virtual tours & rich media that sell the space before the site visit.",
    ],
    better: [
      "We treat your ad spend as sacred. Every rupee you put into generating a lead is wasted the moment that lead sits unanswered in somebody's inbox.",
      "So every system is engineered so the leads you pay for get captured, responded to instantly, and nurtured patiently until they're ready to convert.",
      "Reporting shows you exactly where each deal came from, so you can put more money behind what works and stop quietly funding what doesn't.",
    ],
    result: [
      "Projects that look as premium as they are",
      "A lead pipeline that never leaks",
      "A clear line from enquiry to closed sale",
    ],
  },
  {
    slug: "smes",
    icon: "Store",
    title: "Small & Medium Enterprises (SMEs)",
    short:
      "Websites, e-commerce, automation and SEO at a price that respects your budget. You run the business; we run the tech.",
    headline: "One partner for everything digital. So you can get back to business.",
    subheadline:
      "Websites, e-commerce, automation and SEO at a price that respects your budget  from a team that's helped 500+ businesses grow. You run the business; we run the tech.",
    cta: "Grow My Business",
    problem:
      "As an SME, you're already wearing five hats. You know you need a better website, you'd love to sell online, you're drowning in repetitive admin  but you don't have the budget for a big agency, the time to manage five different vendors, or the in-house tech team to make it happen. So it all keeps getting pushed to “later.”",
    solutions: [
      "Conversion-focused websites that win trust and generate enquiries.",
      "E-commerce stores to sell online without the complexity.",
      "Workflow automation to wipe out the repetitive admin draining your day.",
      "SEO & local visibility so customers in your area find you, not a competitor.",
      "One accountable partner for all of it  no juggling vendors.",
    ],
    better: [
      "Our in-house expertise makes us efficient, and we pass that efficiency straight to you: premium, ISO-certified work at genuinely SME-friendly pricing.",
      "“Worth every rupee,” in one client's words. You're never paying an agency to quietly subcontract your project to somebody you'll never meet.",
      "You get a single team that owns your whole digital presence, and a phone number that someone on that team actually picks up when you call.",
    ],
    result: [
      "A presence that competes with far bigger businesses",
      "Fewer hours lost to admin every week",
      "A partner who grows alongside you",
    ],
  },
  {
    slug: "retail",
    icon: "ShoppingBag",
    title: "Retail Chains & Franchises",
    short:
      "Multi-location management, online ordering and franchise & inventory systems that keep every outlet consistent and connected.",
    headline: "One brand. Many locations. Total control.",
    subheadline:
      "Multi-location management, online ordering, and franchise & inventory systems that keep every outlet consistent, connected and visible in local search.",
    cta: "Scale Your Chain",
    problem:
      "Every outlet does its own thing  inconsistent branding, separate (or no) online ordering, inventory you can't see across locations, and a head office flying blind on what's actually happening store-by-store. As you add franchises, the inconsistency multiplies and the brand dilutes.",
    solutions: [
      "Multi-location websites with location finders and per-outlet local SEO.",
      "Online ordering & e-commerce  unified or location-specific.",
      "Inventory & franchise management dashboards  every store, one live view.",
      "Loyalty & customer-data systems to turn one-time buyers into regulars.",
      "Automated reporting so head office sees performance across all outlets.",
      "Local SEO per location  every branch ranks in its own neighbourhood.",
    ],
    better: [
      "We build for consistency and local relevance at the same time, because a chain that looks different in every town is a chain nobody quite trusts.",
      "Central brand control keeps every outlet on message, while local-search visibility gives each one what it needs to win its own neighbourhood.",
      "It's one system, fully owned by you, that grows cleanly with every location you open instead of fighting you by the time you reach the tenth.",
    ],
    result: [
      "A consistent brand across every outlet",
      "Real-time visibility, location by location",
      "More orders placed online",
      "A chain that gets easier to manage as it grows",
    ],
  },
  {
    slug: "staffing",
    icon: "Users",
    title: "HR & Staffing Agencies",
    short:
      "Job portals, candidate-tracking systems and screening automation  built by a team that runs its own IT recruitment platform.",
    headline: "Place more candidates with less manual work.",
    subheadline:
      "Job portals, candidate-tracking systems and screening automation  built by a team that runs its own IT recruitment and careers platform, so we know the workflow from the inside.",
    cta: "Automate Your Hiring",
    problem:
      "Your recruiters live in spreadsheets and inboxes  tracking candidates across stages, posting jobs to ten places by hand, scheduling interviews over endless email chains, and re-keying the same data again and again. The result is slow placements, candidates who fall through the cracks, and clients you can't update fast enough.",
    solutions: [
      "Branded job portals & careers sites that attract and capture candidates.",
      "Applicant Tracking Systems (ATS)  every candidate, every stage, one dashboard.",
      "Screening & scheduling automation  shortlist, notify and book interviews automatically.",
      "Client portals so your clients see live status on their open roles.",
      "Candidate–role matching to surface the right people faster.",
      "Communication automation for applications, updates and follow-ups.",
    ],
    better: [
      "This is our own backyard. Cubiccode runs IT recruitment and the CareerJump careers platform, so we're building for a desk we sit at every single day.",
      "That means staffing systems we'd actually use ourselves, designed around how recruiters really work rather than how software vendors imagine they work.",
      "Candidates stop falling through the cracks, and your recruiters stop retyping the same details into three different tools. That's the whole point.",
    ],
    result: [
      "Faster placements",
      "No candidates lost between systems",
      "Happier clients",
      "Recruiters matching people, not retyping data",
    ],
  },
  {
    slug: "startups",
    icon: "Rocket",
    title: "New Start-ups",
    short:
      "From landing page to MVP to full web app  launch credible, scalable products fast, without burning your runway.",
    headline: "Look funded. Move fast. Build to scale.",
    subheadline:
      "From landing page to MVP to full web app  we help founders launch credible, scalable products quickly, from a company that's itself been awarded 5x.",
    cta: "Launch Your Idea",
    problem:
      "You're racing against your runway. You need to look credible enough to win early customers and investors, ship an MVP fast enough to test the market, and build on an architecture that won't collapse the moment you get traction  all without burning your limited capital on the wrong tech decisions.",
    solutions: [
      "High-converting landing pages to validate demand and capture early signups.",
      "MVP development  ship a real, usable product in weeks, not months.",
      "Scalable web apps built to grow with your user base.",
      "Brand, website & launch support so you look credible from day one.",
      "Payment & subscription systems ready for revenue.",
      "Growth & SEO from day one.",
    ],
    better: [
      "We've been a start-up ourselves: bootstrapped, lean and obsessed with shipping. We know which corners cost you nothing and which ones cost you the company.",
      "So we help you spend capital where it counts, on a credible brand and a fast MVP now, rather than on infrastructure for users you don't have yet.",
      "It ships on an architecture that scales the moment traction hits. One accountable team, one timeline, and not a single week of wasted runway.",
    ],
    result: [
      "A product that looks funded",
      "An MVP that ships fast",
      "Architecture built to scale on traction",
      "Confidence with first customers and investors",
    ],
  },
];

export const industryBySlug = (slug: string) =>
  industries.find((i) => i.slug === slug);
