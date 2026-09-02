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
          "Security isn't a checkbox — it's a culture you build one person at a time.",
          "verril-vaz",
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
          "Logaa Paramesh L T",
          "Technical Head",
          "Every system has a weakness. Our job is to find it before someone else does.",
          "logaa-paramesh",
          "TBD",
        ),
        github: "https://github.com/Fearoff5214",
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
          "The best defense starts with awareness — that's the story we're here to tell.",
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
          "If it looks sharp, it gets trusted — design is security's first impression.",
          "chethan-k",
          "+91733-78344158",
        ),
        email: "chethankumar23.2005@gmail.com",
        github: "https://github.com/chetank23",
        linkedin: "https://www.linkedin.com/in/chetank23/",
      },
      dummy(
        "Harshitha M Raj",
        "Design Member",
        "Good design doesn't shout — it just makes people trust what they're looking at.",
        "harshitha-m-raj",
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
        "Event Management",
        "A great CTF isn't won at the keyboard — it's won in the planning.",
        "rohith-l",
        "+91 00000 00000",
      ),
      dummy(
        "Lavanya D",
        "Event Management",
        "Behind every smooth hackathon is a hundred things that almost went wrong.",
        "lavanya-d",
        "+91 80730 48671",
      ),
      dummy(
        "Ramya VK",
        "Event Management",
        "Details make the difference between a good event and a great one.",
        "ramya-vk",
        "+91 00000 00000",
      ),
      dummy(
        "Adithi Bisappa Gowda",
        "Event Management",
        "Security is a team sport — so is pulling off a 24-hour hackathon.",
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
        "We don't just post updates, we build the community that shows up.",
        "social-media-head",
        "+91 00000 00000",
      ),
      {
        name: "Shreya Hiremath",
        role: "Social Media Associate",
        saying: "A good post won't patch a vulnerability, but it'll get the right people talking about one.",
        email: "shreya-hiremath@revacyberclub.in",
        phone: "+91 00000 00000",
        github: "https://github.com/NinjaCoder03",
        linkedin: "https://www.linkedin.com/in/shreya-hiremath-86a853331?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      },
      {
        ...dummy(
          "Shrishail Biradar",
          "Social Media Member",
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
  {
    name: "Dr. Syed Thouheed Ahmed",
    role: "Director (I/C) & Associate Professor - School Of CSE",
    linkedin: "",
    photo: "/team/convenor-new.png",
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
