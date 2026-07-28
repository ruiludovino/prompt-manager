import { signOutAction } from "@/lib/auth-actions";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-text-faint transition hover:bg-surface-high hover:text-text"
      >
        <LogOut size={13} />
        Sign out
      </button>
    </form>
  );
}
