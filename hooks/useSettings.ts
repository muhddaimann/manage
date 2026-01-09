import { useEffect, useMemo, useState } from "react";
import { useStaffStore } from "../contexts/api/staffStore";
import { updateStaffDetails } from "../contexts/api/staff";
import type { StaffResponse } from "../contexts/api/staff";

function formatJoinDate(dt?: string) {
  if (!dt) return "";
  const d = new Date(dt);
  if (isNaN(d.getTime())) return dt;
  return d.toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function useSettings() {
  const {
    staff,
    loading: staffLoading,
    fetchStaff,
    setStaff,
  } = useStaffStore();

  const [form, setForm] = useState<Partial<StaffResponse> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!staff) fetchStaff();
  }, [staff, fetchStaff]);

  useEffect(() => {
    if (staff) {
      setForm({
        nick_name: staff.nick_name,
        email: staff.email,
        contact_no: staff.contact_no,
        address1: staff.address1,
        address2: staff.address2,
        address3: staff.address3,
      });
    }
  }, [staff]);

  const updateField = (key: keyof StaffResponse, value: any) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const saveProfile = async () => {
    if (!form || !staff) return;

    try {
      setSaving(true);
      setError(null);

      await updateStaffDetails(form);

      setStaff({ ...staff, ...form }); // instant UI update

      fetchStaff(); // fire-and-forget, no await
    } catch (e: any) {
      setError(e.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = useMemo(() => {
    if (!staff || !form) return false;
    return Object.keys(form).some(
      (k) => form[k as keyof StaffResponse] !== staff[k as keyof StaffResponse]
    );
  }, [form, staff]);

  const staffWithFormattedDate = useMemo(() => {
    if (!staff) return null;
    return {
      ...staff,
      join_date_formatted: formatJoinDate(staff.join_date),
    };
  }, [staff]);

  return {
    staff: staffWithFormattedDate,
    form,

    loading: staffLoading,
    saving,
    error,

    hasChanges,
    updateField,
    saveProfile,
  };
}
