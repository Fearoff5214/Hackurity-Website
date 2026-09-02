"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EVENT_SCHEDULE, type EventScheduleItem } from "@/data/eventSchedule";

type Activity = { item: EventScheduleItem; label: string; active: boolean; index: number };

function getActivity(now: number): Activity {
  const activeIndex = EVENT_SCHEDULE.findIndex((item) => now >= Date.parse(item.start) && now <= Date.parse(item.end));
  if (activeIndex >= 0) return { item: EVENT_SCHEDULE[activeIndex], label: "LIVE NOW", active: true, index: activeIndex };

  const upcomingIndex = EVENT_SCHEDULE.findIndex((item) => now < Date.parse(item.start));
  if (upcomingIndex >= 0) return { item: EVENT_SCHEDULE[upcomingIndex], label: "UP NEXT", active: false, index: upcomingIndex };

  const finalIndex = EVENT_SCHEDULE.length - 1;
  return { item: EVENT_SCHEDULE[finalIndex], label: "EVENT COMPLETE", active: false, index: finalIndex };
}

export default function EventActivityStatus() {
  const [activity, setActivity] = useState<Activity>(() => getActivity(Date.now()));

  useEffect(() => {
    const update = () => setActivity(getActivity(Date.now()));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
      aria-label="Current event activity"
      className="relative overflow-hidden border border-cyber-tan/30 bg-gradient-to-br from-cyber-tan/10 via-cyber-dark to-cyber-blue/10 p-5"
    >
      <motion.div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-cyber-tan" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
      <div className="relative flex items-center justify-between gap-3 font-mono text-[13px] font-bold tracking-[0.16em]">
        <span className="text-cyber-tan">{"// CURRENT_ACTIVITY"}</span>
        <span className={activity.active ? "flex items-center gap-1.5 text-emerald-300" : "text-cyber-blue"}>
          <span className={`h-2 w-2 rounded-full ${activity.active ? "bg-emerald-300 animate-pulse" : "bg-cyber-blue"}`} />
          {activity.label}
        </span>
      </div>
      <div className="relative mt-8">
        <div className="font-terminal text-xs font-bold tracking-[0.14em] text-cyber-tan">{activity.item.id} {"//"} {activity.item.window}</div>
        <h3 className="mt-3 font-heading text-base leading-relaxed text-white uppercase">{activity.item.title}</h3>
        <p className="mt-3 font-mono text-xs leading-relaxed text-cyber-gray">{activity.item.brief}</p>
      </div>
      <div className="relative mt-7">
        <div className="mb-2 flex justify-between font-mono text-[12px] tracking-widest text-cyber-gray/75"><span>EVENT SEQUENCE</span><span>{String(activity.index + 1).padStart(2, "0")}/08</span></div>
        <div className="h-1 overflow-hidden bg-cyber-blue/15"><motion.div className="h-full bg-gradient-to-r from-cyber-blue to-cyber-tan" animate={{ width: `${((activity.index + 1) / EVENT_SCHEDULE.length) * 100}%` }} transition={{ duration: 0.6 }} /></div>
      </div>
    </motion.aside>
  );
}
