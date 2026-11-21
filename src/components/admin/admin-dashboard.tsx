"use client";
import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  Fingerprint,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Mail,
  Users,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { aiProjects } from "@/data/ai-projects";
import type { DashboardData } from "@/lib/admin-types";
import { useSecureSession } from "./use-secure-session";
import styles from "./admin.module.scss";
import { AdminRecords } from "./admin-records";
const platforms = [
  { name: "ZandaTax", slug: "zandatax", description: "Tax technology" },
  { name: "MTN", slug: "mtn", description: "Telecommunications" },
  { name: "NogicJQS", slug: "nogicjqs", description: "Industry platforms" },
];
const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Project library", icon: FolderKanban },
  { id: "security", label: "Account & security", icon: ShieldCheck },
  { id: "inbox", label: "Inbox", icon: Mail },
  { id: "users", label: "Users", icon: Users },
] as const;
export function AdminDashboard({ initial }: { initial: DashboardData }) {
  const router = useRouter();
  const session = useSecureSession(initial.session);
  const [section, setSection] = useState("overview"),
    [query, setQuery] = useState(""),
    [menu, setMenu] = useState(false);
  const warningRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = warningRef.current;
    if (session.warning && !dialog?.open) dialog?.showModal();
    else if (!session.warning && dialog?.open) dialog.close();
  }, [session.warning]);
  const projects = useMemo(
    () =>
      aiProjects.filter((project) =>
        `${project.title} ${project.technologies.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );
  const technologies = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of aiProjects)
      for (const tech of project.technologies)
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
    return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, []);
  const minutes = Math.ceil(session.remaining / 60);
  return (
    <div className={styles.workspace} data-admin-workspace>
      {menu && (
        <button
          className={styles.scrim}
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        />
      )}
      <aside
        className={`${styles.sidebar} ${menu ? styles.open : ""}`}
        aria-label="Workspace navigation"
      >
        <Link href="/protected/admin" className={styles.brand}>
          <span>
            <Boxes size={26} />
          </span>
          Eko<span className={styles.brandLight}>Workspace</span>
        </Link>
        <div className={styles.workspaceName}>
          <span className={styles.workspaceIcon}>
            <Fingerprint size={21} />
          </span>
          <div>
            <strong>
              {initial.user.role === "admin"
                ? "Administrator workspace"
                : "Personal workspace"}
            </strong>
            <small>Portfolio administration</small>
          </div>
          <span className={styles.online} />
        </div>
        <p className={styles.navLabel}>WORKSPACE</p>
        <nav>
          {sections
            .filter(
              (item) =>
                !["inbox", "users"].includes(item.id) ||
                initial.user.role === "admin",
            )
            .map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={section === item.id ? "page" : undefined}
                onClick={() => {
                  setSection(item.id);
                  setMenu(false);
                }}
              >
                <item.icon size={20} />
                {item.label}
                {item.id === "projects" && (
                  <span className={styles.count}>{aiProjects.length}</span>
                )}
              </button>
            ))}
        </nav>
        <p className={styles.navLabel}>EXPLORE</p>
        <Link className={styles.sidebarLink} href="/" prefetch={false}>
          <ArrowDownLeft size={19} />
          Public portfolio
          <ArrowUpRight size={14} />
        </Link>
        <Link className={styles.sidebarLink} href="/projects" prefetch={false}>
          <Boxes size={19} />
          All projects
          <ArrowUpRight size={14} />
        </Link>
        <div className={styles.sidebarBottom}>
          <div className={styles.protectedNote}>
            <ShieldCheck size={23} />
            <strong>Your space. Protected.</strong>
            <p>
              Access is verified with the server on every protected request.
            </p>
            <span>
              <i />
              Private workspace
            </span>
          </div>
          <button
            className={styles.signOut}
            onClick={() => void session.logout()}
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
      <div className={styles.body}>
        <header className={styles.topbar}>
          <button
            className={styles.menuButton}
            aria-label="Open workspace navigation"
            onClick={() => setMenu(true)}
          >
            <Menu size={23} />
          </button>
          <label className={styles.search}>
            <Search size={21} />
            <input
              aria-label="Search projects"
              placeholder="Search your project library…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSection("projects");
              }}
            />
            {query && (
              <button
                aria-label="Clear project search"
                onClick={() => setQuery("")}
              >
                <X size={15} />
              </button>
            )}
          </label>
          <span className={styles.secureBadge}>
            <ShieldCheck size={15} />
            Secure session
          </span>
          <button
            className={styles.avatar}
            aria-label="View account and security"
            onClick={() => setSection("security")}
          >
            {initial.user.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
            <i />
          </button>
        </header>
        <main id="main-content" className={styles.content}>
          <div className={styles.pageHeading}>
            <div>
              <p>
                Workspace <ChevronRight size={12} />
                {sections.find((item) => item.id === section)?.label}
              </p>
              <h1>
                {section === "overview"
                  ? "Workspace overview"
                  : section === "projects"
                    ? "Project library"
                    : section === "inbox"
                      ? "Contact inbox"
                      : section === "users"
                        ? "Registered users"
                        : "Account & security"}
              </h1>
              <span>
                Welcome back, {initial.user.name.split(" ")[0]}. Here’s your
                space to build what’s next.
              </span>
            </div>
            <button
              className={styles.refresh}
              onClick={() => {
                void session.verify();
                router.refresh();
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
          {session.issue && (
            <div className={styles.connection} role="alert">
              {session.issue}
              <button onClick={() => void session.verify()}>
                Retry verification
              </button>
            </div>
          )}
          {section === "overview" && (
            <>
              <section className={styles.stats} aria-label="Workspace summary">
                {[
                  {
                    icon: FolderKanban,
                    value: aiProjects.length,
                    label: "AI & engineering projects",
                    note: "Published in your portfolio",
                    tone: "purple",
                  },
                  {
                    icon: Boxes,
                    value: platforms.length,
                    label: "Professional experiences",
                    note: "Connected platform showcases",
                    tone: "cyan",
                  },
                  {
                    icon: Fingerprint,
                    value: initial.active_sessions,
                    label: "Your active sessions",
                    note: "Verified by the account server",
                    tone: "orange",
                  },
                  {
                    icon: Clock3,
                    value: `${minutes} min`,
                    label: "Until session locks",
                    note: "Activity renews the idle window",
                    tone: "green",
                  },
                ].map((item) => (
                  <article
                    key={item.label}
                    className={styles.stat}
                    data-tone={item.tone}
                  >
                    <span className={styles.statIcon}>
                      <item.icon size={23} />
                    </span>
                    <h2>{item.value}</h2>
                    <p>{item.label}</p>
                    <small>
                      <span className={styles.tinyDot} />
                      {item.note}
                    </small>
                  </article>
                ))}
              </section>
              <div className={styles.chartGrid}>
                <section className={styles.card}>
                  <div className={styles.cardHeading}>
                    <div>
                      <h2>Engineering toolkit</h2>
                      <p>Technology coverage across your project library</p>
                    </div>
                    <span className={styles.pill}>Portfolio data</span>
                  </div>
                  <div className={styles.techChart}>
                    {technologies.map(([name, count], index) => (
                      <div className={styles.techRow} key={name}>
                        <span>{name}</span>
                        <div>
                          <i
                            style={{
                              width: `${(count / aiProjects.length) * 100}%`,
                              animationDelay: `${index * 100}ms`,
                            }}
                          />
                        </div>
                        <strong>{count}</strong>
                      </div>
                    ))}
                  </div>
                  <div className={styles.chartFoot}>
                    <span>
                      <i />
                      Projects using each technology
                    </span>
                    <strong>{aiProjects.length} total projects</strong>
                  </div>
                </section>
                <section className={`${styles.card} ${styles.securityCard}`}>
                  <div className={styles.cardHeading}>
                    <div>
                      <h2>Session health</h2>
                      <p>A safer space to work</p>
                    </div>
                    <ShieldCheck size={21} />
                  </div>
                  <div className={styles.healthBody}>
                    <div className={styles.ring}>
                      <ShieldCheck size={32} />
                      <strong>Active</strong>
                    </div>
                    <ul>
                      <li>
                        <Check />
                        Server verified
                      </li>
                      <li>
                        <Check />
                        Idle protection
                      </li>
                      <li>
                        <Check />
                        Secure cookie session
                      </li>
                      <li>
                        <Check />
                        Revocable access
                      </li>
                    </ul>
                  </div>
                  <button
                    className={styles.textButton}
                    onClick={() => setSection("security")}
                  >
                    Review your security
                    <ArrowRight size={16} />
                  </button>
                </section>
              </div>
              <div className={styles.lowerGrid}>
                <section className={styles.card}>
                  <div className={styles.cardHeading}>
                    <div>
                      <h2>Professional platforms</h2>
                      <p>Experience across different industries</p>
                    </div>
                    <ExternalLink size={18} />
                  </div>
                  <div className={styles.platforms}>
                    {platforms.map((item, index) => (
                      <Link
                        key={item.slug}
                        href={`/projects/${item.slug}`}
                        prefetch={false}
                      >
                        <span data-platform={index}>
                          {item.name.slice(0, 1)}
                        </span>
                        <div>
                          <strong>{item.name}</strong>
                          <small>{item.description}</small>
                        </div>
                        <ArrowUpRight size={19} />
                      </Link>
                    ))}
                  </div>
                </section>
                <section className={`${styles.card} ${styles.welcomeCard}`}>
                  <span className={styles.sparkle}>
                    <Sparkles size={30} />
                  </span>
                  <div className={styles.eyebrow}>IDEAS INTO IMPACT</div>
                  <h2>
                    Your next great idea
                    <br />
                    starts here.
                  </h2>
                  <p>
                    Explore the models, systems, and engineering behind your
                    portfolio.
                  </p>
                  <button onClick={() => setSection("projects")}>
                    Explore project library
                    <ArrowRight size={17} />
                  </button>
                  <div className={styles.orbit} aria-hidden="true" />
                </section>
              </div>
            </>
          )}
          {["overview", "projects"].includes(section) && (
            <section className={`${styles.card} ${styles.projectCard}`}>
              <div className={styles.cardHeading}>
                <div>
                  <h2>Project collection</h2>
                  <p>Engineering work, source code, and documented results</p>
                </div>
                <span className={styles.pill}>{projects.length} projects</span>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>PROJECT</th>
                      <th>TECHNOLOGIES</th>
                      <th>STATUS</th>
                      <th>DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => (
                      <tr key={project.slug}>
                        <td>
                          <span className={styles.projectIndex}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <strong>{project.title.split(" — ")[0]}</strong>
                            <small>{project.results[0]}</small>
                          </div>
                        </td>
                        <td>
                          <div className={styles.tags}>
                            {project.technologies.slice(0, 2).map((tech) => (
                              <span key={tech}>{tech}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className={styles.published}>
                            <i />
                            Published
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/projects/ai-machine-learning/${project.slug}`}
                            prefetch={false}
                            aria-label={`View ${project.title}`}
                          >
                            <ArrowUpRight size={19} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!projects.length && (
                  <p className={styles.empty}>
                    No projects match “{query}”. Try another title or
                    technology.
                  </p>
                )}
              </div>
              <div className={styles.tableFooter}>
                Showing {projects.length} of {aiProjects.length} projects
                <span>Portfolio collection</span>
              </div>
            </section>
          )}
          {section === "security" && (
            <div className={styles.chartGrid}>
              <section className={styles.card}>
                <div className={styles.cardHeading}>
                  <div>
                    <h2>Your profile</h2>
                    <p>Only your own account information is displayed.</p>
                  </div>
                  <UserRound size={23} />
                </div>
                <dl className={styles.profile}>
                  <dt>Full name</dt>
                  <dd>{initial.user.name}</dd>
                  <dt>Email address</dt>
                  <dd>{initial.user.email}</dd>
                  <dt>Workspace access</dt>
                  <dd>
                    {initial.user.role === "admin"
                      ? "Administrator · inbox and user directory access"
                      : "Personal account · no access to other users’ records"}
                  </dd>
                </dl>
                <Link
                  href="/protected/forgot-password"
                  className={styles.textButton}
                >
                  Change password
                  <ArrowUpRight size={17} />
                </Link>
              </section>
              <section className={styles.card}>
                <div className={styles.cardHeading}>
                  <div>
                    <h2>Access policy</h2>
                    <p>Enforced by the Python account server</p>
                  </div>
                  <Fingerprint size={23} />
                </div>
                <dl className={styles.profile}>
                  <dt>Idle session limit</dt>
                  <dd>15 minutes without activity</dd>
                  <dt>Maximum session duration</dt>
                  <dd>8 hours, including active use</dd>
                  <dt>Current session started</dt>
                  <dd>
                    <time dateTime={initial.session.created_at}>
                      {new Date(initial.session.created_at).toLocaleString(
                        "en-US",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "UTC",
                        },
                      )}{" "}
                      UTC
                    </time>
                  </dd>
                  <dt>Remaining access window</dt>
                  <dd>
                    {Math.floor(session.remaining / 60)}m{" "}
                    {Math.floor(session.remaining % 60)}s
                  </dd>
                </dl>
                <button
                  className={styles.dangerButton}
                  onClick={() => void session.logout()}
                >
                  <LogOut size={16} />
                  Sign out of this session
                </button>
              </section>
            </div>
          )}
          {initial.user.role === "admin" &&
            (section === "inbox" || section === "users") && (
              <AdminRecords key={section} kind={section} />
            )}
          <footer className={styles.footer}>
            <span>
              © {new Date(initial.session.created_at).getUTCFullYear()} Eko
              Samuel
            </span>
            <span>
              <ShieldCheck size={14} />
              Private workspace · Verified access
            </span>
          </footer>
        </main>
      </div>
      <dialog
        ref={warningRef}
        className={styles.warning}
        aria-labelledby="session-warning-title"
        onCancel={(event) => event.preventDefault()}
      >
        <span className={styles.warningIcon}>
          <Clock3 size={30} />
        </span>
        <h2 id="session-warning-title">Your session is about to lock</h2>
        <p>
          You’ve been inactive, or your access window is ending. Sign in again
          after the session expires.
        </p>
        <strong role="timer">
          {Math.floor(session.remaining / 60)}:
          {String(Math.floor(session.remaining % 60)).padStart(2, "0")}
        </strong>
        <button onClick={() => void session.continueSession()}>
          Stay signed in
        </button>
        <button onClick={() => void session.logout()}>Sign out now</button>
        <small>The eight-hour maximum session cannot be extended.</small>
      </dialog>
    </div>
  );
}
