import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import styles from "./auth.module.scss";

interface AuthFrameProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthFrame({ title, description, children }: AuthFrameProps) {
  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.identity}>
          <span className={styles.eyebrow}>Eko Samuel · Account access</span>
          <div className={styles.emblem} aria-hidden="true">
            <ShieldCheck size={64} />
          </div>
          <h2>
            A space
            <br />
            to connect.
          </h2>
          <p>Your account, securely connected to Eko Samuel’s portfolio.</p>
          <span className={styles.signature}>
            Intelligence. Engineering. Possibility.
          </span>
        </aside>
        <section className={styles.content} aria-labelledby="auth-title">
          <span className={styles.eyebrow}>Welcome</span>
          <h1 id="auth-title">{title}</h1>
          <p className={styles.description}>{description}</p>
          {children}
        </section>
      </div>
    </main>
  );
}
