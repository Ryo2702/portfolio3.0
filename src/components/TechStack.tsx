import {
  Braces,
  Camera,
  Check,
  CircleAlert,
  Code2,
  CodeXml,
  Database,
  FileText,
  GitBranch,
  Globe2,
  Layers,
  MonitorSmartphone,
  Package,
  Palette,
  Plug,
  Printer,
  Search,
  Send,
  Server,
  Smartphone,
  Terminal,
  TestTube2,
  Type,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { toolGroups } from "../data";
import { Section } from "./Section";

const stackGroupIcons: Record<string, LucideIcon> = {
  "Web Development": Code2,
  WordPress: Globe2,
  SEO: Search,
  Database,
  Tools: Wrench,
};

const stackItemIcons: Record<string, LucideIcon> = {
  HTML5: CodeXml,
  CSS3: Palette,
  JavaScript: Braces,
  TypeScript: Type,
  "Vue 3": Layers,
  React: Code2,
  "React Native": Smartphone,
  "React Native Web": MonitorSmartphone,
  Expo: Package,
  "Expo Router": GitBranch,
  Vite: Plug,
  PHP: CodeXml,
  Laravel: Layers,
  "REST API": Plug,
  "Responsive Design": MonitorSmartphone,
  "WordPress Development": Globe2,
  "WordPress Customization": Palette,
  "Theme Customization": Palette,
  "Plugin Management": Package,
  "Website Maintenance": Wrench,
  "Website Troubleshooting": CircleAlert,
  "Content Management": FileText,
  "On-Page SEO": Search,
  "Technical SEO": Code2,
  "Keyword Research": Search,
  "Meta Optimization": Search,
  "Internal Linking": GitBranch,
  "Site Structure": Layers,
  "SEO Auditing": CircleAlert,
  "Google Search Console": Search,
  MySQL: Database,
  MariaDB: Database,
  PostgreSQL: Database,
  SQLite: Database,
  Git: GitBranch,
  GitHub: GitBranch,
  "VS Code": Code2,
  Postman: Send,
  Linux: Terminal,
  Hostinger: Server,
  Vercel: Globe2,
  Jest: TestTube2,
  Zod: Check,
  "expo-secure-store": Package,
  "expo-camera": Camera,
  "expo-print": Printer,
  "Lucide React": Code2,
  "lucide-react-native": Smartphone,
};

export function TechStack() {
  return (
    <Section
      id="stack"
      eyebrow="04 / Tools & capabilities"
      title="The stack stays useful."
      intro="Tools are here to support the outcome: clear pages, maintainable builds, and fewer dead ends."
    >
      <div className="stack-grid">
        {toolGroups.map((group) => {
          const Icon = stackGroupIcons[group.label] ?? Code2;

          return (
            <article className="stack-card" key={group.label}>
              <div className="stack-card-heading">
                <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                <h3>{group.label}</h3>
              </div>
              <div className="stack-items">
                {group.items.map((item) => {
                  const SkillIcon = stackItemIcons[item] ?? Icon;

                  return (
                    <span className="badge" key={item}>
                      <SkillIcon size={11} strokeWidth={2} aria-hidden="true" />
                      {item}
                    </span>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
