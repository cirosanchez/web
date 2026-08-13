"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="max-w-sm space-y-4 text-sm">
      <div className="space-y-2">
        <label htmlFor="password" className="block text-neutral-400">
          password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className="w-full bg-transparent border border-neutral-700 px-3 py-2 text-neutral-300 outline-none focus:border-neutral-500"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="border border-neutral-700 px-4 py-2 text-neutral-300 hover:border-neutral-500 hover:underline disabled:opacity-50 disabled:hover:no-underline"
      >
        {pending ? "checking..." : "enter"}
      </button>

      {state.error && (
        <p role="alert" className="text-red-400">
          {state.error}
        </p>
      )}
    </form>
  );
}
