import { useMemo } from "react";

type UserTag = "MANAGEMENT" | "OPERATION";

type UserSettings = {
  staffId: string;
  name: string;
  shortName: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  initials: string;
  tag: UserTag;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function getShortName(name: string) {
  return name.split(" ").filter(Boolean)[0];
}

export default function useSettings() {
  const user = useMemo<UserSettings>(() => {
    const fullName = "Hakim Faizal bin Azman";

    return {
      staffId: "DT-10293",
      name: fullName,
      shortName: getShortName(fullName),
      role: "Executive Web Developer",
      department: "Digital & Technology",
      email: "hakim@daythree.com",
      phone: "+60 12-345 6789",
      initials: getInitials(fullName),
      tag: "MANAGEMENT",
    };
  }, []);

  const basicInfo = [
    { label: "Staff ID", value: user.staffId },
    { label: "Role", value: user.role },
    { label: "Department", value: user.department },
  ];

  const contactInfo = [
    { label: "Email", value: user.email },
    ...(user.phone ? [{ label: "Phone", value: user.phone }] : []),
  ];

  return {
    user,
    basicInfo,
    contactInfo,
  };
}
