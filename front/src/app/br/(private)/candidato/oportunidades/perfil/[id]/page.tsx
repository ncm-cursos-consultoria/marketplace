"use client";

import { UseUserCandidate } from "@/context/user-candidate.context";
import {
  BadgeCheck,
  CalendarDays,
  Edit3,
  Globe2,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  UserCircle2,
  Users2,
} from "lucide-react";
import Image from "next/image";
import { FirstCol } from "./(complementary)/first-col";
import { SecondCol } from "./(complementary)/second-col";
import { ProfileThings } from "./(complementary)/profil-things";

export default function UserProfilePage() {
  const { userCandidate } = UseUserCandidate();

  return (
    <main className="min-h-screen bg-neutral-200 text-neutral-900 w-full">
      <div className="flex">
        <section className="flex flex-col">
          <header className="px-6 lg:px-10 pt-6 border-b">
            <h1 className="text-2xl font-semibold">
              Olá {userCandidate?.firstName} {userCandidate?.lastName}
            </h1>
            <p className="text-neutral-600">Bem-vindo ao seu Perfil Pessoal</p>
          </header>
          <div className="px-6 lg:px-10 py-8 space-y-8">
            <ProfileThings />
            <div className="flex xl:flex-row flex-col gap-5">
              <FirstCol />
              <SecondCol />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
