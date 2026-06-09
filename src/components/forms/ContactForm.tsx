"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Input, Textarea, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Monogram } from "@/components/brand/Monogram";

const initialState: ContactState = { status: "idle" };

function SubmitButton() {
  const t = useTranslations("contact.form");
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending} className="w-full sm:w-auto">
      {pending ? t("submitting") : t("submit")}
    </Button>
  );
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [state, formAction] = useActionState(submitContact, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" name="name" required placeholder={t("namePlaceholder")} />
          {state.fieldErrors?.name && <FieldError />}
        </div>
        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" name="email" type="email" required placeholder={t("emailPlaceholder")} />
          {state.fieldErrors?.email && <FieldError />}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" name="phone" placeholder={t("phonePlaceholder")} />
        </div>
        <div>
          <Label htmlFor="subject">{t("subject")}</Label>
          <Input id="subject" name="subject" placeholder={t("subjectPlaceholder")} />
        </div>
      </div>

      <div>
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea id="message" name="message" rows={3} required placeholder={t("messagePlaceholder")} />
        {state.fieldErrors?.message && <FieldError />}
      </div>

      {/* Honeypot — hidden from users */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <AnimatePresence mode="wait">
          {state.status === "success" && (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-ink"
            >
              <Monogram className="h-4 w-4" strokeWidth={3} />
              {t("success")}
            </motion.p>
          )}
          {state.status === "error" && !state.fieldErrors && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-700"
            >
              {t("error")}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function FieldError() {
  return <span className="mt-1 block text-xs text-red-700">—</span>;
}
