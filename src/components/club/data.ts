export type Person = {
  name: string;
  role: string;
  saying: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
};

export type Department = {
  id: string;
  label: string;
  blurb: string;
  people: Person[];
};

const dummy = (name: string, role: string, saying: string, handle: string, phone: string): Person => ({
  name,
  role,
  saying,
  email: `${handle}@revacyberclub.in`,
  phone,
  github: `https://github.com/${handle}`,
  linkedin: `https://www.linkedin.com/in/${handle}`,
});

export const DEPARTMENTS: Department[] = [
  {
    id: "leadership",
    label: "Leadership",
    blurb: "The people who set the direction for the year and keep every team moving.",
    people: [
      dummy(
        "Verril Vaaz",
        "President",
        "Ask questions early. Most problems are easier to fix before they grow.",
        "verril-vaaz",
        "+91 98450 12345",
      ),
      dummy(
        "Dharma Teja",
        "Vice President",
        "Show up, help someone, learn something. That is a good day.",
        "dharma-teja",
        "+91 98450 22346",
      ),
      dummy(
        "Adithya Naik",
        "Vice President",
        "Plan for the worst case, then build for the common one.",
        "adithya-naik",
        "+91 98450 22347",
      ),
    ],
  },
  {
    id: "technical",
    label: "Technical Department",
    blurb: "Runs the workshops, labs and practice challenges the club is known for.",
    people: [
      dummy(
        "Logaa Paramesh",
        "Technical Head",
        "Break it in a lab first, so you never learn it the hard way later.",
        "logaa-paramesh",
        "+91 88704 96955",
      ),
      dummy(
        "Mohammad Omar",
        "Core Technical Associate",
        "Good notes today save hours tomorrow.",
        "mohammad-omar",
        "+91 74559 04156",
      ),
      dummy(
        "Tanush Jain",
        "Technical Associate",
        "Start small, finish it, then make it better.",
        "tanush-jain",
        "+91 89707 90411",
      ),
    ],
  },
  {
    id: "marketing",
    label: "Marketing Department",
    blurb: "Tells the club's story on campus and brings new people through the door.",
    people: [
      dummy(
        "Shirimaly",
        "Marketing Head",
        "If people do not know about it, it did not happen.",
        "shirimaly",
        "+91 98450 33347",
      ),
      dummy(
        "Aditi Rao",
        "Outreach Associate",
        "Every conversation is one more member.",
        "aditi-rao",
        "+91 98450 44348",
      ),
      dummy(
        "Rahul Menon",
        "Content Associate",
        "Say it simply and people will remember it.",
        "rahul-menon",
        "+91 98450 55349",
      ),
    ],
  },
  {
    id: "design",
    label: "Design Department",
    blurb: "Owns the look of everything the club puts out, from posters to this website.",
    people: [
      dummy(
        "Chetan",
        "Design Lead",
        "Clean beats clever almost every time.",
        "chetan",
        "+91 98450 66350",
      ),
      dummy(
        "Nisha Kulkarni",
        "Visual Designer",
        "Details are what people actually notice.",
        "nisha-kulkarni",
        "+91 98450 77351",
      ),
      dummy(
        "Arjun Shetty",
        "Motion Designer",
        "Movement should help you read, not distract you.",
        "arjun-shetty",
        "+91 98450 88352",
      ),
    ],
  },
  {
    id: "events",
    label: "Event Management",
    blurb: "Plans the schedule, the venue and the hundred small things on event day.",
    people: [
      dummy(
        "Sneha Iyer",
        "Events Head",
        "A calm event day is built two weeks earlier.",
        "sneha-iyer",
        "+91 98450 99353",
      ),
      dummy(
        "Karthik Naik",
        "Logistics Associate",
        "Always have a backup plan and a spare cable.",
        "karthik-naik",
        "+91 98451 10354",
      ),
      dummy(
        "Meghna Das",
        "Volunteer Coordinator",
        "Take care of the volunteers and they take care of the event.",
        "meghna-das",
        "+91 98451 21355",
      ),
    ],
  },
  {
    id: "social-media",
    label: "Social Media",
    blurb: "Runs the club's presence online — placeholder roster, real names to follow.",
    people: [
      dummy(
        "TBD",
        "Social Media Head",
        "Placeholder entry — swap in the real details.",
        "social-media-head",
        "+91 00000 00000",
      ),
    ],
  },
];

export type TeamPortrait = {
  name: string;
  role: string;
  linkedin: string;
  photo: string;
};

// Photos and LinkedIn URLs land here as they're provided; until then the
// card falls back to initials and a disabled LinkedIn icon.
export const CONVENORS: TeamPortrait[] = [
  {
    name: "Dr. Ashwin Kumar U M",
    role: "Director & Professor, School of Computer Science and Engineering",
    linkedin: "",
    photo: "/team/ashwinkumar-um.jpg",
  },
  {
    name: "Dr. N P Nethravathi",
    role: "Professor and HOD of CSE (IoT and Cybersecurity including Blockchain Technology)",
    linkedin: "",
    photo: "/team/np-nethravathi.jpg",
  },
];

export const FACULTY_IN_CHARGE: TeamPortrait[] = [
  {
    name: "Prof. Sathish G C",
    role: "Associate Professor, School of Computer Science and Engineering",
    linkedin: "",
    photo: "/team/sathish-gc.jpg",
  },
  {
    name: "Prof. Kiran M",
    role: "Assistant Professor & Head of B.Tech — Artificial Intelligence and Data Science",
    linkedin: "",
    photo: "/team/kiran-m.jpg",
  },
];
