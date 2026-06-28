import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export const metadata = {
  title: "Terms of Service | Cubiccode",
  description:
    "The terms governing your use of the Cubiccode website and services, provided by Cubiccode Digital Media LLP.",
};

const updated = "22 June 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Terms of Service"
        subtitle={`The agreement between you and ${site.legalName} when you use this website and our services.`}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Terms" }]}
      />

      <section className="relative overflow-hidden bg-canvas py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative">
          <Reveal>
            <article className="mx-auto max-w-3xl">
              <p className="text-sm text-steel-500">Last updated: {updated}</p>

              <div className="mt-8 space-y-10 text-[15.5px] leading-relaxed text-steel-600">
                <section>
                  <p>
                    These Terms of Service (&ldquo;Terms&rdquo;) govern your access
                    to and use of the website and services provided by{" "}
                    {site.legalName} (&ldquo;Cubiccode&rdquo;, &ldquo;we&rdquo;,
                    &ldquo;us&rdquo; or &ldquo;our&rdquo;). By accessing this website
                    or engaging our services, you agree to be bound by these Terms. If
                    you do not agree, please do not use the site.
                  </p>
                </section>

                <Clause n="1" title="Use of the website">
                  <p>
                    You may use this website for lawful purposes only. You agree not to
                    use it in any way that breaches applicable laws, infringes the
                    rights of others, or interferes with the operation, security or
                    accessibility of the site. We may suspend or restrict access where
                    we reasonably believe these Terms have been breached.
                  </p>
                </Clause>

                <Clause n="2" title="Acceptable use">
                  <p>You agree not to:</p>
                  <ul className="mt-3 space-y-2">
                    <ListItem>
                      attempt to gain unauthorised access to our systems, networks or
                      data;
                    </ListItem>
                    <ListItem>
                      transmit malware, conduct scraping at scale, or place undue load
                      on our infrastructure;
                    </ListItem>
                    <ListItem>
                      copy, reproduce or republish our content without permission; or
                    </ListItem>
                    <ListItem>
                      use the site to distribute unlawful, misleading or harmful
                      material.
                    </ListItem>
                  </ul>
                </Clause>

                <Clause n="3" title="Services & proposals">
                  <p>
                    Information on this website is provided for general guidance and
                    does not constitute a binding offer. Any engagement for design,
                    development, software, marketing, training or related services is
                    governed by a separate written agreement, proposal or statement of
                    work agreed between you and Cubiccode, which will take precedence
                    over these Terms in respect of that engagement.
                  </p>
                </Clause>

                <Clause n="4" title="Intellectual property">
                  <p>
                    All content on this website — including text, graphics, logos,
                    designs, and the underlying code — is owned by or licensed to
                    Cubiccode and is protected by applicable intellectual property
                    laws. Ownership of deliverables created under a client engagement
                    is governed by the relevant project agreement. Nothing on this site
                    grants you any licence to our trademarks or brand assets.
                  </p>
                </Clause>

                <Clause n="5" title="Third-party links">
                  <p>
                    This website may contain links to third-party sites and services.
                    We provide these for convenience and do not control or endorse them.
                    We are not responsible for the content, policies or practices of any
                    third party.
                  </p>
                </Clause>

                <Clause n="6" title="Disclaimers & limitation of liability">
                  <p>
                    This website is provided on an &ldquo;as is&rdquo; and &ldquo;as
                    available&rdquo; basis, without warranties of any kind, whether
                    express or implied. To the fullest extent permitted by law,
                    Cubiccode shall not be liable for any indirect, incidental or
                    consequential loss arising from your use of, or inability to use,
                    this website. Nothing in these Terms excludes liability that cannot
                    lawfully be excluded.
                  </p>
                </Clause>

                <Clause n="7" title="Governing law">
                  <p>
                    These Terms are governed by the laws of India, and the courts of
                    Belagavi, Karnataka shall have exclusive jurisdiction over any
                    dispute arising from or in connection with them.
                  </p>
                </Clause>

                <Clause n="8" title="Changes to these Terms">
                  <p>
                    We may update these Terms from time to time. The most current
                    version will always be available on this page, with the
                    &ldquo;last updated&rdquo; date revised accordingly. Continued use
                    of the site after changes take effect constitutes acceptance of the
                    revised Terms.
                  </p>
                </Clause>
              </div>

              <ContactLine />
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Clause({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold tracking-tight text-ink">
        <span className="mr-2 text-corporate-500">{n}.</span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-corporate-400" />
      <span>{children}</span>
    </li>
  );
}

function ContactLine() {
  return (
    <div className="mt-12 rounded-3xl border border-steel-200 bg-canvas-soft p-6 text-[15px] leading-relaxed text-steel-600 sm:p-7">
      <p className="font-display font-semibold text-ink">Questions about these terms?</p>
      <p className="mt-2">
        Contact {site.legalName} at{" "}
        <a
          href={`mailto:${site.email}`}
          className="font-medium text-corporate-600 hover:text-corporate-700"
        >
          {site.email}
        </a>{" "}
        or call{" "}
        <a
          href={`tel:${site.primaryPhoneRaw}`}
          className="font-medium text-corporate-600 hover:text-corporate-700"
        >
          {site.phones[0]}
        </a>
        . Registered office: {site.offices[0].lines.join(" ")}
      </p>
    </div>
  );
}
