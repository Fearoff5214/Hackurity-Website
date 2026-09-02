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
      {
        ...dummy(
          "Chetan",
          "President",
          "Details pending.",
          "chetan",
          "TBD",
        ),
      },
      {
        ...dummy(
          "Dharma Teja",
          "Vice President",
          "Show up, help someone, learn something. That is a good day.",
          "dharma-teja",
          "+91 79 7565 0280",
        ),
        email: "rcdt009@gmail.com",
        linkedin: "https://www.linkedin.com/in/dharmatejarc06/",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical Department",
    blurb: "Runs the workshops, labs and practice challenges the club is known for.",
    people: [
      {
        ...dummy(
          "Lavanya",
          "Technical Head",
          "Details pending.",
          "lavanya",
          "TBD",
        ),
      },
      {
        ...dummy(
          "Mohammad Omar",
          "Core Technical Associate",
          "Immense knowledge is fetched by having an intersection of many interests.",
          "mohammad-omar",
          "+91 74559 04156",
        ),
        email: "omarofficial1054@gmail.com",
        github: "https://github.com/MohammadOmar1054",
        linkedin: "https://www.linkedin.com/in/mohammad-omar-a81b28388/",
      },
      {
        ...dummy(
          "Tanush Jain",
          "Technical Associate",
          "Start small, finish it, then make it better.",
          "tanush-jain",
          "+91 89707 90411",
        ),
        email: "brandwopio76@gmail.com",
        github: "https://github.com/Tanush-Jain",
        linkedin: "https://www.linkedin.com/in/tanush-jain-17601321a/",
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing Department",
    blurb: "Tells the club's story on campus and brings new people through the door.",
    people: [
      {
        ...dummy(
          "Sharmily",
          "Marketing Head",
          "There is nothing called a SUCCESS or FAILURE, Everything is a different experience! ",
          "sharmily",
          "+91 9008897013",
        ),
        email: "sharmi16605@gmail.com",
        github: "https://github.com/Sharmily-cloud",
        linkedin: "https://www.linkedin.com/in/sharmily-h-46873b293",
      },
      {
        ...dummy(
          "Rachana",
          "Member",
          "Bio coming soon.",
          "rachana",
          "+91 00000 00000",
        ),
      },
    ],
  },
  {
    id: "design",
    label: "Design Department",
    blurb: "Owns the look of everything the club puts out, from posters to this website.",
    people: [
      {
        ...dummy(
          "Chethan K",
          "Design Team Head",
          "One-man army — owns every pixel the club puts out.",
          "chethan-k",
          "+91733-78344158",
        ),
        email: "chethankumar23.2005@gmail.com",
        github: "https://github.com/chetank23",
        linkedin: "https://www.linkedin.com/in/chetank23/",
      },
    ],
  },
  {
    id: "events",
    label: "Event Management",
    blurb: "Plans the schedule, the venue and the hundred small things on event day.",
    people: [
      {
        ...dummy(
          "KP Yogesh",
          "Member",
          "Hack the threats. Protect the future.",
          "kp-yogesh",
          "+91 7337669542",
        ),
        email: "kpyogesh25@gmail.com",
        github: "https://github.com/yogeshkp04",
        linkedin: "https://www.linkedin.com/in/kpyogesh",
      },
      dummy(
        "Rohith L",
        "Member",
        "Bio coming soon.",
        "rohith-l",
        "+91 00000 00000",
      ),
      dummy(
        "Lavanya D",
        "Event Management Head",
        "Bio coming soon.",
        "lavanya-d",
        "+91 00000 00000",
      ),
      dummy(
        "Ramya VK",
        "Member",
        "Bio coming soon.",
        "ramya-vk",
        "+91 00000 00000",
      ),
      dummy(
        "Adithi Bisappa Gowda",
        "Member",
        "Bio coming soon.",
        "adithi-bisappa-gowda",
        "+91 00000 00000",
      ),
    ],
  },
  {
    id: "social-media",
    label: "Social Media",
    blurb: "Runs the club's presence online.",
    people: [
      dummy(
        "TBD",
        "Social Media Head",
        "Placeholder entry — swap in the real details.",
        "social-media-head",
        "+91 00000 00000",
      ),
      {
        name: "Shreya Hiremath",
        role: "Social Media Associate",
        saying: "Placeholder entry — swap in the real details.",
        email: "shreya-hiremath@revacyberclub.in",
        phone: "+91 00000 00000",
        github: "https://github.com/NinjaCoder03",
        linkedin: "https://www.linkedin.com/in/shreya-hiremath-86a853331?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      },
      {
        ...dummy(
          "Shrishail Biradar",
          "Member",
          "All power is within you",
          "shrishail-biradar",
          "+91 9880221935",
        ),
        email: "shrishailbiradar2004@gmail.com",
        github: "https://github.com/Shrishailgb24",
        linkedin: "https://www.linkedin.com/in/shrishail-biradar-761833296",
      },
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
