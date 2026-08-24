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
          "Verril Vaz",
          "President",
          "Ask questions early. Most problems are easier to fix before they grow.",
          "verril-vaaz",
          "+91 8971889830",
        ),
        email: "verrilvaz404@gmail.com",
        linkedin: "https://www.linkedin.com/in/verrilvaz",
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
          "Logaa Paramesh L T",
          "Technical Head",
          "Break it in a lab first, so you never learn it the hard way later.",
          "logaa-paramesh",
          "+91 88704 96955",
        ),
        email: "parameshlogaa@gmail.com",
        github: "https://github.com/Fearoff5214",
        linkedin: "https://www.linkedin.com/in/logaa-paramesh-l-t/",
      },
      {
        ...dummy(
          "Mohammad Omar",
          "Core Technical Associate",
          "Good notes today save hours tomorrow.",
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
      dummy(
        "Sharmily",
        "Member",
        "Bio coming soon.",
        "sharmily",
        "+91 00000 00000",
      ),
      dummy(
        "Rachana",
        "Member",
        "Bio coming soon.",
        "rachana",
        "+91 00000 00000",
      ),
    ],
  },
  {
    id: "design",
    label: "Design Department",
    blurb: "Owns the look of everything the club puts out, from posters to this website.",
    people: [
      dummy(
        "Chethan K",
        "Member",
        "Bio coming soon.",
        "chethan-k",
        "+91 00000 00000",
      ),
    ],
  },
  {
    id: "events",
    label: "Event Management",
    blurb: "Plans the schedule, the venue and the hundred small things on event day.",
    people: [
      dummy(
        "Rohith L",
        "Member",
        "Bio coming soon.",
        "rohith-l",
        "+91 00000 00000",
      ),
      dummy(
        "Lavanya D",
        "Member",
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
      dummy(
        "Yogesh K P",
        "Member",
        "Bio coming soon.",
        "yogesh-k-p",
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
        "Shrishail Biradar",
        "Member",
        "Bio coming soon.",
        "shrishail-biradar",
        "+91 00000 00000",
      ),
      dummy(
        "Shreya Hiremath",
        "Member",
        "Bio coming soon.",
        "shreya-hiremath",
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
