"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { login, type LoginState } from "../actions";
import { BoxInput, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const t = useTranslations("admin.login");
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="mt-2 w-full" disabled={pending}>
      {pending ? t("submitting") : t("submit")}
    </Button>
  );
}

export function LoginForm() {
  const t = useTranslations("admin.login");
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="text-center">
        <h2 className="font-serif text-xl font-light text-ink">{t("title")}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t("subtitle")}</p>
      </div>

      <div>
        <Label htmlFor="username">{t("username")}</Label>
        <BoxInput id="username" name="username" autoComplete="username" required />
      </div>
      <div>
        <Label htmlFor="password">{t("password")}</Label>
        <BoxInput id="password" name="password" type="password" autoComplete="current-password" required />
      </div>

      {state.error && <p className="text-sm text-red-700">{t("error")}</p>}

      <SubmitButton />
    </form>
  );
}
