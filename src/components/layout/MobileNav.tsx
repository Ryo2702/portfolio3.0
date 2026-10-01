import { useState, type MouseEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { sectionLinks } from "../../data/navigation";
import { requestHorizontalSection } from "../../utils/navigation";
import { ThemeToggle } from "../../features/theme/ThemeToggle";
import type { Theme } from "../../features/theme/useTheme";
import { NavItem } from "./SidebarNav";

export function MobileNav({
  activeId = "",
  hrefPrefix = "",
  horizontal = false,
  theme,
  themePressed,
  onThemeToggle,
}: {
  activeId?: string;
  hrefPrefix?: string;
  horizontal?: boolean;
  theme: Theme;
  themePressed: boolean;
  onThemeToggle: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="mobile-header">
      <a className="mobile-brand" href={`${hrefPrefix}#home`} aria-label="Go to Charles Pelayo home">
        <span className="brand-mark" aria-hidden="true">
          <img src="/favicons/favicon-64x64.png" alt="" />
        </span>
        <span>CHARLES / 03</span>
      </a>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="icon-button" type="button" aria-label="Open navigation">
            <Menu size={23} aria-hidden="true" />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="mobile-menu-overlay" />
          <Dialog.Content className="mobile-menu" aria-describedby={undefined}>
            <div className="mobile-menu-topline">
              <Dialog.Title className="mobile-menu-title">Navigation / 00</Dialog.Title>
              <Dialog.Close asChild>
                <button className="icon-button" type="button" aria-label="Close navigation">
                  <X size={23} aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <nav className="mobile-nav" aria-label="Mobile navigation">
              {sectionLinks.map((link) => (
                <NavItem
                  key={link.id}
                  {...link}
                  active={activeId === link.id}
                  href={`${hrefPrefix}#${link.id}`}
                  onNavigate={() => setOpen(false)}
                  onClick={horizontal ? (event) => { event.preventDefault(); requestHorizontalSection(link.id); } : undefined}
                />
              ))}
            </nav>
            <ThemeToggle theme={theme} pressed={themePressed} onToggle={onThemeToggle} />
            <a className="button button-primary mobile-menu-cta" href={`${hrefPrefix}#contact`} onClick={() => setOpen(false)}>
              Start a project <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
