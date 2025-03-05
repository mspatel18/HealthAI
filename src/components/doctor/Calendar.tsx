"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import {
  Locale,
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInMinutes,
  format,
  getMonth,
  isSameDay,
  isSameHour,
  isSameMonth,
  isToday,
  setHours,
  setMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import {
  ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { PatientDetails } from "./PatientDetails";

const monthEventVariants = cva("size-2 rounded-full", {
  variants: {
    variant: {
      default: "bg-primary",
      blue: "bg-blue-500",
      green: "bg-green-500",
      pink: "bg-pink-500",
      purple: "bg-purple-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const dayEventVariants = cva("font-bold border-l-4 rounded p-2 text-xs", {
  variants: {
    variant: {
      default: "bg-muted/30 text-muted-foreground border-muted",
      blue: "bg-blue-500/30 text-blue-600 border-blue-500",
      green: "bg-green-500/30 text-green-600 border-green-500",
      pink: "bg-pink-500/30 text-pink-600 border-pink-500",
      purple: "bg-purple-500/30 text-purple-600 border-purple-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type View = "day" | "week" | "month" | "year";

type ContextType = {
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  events: CalendarEvent[];
  locale: Locale;
  setEvents: (date: CalendarEvent[]) => void;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  enableHotkeys?: boolean;
  today: Date;
};

const Context = createContext<ContextType>({} as ContextType);

export type CalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: VariantProps<typeof monthEventVariants>["variant"];
};

type CalendarProps = {
  children: ReactNode;
  defaultDate?: Date;
  events?: CalendarEvent[];
  view?: View;
  locale?: Locale;
  enableHotkeys?: boolean;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
};

const Calendar = ({
  children,
  defaultDate = new Date(),
  locale = enUS,
  enableHotkeys = true,
  view: _defaultMode = "week",
  onEventClick,
  events: defaultEvents = [],
  onChangeView,
}: CalendarProps) => {
  const [view, setView] = useState<View>(_defaultMode);
  const [date, setDate] = useState(defaultDate);
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);

  const changeView = (view: View) => {
    setView(view);
    onChangeView?.(view);
  };

  useHotkeys("m", () => changeView("month"), {
    enabled: enableHotkeys,
  });

  useHotkeys("w", () => changeView("week"), {
    enabled: enableHotkeys,
  });

  useHotkeys("y", () => changeView("year"), {
    enabled: enableHotkeys,
  });

  useHotkeys("d", () => changeView("day"), {
    enabled: enableHotkeys,
  });

  return (
    <Context.Provider
      value={{
        view,
        setView,
        date,
        setDate,
        events,
        setEvents,
        locale,
        enableHotkeys,
        onEventClick,
        onChangeView,
        today: new Date(),
      }}
    >
      {children}
    </Context.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCalendar = () => useContext(Context);

const CalendarViewTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    view: View;
  }
>(({ children, view, ...props }) => {
  const { view: currentView, setView, onChangeView } = useCalendar();

  return (
    <Button
      aria-current={currentView === view}
      size="sm"
      variant="ghost"
      {...props}
      onClick={() => {
        setView(view);
        onChangeView?.(view);
      }}
    >
      {children}
    </Button>
  );
});
CalendarViewTrigger.displayName = "CalendarViewTrigger";

const EventGroup = ({
  events,
  hour,
}: {
  events: CalendarEvent[];
  hour: Date;
}) => {
  return (
    <div className="h-20 border-t last:border-b">
      {events
        .filter((event) => isSameHour(event.start, hour))
        .map((event, index) => {
          const hoursDifference =
            differenceInMinutes(event.end, event.start) / 60;
          const startPosition = event.start.getMinutes() / 60;

          return (
            <Sheet key={index}>
              <SheetTrigger asChild>
                <Button
                  // key={event.id}
                  className={cn(
                    `relative hover:bg-${event.color} w-full`,
                    dayEventVariants({ variant: event.color }),
                  )}
                  style={{
                    top: `${startPosition * 100}%`,
                    height: `${hoursDifference * 100}%`,
                  }}
                >
                  {/* <Button variant="outline" asChild></Button> */}
                  {event.title}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-sm overflow-y-auto sm:w-auto">
                <SheetHeader>
                  <SheetTitle></SheetTitle>
                  <SheetDescription className="text-foreground"></SheetDescription>
                  <PatientDetails
                    event={{ ...event, color: event.color ?? "default" }}
                  />
                </SheetHeader>

                <SheetFooter>
                  <SheetClose asChild>
                    {/* <Button type="submit">Save changes</Button> */}
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          );
        })}
    </div>
  );
};

const CalendarDayView = () => {
  const { view, events, date } = useCalendar();
  const containerRef = useRef<HTMLDivElement>(null);

  const hours = [...Array(24)].map((_, i) => setHours(date, i));

  // Find the earliest event time in the day, looking only at hours and minutes
  const earliestEventTime = useMemo(() => {
    if (events.length === 0) return null;

    // Filter events that are in the current day view
    const eventsInDay = events.filter((event) => isSameDay(event.start, date));

    if (eventsInDay.length === 0) return null;

    // Find the earliest time of day (considering only hours and minutes)
    let earliestHour = 24;
    let earliestMinute = 60;

    eventsInDay.forEach((event) => {
      const hours = event.start.getHours();
      const minutes = event.start.getMinutes();

      if (
        hours < earliestHour ||
        (hours === earliestHour && minutes < earliestMinute)
      ) {
        earliestHour = hours;
        earliestMinute = minutes;
      }
    });

    return { hour: earliestHour, minute: earliestMinute };
  }, [events, date]);

  // Scroll to the earliest event time
  useEffect(() => {
    if (view !== "day" || !containerRef.current || !earliestEventTime) return;

    // Calculate scroll position - each hour is 80px (h-20)
    const hourHeight = 80;
    const { hour, minute } = earliestEventTime;

    // Convert to pixels (each hour is 80px, and add the percentage of the hour for minutes)
    // Subtract 1 hour to show a bit of context before the event
    const scrollPosition = Math.max(
      0,
      (hour - 1) * hourHeight + (minute / 60) * hourHeight,
    );

    containerRef.current.scrollTop = scrollPosition;
  }, [view, earliestEventTime]);

  if (view !== "day") return null;

  return (
    <div className="relative flex h-full overflow-auto pt-2" ref={containerRef}>
      <TimeTable />
      <div className="flex-1">
        {hours.map((hour) => (
          <EventGroup key={hour.toString()} hour={hour} events={events} />
        ))}
      </div>
    </div>
  );
};

const CalendarWeekView = () => {
  const { view, date, locale, events } = useCalendar();
  const containerRef = useRef<HTMLDivElement>(null);

  const weekDates = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const hours = [...Array(24)].map((_, i) => setHours(day, i));
      weekDates.push(hours);
    }

    return weekDates;
  }, [date]);

  const headerDays = useMemo(() => {
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const result = addDays(startOfWeek(date, { weekStartsOn: 0 }), i);
      daysOfWeek.push(result);
    }
    return daysOfWeek;
  }, [date]);

  // Find the earliest event time in the week, looking only at hours and minutes
  const earliestEventTime = useMemo(() => {
    if (events.length === 0) return null;

    // Filter events that are in the current week view
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const end = addDays(start, 6);

    const eventsInWeek = events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate >= start && eventDate <= end;
    });

    if (eventsInWeek.length === 0) return null;

    // Find the earliest time of day (considering only hours and minutes)
    let earliestHour = 24;
    let earliestMinute = 60;

    eventsInWeek.forEach((event) => {
      const hours = event.start.getHours();
      const minutes = event.start.getMinutes();

      if (
        hours < earliestHour ||
        (hours === earliestHour && minutes < earliestMinute)
      ) {
        earliestHour = hours;
        earliestMinute = minutes;
      }
    });

    return { hour: earliestHour, minute: earliestMinute };
  }, [events, date]);

  // Scroll to the earliest event time
  useEffect(() => {
    if (view !== "week" || !containerRef.current || !earliestEventTime) return;

    // Calculate scroll position - each hour is 80px (h-20)
    const hourHeight = 80;
    const { hour, minute } = earliestEventTime;

    // Convert to pixels (each hour is 80px, and add the percentage of the hour for minutes)
    // Subtract 1 hour to show a bit of context before the event
    const scrollPosition = Math.max(
      0,
      (hour - 1) * hourHeight + (minute / 60) * hourHeight,
    );

    containerRef.current.scrollTop = scrollPosition;
  }, [view, earliestEventTime]);

  if (view !== "week") return null;

  return (
    <div
      ref={containerRef}
      className="relative flex h-full flex-col overflow-auto"
    >
      <div className="bg-card sticky top-0 z-10 mb-3 flex border-b">
        <div className="w-12"></div>
        {headerDays.map((date, i) => (
          <div
            key={date.toString()}
            className={cn(
              "text-muted-foreground flex flex-1 items-center justify-center gap-1 pb-2 text-center text-sm",
              [0, 6].includes(i) && "text-muted-foreground/50",
            )}
          >
            {format(date, "E", { locale })}
            <span
              className={cn(
                "grid h-6 place-content-center",
                isToday(date) &&
                  "bg-primary text-primary-foreground size-6 rounded-full",
              )}
            >
              {format(date, "d")}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1">
        <div className="w-fit">
          <TimeTable />
        </div>
        <div className="grid flex-1 grid-cols-7">
          {weekDates.map((hours, i) => {
            return (
              <div
                className={cn(
                  "text-muted-foreground h-full border-l text-sm first:border-l-0",
                  [0, 6].includes(i) && "bg-muted/50",
                )}
                key={hours[0].toString()}
              >
                {hours.map((hour) => (
                  <EventGroup
                    key={hour.toString()}
                    hour={hour}
                    events={events}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CalendarMonthView = () => {
  const { date, setDate, setView, view, events, locale } = useCalendar();

  const monthDates = useMemo(() => getDaysInMonth(date), [date]);
  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== "month") return null;

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background sticky top-0 grid grid-cols-7 gap-px border-b">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              "text-muted-foreground mb-2 pr-2 text-right text-sm",
              [0, 6].includes(i) && "text-muted-foreground/50",
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="-mt-px grid flex-1 auto-rows-fr grid-cols-7 gap-px overflow-hidden p-px">
        {monthDates.map((_date) => {
          const currentEvents = events.filter((event) =>
            isSameDay(event.start, _date),
          );

          return (
            <div
              className={cn(
                "text-muted-foreground ring-border overflow-auto p-2 text-sm ring-1",
                !isSameMonth(date, _date) && "text-muted-foreground/50",
              )}
              key={_date.toString()}
              onClick={() => {
                setDate(_date);
                setView("week");
              }}
            >
              <span
                className={cn(
                  "sticky top-0 mb-1 grid size-6 cursor-pointer place-items-center rounded-full",
                  isToday(_date) && "bg-primary text-primary-foreground",
                )}
              >
                {format(_date, "d")}
              </span>

              {currentEvents.map((event) => {
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-1 rounded px-1 text-sm"
                  >
                    <div
                      className={cn(
                        "shrink-0",
                        monthEventVariants({ variant: event.color }),
                      )}
                    ></div>
                    <span className="flex-1 truncate">{event.title}</span>
                    <time className="text-muted-foreground/50 text-xs tabular-nums">
                      {format(event.start, "HH:mm")}
                    </time>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CalendarYearView = () => {
  const { view, date, today, locale } = useCalendar();

  const months = useMemo(() => {
    if (!view) {
      return [];
    }

    return Array.from({ length: 12 }).map((_, i) => {
      return getDaysInMonth(setMonth(date, i));
    });
  }, [date, view]);

  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== "year") return null;

  return (
    <div className="grid h-full grid-cols-4 gap-10 overflow-auto">
      {months.map((days, i) => (
        <div key={days[0].toString()}>
          <span className="text-xl">{i + 1}</span>

          <div className="my-5 grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-muted-foreground text-center text-xs"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-x-2 text-center text-xs tabular-nums">
            {days.map((_date) => {
              return (
                <div
                  key={_date.toString()}
                  className={cn(
                    getMonth(_date) !== i && "text-muted-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "grid aspect-square size-full place-content-center tabular-nums",
                      isSameDay(today, _date) &&
                        getMonth(_date) === i &&
                        "bg-primary text-primary-foreground rounded-full",
                    )}
                  >
                    {format(_date, "d")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const CalendarNextTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  const next = useCallback(() => {
    if (view === "day") {
      setDate(addDays(date, 1));
    } else if (view === "week") {
      setDate(addWeeks(date, 1));
    } else if (view === "month") {
      setDate(addMonths(date, 1));
    } else if (view === "year") {
      setDate(addYears(date, 1));
    }
  }, [date, view, setDate]);

  useHotkeys("ArrowRight", () => next(), {
    enabled: enableHotkeys,
  });

  return (
    <Button
      size="icon"
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        next();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarNextTrigger.displayName = "CalendarNextTrigger";

const CalendarPrevTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  useHotkeys("ArrowLeft", () => prev(), {
    enabled: enableHotkeys,
  });

  const prev = useCallback(() => {
    if (view === "day") {
      setDate(subDays(date, 1));
    } else if (view === "week") {
      setDate(subWeeks(date, 1));
    } else if (view === "month") {
      setDate(subMonths(date, 1));
    } else if (view === "year") {
      setDate(subYears(date, 1));
    }
  }, [date, view, setDate]);

  return (
    <Button
      size="icon"
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        prev();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarPrevTrigger.displayName = "CalendarPrevTrigger";

const CalendarTodayTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { setDate, enableHotkeys, today } = useCalendar();

  useHotkeys("t", () => jumpToToday(), {
    enabled: enableHotkeys,
  });

  const jumpToToday = useCallback(() => {
    setDate(today);
  }, [today, setDate]);

  return (
    <Button
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        jumpToToday();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarTodayTrigger.displayName = "CalendarTodayTrigger";

const CalendarJumpToDate = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { setDate, enableHotkeys, date } = useCalendar();

  useHotkeys("j", () => jumpToSelectedDate(), {
    enabled: enableHotkeys,
  });

  const jumpToSelectedDate = useCallback(() => {
    if (date) {
      setDate(date);
    }
  }, [date, setDate]);

  return (
    <Button
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        jumpToSelectedDate();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});

CalendarJumpToDate.displayName = "CalendarJumpToDate";
const CalendarCurrentDate = () => {
  const { date, view } = useCalendar();

  return (
    <time dateTime={date.toISOString()} className="tabular-nums">
      {format(date, view === "day" ? "dd MMMM yyyy" : "MMMM yyyy")}
    </time>
  );
};

const TimeTable = () => {
  const now = new Date();

  return (
    <div className="w-12 pr-2">
      {Array.from(Array(25).keys()).map((hour) => {
        return (
          <div
            className="text-muted-foreground/50 relative z-50 h-20 text-right text-xs last:h-0"
            key={hour}
          >
            {now.getHours() === hour && (
              <div
                className="z- absolute left-full h-[2px] w-dvw translate-x-2 bg-red-500"
                style={{
                  top: `${(now.getMinutes() / 60) * 100}%`,
                }}
              >
                <div className="absolute top-1/2 left-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500"></div>
              </div>
            )}
            <p className="top-0 -translate-y-1/2">
              {hour === 24 ? 0 : hour}:00
            </p>
          </div>
        );
      })}
    </div>
  );
};

const getDaysInMonth = (date: Date) => {
  const startOfMonthDate = startOfMonth(date);
  const startOfWeekForMonth = startOfWeek(startOfMonthDate, {
    weekStartsOn: 0,
  });

  let currentDate = startOfWeekForMonth;
  const calendar = [];

  while (calendar.length < 42) {
    calendar.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return calendar;
};

const generateWeekdays = (locale: Locale) => {
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), i);
    daysOfWeek.push(format(date, "EEEEEE", { locale }));
  }
  return daysOfWeek;
};

export {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
};
