"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getDataPath, getSettingsPath, getTenantPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import ChatIconOff from "@/public/icons/chat-off.svg";
import ChatIconOn from "@/public/icons/chat-on.svg";
import DataIconOff from "@/public/icons/data-off.svg";
import DataIconOn from "@/public/icons/data-on.svg";
import SettingsIconOff from "@/public/icons/settings-off.svg";
import SettingsIconOn from "@/public/icons/settings-on.svg";

export enum AppLocation {
  CHAT,
  DATA,
  SETTINGS,
  SETTINGS_USERS,
  SETTINGS_MODELS,
  SETTINGS_PROMPTS,
  SETTINGS_SLACK,
  SETTINGS_BILLING,
}

export function NavButton({
  alt,
  src,
  className,
  isActive,
}: {
  alt: string;
  src: any;
  className?: string;
  isActive?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col w-20 items-center",
        className,
        isActive ? "text-[color:var(--brand)]" : "text-white",
      )}
    >
      <Image alt={alt} src={src} className="mb-2.5" />
      <div className="text-[14px]">{alt}</div>
    </div>
  );
}

interface Props {
  className?: string;
  tenant: { slug: string };
}

export default function Footer({ className, tenant }: Props) {
  const pathname = usePathname();

  let appLocation = AppLocation.CHAT;
  if (pathname.startsWith(getDataPath(tenant.slug))) {
    appLocation = AppLocation.DATA;
  } else if (pathname.startsWith(getSettingsPath(tenant.slug))) {
    appLocation = AppLocation.SETTINGS;
  }

  const chatIcon = appLocation === AppLocation.CHAT ? ChatIconOn : ChatIconOff;
  const chatIsActive = appLocation === AppLocation.CHAT;

  const dataIcon = appLocation === AppLocation.DATA ? DataIconOn : DataIconOff;
  const dataIsActive = appLocation === AppLocation.DATA;

  const settingsIcon = appLocation === AppLocation.SETTINGS ? SettingsIconOn : SettingsIconOff;
  const settingsIsActive = appLocation === AppLocation.SETTINGS;

  return (
    <div className={className}>
      <div className="flex">
        <Link href={getTenantPath(tenant.slug)}>
          <NavButton alt="Chat" src={chatIcon} className="mr-5" isActive={chatIsActive} />
        </Link>
        <Link href={getDataPath(tenant.slug)}>
          <NavButton alt="Data" src={dataIcon} className="mr-5" isActive={dataIsActive} />
        </Link>
        <Link href={getSettingsPath(tenant.slug)}>
          <NavButton alt="Settings" src={settingsIcon} className="mr-5" isActive={settingsIsActive} />
        </Link>
      </div>
    </div>
  );
}
