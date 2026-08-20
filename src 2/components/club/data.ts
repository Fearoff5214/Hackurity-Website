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
    blurb: "The two people who set the direction for the year and keep every team moving.",
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
];

export type Faculty = Person & { title: string };

export const FACULTY: Faculty[] = [
  {
    name: "Dr. Anand Krishnan",
    title: "Faculty In-Charge",
    role: "Professor, School of Computing & IT",
    saying: "Students learn security best when they are allowed to try, fail and try again.",
    email: "anand.krishnan@reva.edu.in",
    phone: "+91 80 4696 6666",
    github: "https://github.com/anand-krishnan",
    linkedin: "https://www.linkedin.com/in/anand-krishnan",
  },
  {
    name: "Dr. Priya Nandini",
    title: "Faculty Co-ordinator",
    role: "Associate Professor, Computer Science",
    saying: "A curious student with a lab is worth more than any textbook chapter.",
    email: "priya.nandini@reva.edu.in",
    phone: "+91 80 4696 6667",
    github: "https://github.com/priya-nandini",
    linkedin: "https://www.linkedin.com/in/priya-nandini",
  },
  {
    name: "Prof. Ravi Shankar",
    title: "Technical Advisor",
    role: "Assistant Professor, Networks & Systems",
    saying: "Understand the network first. Everything else follows from that.",
    email: "ravi.shankar@reva.edu.in",
    phone: "+91 80 4696 6668",
    github: "https://github.com/ravi-shankar",
    linkedin: "https://www.linkedin.com/in/ravi-shankar",
  },
  {
    name: "Dr. Fatima Sheikh",
    title: "Industry Liaison",
    role: "Professor, Data Privacy & Governance",
    saying: "Good security is mostly good habits, repeated.",
    email: "fatima.sheikh@reva.edu.in",
    phone: "+91 80 4696 6669",
    github: "https://github.com/fatima-sheikh",
    linkedin: "https://www.linkedin.com/in/fatima-sheikh",
  },
];
