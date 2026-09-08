export type Person = {
  name: string;
  role: string;
  saying: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  /** Optional headshot. Local file in /public wins; Drive URL can be used as fallback. */
  photo?: string;
  /** CSS transform scale for the photo — use to crop in on a specific photo. Defaults to 1. */
  photoZoom?: number;
  /** CSS object-position for the photo, e.g. "70% 35%". Defaults to "50% 50%". */
  photoPosition?: string;
};

export type Department = {
  id: string;
  label: string;
  blurb: string;
  people: Person[];
};

const drive = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;

const dummy = (
  name: string,
  role: string,
  saying: string,
  handle: string,
  phone: string,
): Person => ({
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
        photo: "/members/LeadershipRole/Verrilvaaz.png",
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
        photo: "/members/LeadershipRole/dharma.png",
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
        photo: "/members/Technical_department/logaa.png",
      },
      {
        ...dummy(
          "Mohammad Omar",
          "Technical Member",
          "Immense knowledge is fetched by having an intersection of many interests.",
          "mohammad-omar",
          "+91 74559 04156",
        ),
        email: "omarofficial1054@gmail.com",
        github: "https://github.com/MohammadOmar1054",
        linkedin: "https://www.linkedin.com/in/mohammad-omar-a81b28388/",
        photo: "/members/Technical_department/Omer.jpg",
      },
      {
        ...dummy(
          "Tanush Jain",
          "Technical Member",
          "Start small, finish it, then make it better.",
          "tanush-jain",
          "+91 89707 90411",
        ),
        email: "brandwopio76@gmail.com",
        github: "https://github.com/Tanush-Jain",
        linkedin: "https://www.linkedin.com/in/tanush-jain-17601321a/",
        photo: "/members/Technical_department/tanush.png",
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
          "Sharmily H",
          "Marketing Head",
          "There is nothing called a SUCCESS or FAILURE, Everything is a different experience!",
          "sharmily",
          "+91 9008897013",
        ),
        email: "sharmi16605@gmail.com",
        github: "https://github.com/Sharmily-cloud",
        linkedin: "https://www.linkedin.com/in/sharmily-h-46873b293",
        photo: drive("1JhYm7ur6_71Xj93MM_D6VfeB9DRwpaki"),
      },
      {
        ...dummy(
          "Rachana Panibathe",
          "Marketing Member",
          "The best defense starts with awareness — that's the story we're here to tell.",
          "rachana",
          "+91 00000 00000",
        ),
        photo: drive("1VYM5RodLP8r1UbDrrcKIKDyUdqoW-dBs"),
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
          "Chetan K",
          "Design Team Lead",
          "Good design makes complex ideas feel effortless.",
          "chetan-k",
          "+91 00000 00000",
        ),
        photo: "/members/DesignTeam/DesignChetan.jpeg",
        linkedin: "https://www.linkedin.com/in/chetank23/",
        github: "https://github.com/chetank23",
      },
      // {
      //   ...dummy(
      //     "Chetan Kumar H M",
      //     "Design Associate",
      //     "If it looks sharp, it gets trusted — design is security's first impression.",
      //     "chethan-k",
      //     "+91733-78344158",
      //   ),
      //   email: "chethankumar23.2005@gmail.com",
      //   github: "https://github.com/chetank23",
      //   linkedin: "https://www.linkedin.com/in/chetank23/",
      //   photo: drive("1qj1SWxMYHvBUAppbJgLBu7HeGqgwacnz"),
      // },
      {
        ...dummy(
          "Harshitha M Raj",
          "Design Member",
          "Good design doesn't shout — it just makes people trust what they're looking at.",
          "harshitha-m-raj",
          "+91 00000 00000",
        ),
        photo: "/members/DesignTeam/harshitaRaj.jpeg",
        photoZoom: 1.6,
        photoPosition: "62% 45%",
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
          "Rohit L",
          "Lead Manager — Events",
          "A great CTF isn't won at the keyboard — it's won in the planning.",
          "rohith-l",
          "+91 00000 00000",
        ),
        photo: "/members/EventManagers/rohit.png",
      },
      {
      ...dummy(
        "Lavanya D",
        "Event Management Member",
        "Behind every smooth hackathon is a hundred things that almost went wrong.",
        "lavanya-d",
        "+91 80730 48671",
      ),
      photo: "/members/EventManagers/lavanya.jpeg",

    },
      
      {
        ...dummy(
          "Ramya VK",
          "Event Management Member",
          "Details make the difference between a good event and a great one.",
          "ramya-vk",
          "+91 00000 00000",
        ),
        photo: drive("11wZ2Uxbh_uOXaS-YUmnmh28Sh-KoCSj5"),
      },
      {
        ...dummy(
          "Adithi Bisappa Gowda",
          "Event Management Member",
          "Security is a team sport — so is pulling off a 24-hour hackathon.",
          "adithi-bisappa-gowda",
          "+91 00000 00000",
        ),
        photo: "/members/EventManagers/adithi.png",
      },
      {
        ...dummy(
          "K P Yogesh",
          "Event Management Member",
          "Go where you grow — all is possible.",
          "kp-yogesh",
          "+91 00000 00000",
        ),
        photo: "/members/EventManagers/yogesh.png",
      },
      {
        ...dummy(
          "Gagana V",
          "Event Management Member",
          "The little details are what make an event feel put together.",
          "gagana-v",
          "+91 00000 00000",
        ),
        photo: "/members/EventManagers/gagana.png",
      },
    ],
  },
  {
    id: "social-media",
    label: "Social Media",
    blurb: "Runs the club's presence online.",
    people: [
      {
        ...dummy(
          "Shrishail G Biradar",
          "Social Media Lead",
          "All power is within you.",
          "shrishail-biradar",
          "+91 9880221935",
        ),
        email: "shrishailbiradar2004@gmail.com",
        github: "https://github.com/Shrishailgb24",
        linkedin: "https://www.linkedin.com/in/shrishail-biradar-761833296",
        photo: drive("1OtDtc9Peeqfg3k3PU05rEbLadTpTWDlQ"),
      },
      {
        name: "Shreya Hiremath",
        role: "Social Media Member",
        saying: "A good post won't patch a vulnerability, but it'll get the right people talking about one.",
        email: "shreya-hiremath@revacyberclub.in",
        phone: "+91 00000 00000",
        github: "https://github.com/NinjaCoder03",
        linkedin:
          "https://www.linkedin.com/in/shreya-hiremath-86a853331?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        photo: drive("10Y4i5E4GFrRzMeEfph7jWy-00fczaMpo"),
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