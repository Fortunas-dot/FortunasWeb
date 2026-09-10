import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'

const Section = ({ id, title, children }: { id: string; title: string; children: ReactNode }) => (
  <section id={id} className="scroll-mt-28">
    <h2 className="text-2xl md:text-3xl font-bold mb-6 mt-16 first:mt-0">
      <span className="bg-gradient-to-r from-fortunas-accent to-fortunas-purple bg-clip-text text-transparent">
        {title}
      </span>
    </h2>
    <div className="space-y-4 text-fortunas-gray leading-relaxed">{children}</div>
  </section>
)

const SubHeading = ({ children }: { children: ReactNode }) => (
  <h3 className="text-xl font-semibold text-fortunas-dark mt-10 mb-4">{children}</h3>
)

const Table = ({ head, rows }: { head: string[]; rows: ReactNode[][] }) => (
  <div className="overflow-x-auto my-6 rounded-2xl glass-morphism border border-white/20">
    <table className="w-full text-left text-sm border-collapse min-w-[520px]">
      <thead>
        <tr className="border-b border-white/30">
          {head.map((cell) => (
            <th key={cell} className="px-5 py-4 font-semibold text-fortunas-dark align-top">
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-white/20 last:border-0">
            {row.map((cell, j) => (
              <td key={j} className="px-5 py-4 align-top text-fortunas-gray">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const Bullets = ({ items }: { items: ReactNode[] }) => (
  <ul className="space-y-3 my-4">
    {items.map((item, i) => (
      <li key={i} className="flex items-start">
        <span className="bg-gradient-to-r from-fortunas-accent to-fortunas-purple bg-clip-text text-transparent mr-3 font-bold shrink-0">
          →
        </span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
)

const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-fortunas-dark">{children}</strong>
)

const contents = [
  { id: 'short-version', label: 'The short version' },
  { id: 'on-device', label: 'What is stored on your device only' },
  { id: 'leaves-device', label: 'What leaves your device' },
  { id: 'screen-time', label: 'Apple Screen Time' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'children', label: 'Children' },
  { id: 'rights', label: 'Your rights' },
  { id: 'retention', label: 'Retention' },
  { id: 'changes', label: 'Changes' },
  { id: 'who-we-are', label: 'Who we are' },
]

const TimeWellPrivacy = () => {
  usePageTitle('TimeWell Privacy Policy — Fortunas')

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="pt-24 pb-12 px-6 lg:px-8 relative">
        <motion.div
          className="absolute top-10 right-10 w-80 h-80 bg-gradient-to-r from-fortunas-accent/10 to-fortunas-purple/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              to="/apps"
              className="inline-flex items-center gap-2 text-sm text-fortunas-gray hover:text-fortunas-accent transition-colors mb-8"
            >
              ← Back to apps
            </Link>
            <div className="flex items-center gap-5 mb-8">
              <img
                src="/timewell/icon.png"
                alt="TimeWell app icon"
                className="w-16 h-16 rounded-[18px] shadow-lg shadow-fortunas-accent/10"
              />
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
                <span className="bg-gradient-to-r from-fortunas-dark via-fortunas-accent to-fortunas-purple bg-clip-text text-transparent">
                  TimeWell Privacy Policy
                </span>
              </h1>
            </div>
            <p className="text-lg text-fortunas-gray">
              <Strong>Effective 10 September 2026.</Strong> The version that governs is the one
              inside the app — <Strong>You → Privacy Policy</Strong>. This page is the copy
              published for the App Store listing and for anyone reading before they install. If
              the two disagree, the in-app version is right.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="pb-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 md:p-12 rounded-3xl glass-morphism border border-white/20"
          >
            {/* Contents */}
            <nav className="mb-16 p-6 rounded-2xl glass-morphism border border-white/10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-fortunas-dark mb-4">
                Contents
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {contents.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-fortunas-gray hover:text-fortunas-accent transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="text-fortunas-gray leading-relaxed mb-4">
              TimeWell is a digital-wellbeing app. It helps you use social media without the parts
              engineered to keep you there. Doing that well requires knowing what you look at —
              which is exactly why this app is built so that it does not have to tell us.
            </p>

            <Section id="short-version" title="The short version">
              <Bullets
                items={[
                  <>
                    <Strong>What you browse is never sent anywhere.</Strong> Not the URLs, not the
                    page titles, not the contents. The filtering happens on your phone, inside your
                    phone&apos;s browser engine.
                  </>,
                  <>
                    <Strong>Your screen-time numbers stay on your phone</Strong> unless you link it
                    to a parent. Minutes, goals, streaks, limits and filter settings live in local
                    storage and are not uploaded. The one exception is a device that has joined a
                    family with a pairing code, which sends its per-app minutes and which filters
                    are on — see &ldquo;The family link&rdquo; below.
                  </>,
                  <>
                    <Strong>What you type to Sol is sent to be answered, and then it is gone.</Strong>{' '}
                    The companion needs a language model to reply, so your message goes to our
                    server and on to Anthropic. Neither of us stores the conversation — the only
                    copy is on your phone, and &ldquo;Forget this conversation&rdquo; in the app
                    deletes it. See &ldquo;The companion — Sol&rdquo; below, which is worth reading
                    in full.
                  </>,
                  <>
                    <Strong>We never see your social-media passwords.</Strong> You sign in to
                    Instagram, YouTube, X or Facebook on their own websites, inside the in-app
                    browser. TimeWell has no access to what you type there.
                  </>,
                  <>
                    <Strong>We do not sell data, and there are no advertising SDKs in the app.</Strong>{' '}
                    The subscription is the only thing paying for TimeWell.
                  </>,
                ]}
              />
            </Section>

            <Section id="on-device" title="What is stored on your device only">
              <p>
                All of the following is written to your device&apos;s local app storage and is not
                transmitted to us. (On a phone that has joined a family with a pairing code, the
                first three rows are also sent to the parent — see &ldquo;The family link&rdquo;.
                Nothing else in this table ever is.)
              </p>
              <Table
                head={['Data', 'Why']}
                rows={[
                  ['Screen-time minutes, per app, per day', 'The Today, Focus and You screens'],
                  [
                    'Daily goal, per-app limits, streak, sleep window',
                    'The features you set them for',
                  ],
                  [
                    'Which filters are on, and your topic keywords',
                    'Deciding what to hide in the browser',
                  ],
                  ['Display name and appearance preference', 'Shown in the app'],
                  ['Screen Time app selections', 'See “Apple Screen Time” below'],
                  [
                    'Cookies and logins for the sites you open',
                    'So you are not signed out every time',
                  ],
                  ['Your conversation with Sol', 'The only copy there is — see below'],
                ]}
              />
              <p>
                Deleting the app deletes all of it. Within the app,{' '}
                <Strong>You → Privacy → Clear usage data</Strong> resets the screen-time history
                while leaving your settings alone.
              </p>
            </Section>

            <Section id="leaves-device" title="What leaves your device">
              <SubHeading>Analytics — PostHog</SubHeading>
              <p>
                TimeWell sends product analytics to PostHog, hosted in the EU. This is how we learn
                which features are used and where the app fails. Events carry:
              </p>
              <Bullets
                items={[
                  <>
                    which screen was opened, as a route name (<code>browser/[id]</code>, never the
                    site you visited);
                  </>,
                  <>
                    which app a browser session was for, as an id (<code>instagram</code>,{' '}
                    <code>x</code>) — never a URL, a page title or anything from the page;
                  </>,
                  'coarse buckets of usage, never raw per-second counts;',
                  'onboarding, subscription and error events;',
                  'a random installation id, the app version, and the device model and OS version.',
                ]}
              />
              <p>
                Events <Strong>never</Strong> carry your email address, your display name, your
                topic keywords, the text of a filter idea, or anything you type into a text field.
              </p>
              <p>
                <Strong>Turning it off.</Strong> <Strong>You → Help improve TimeWell</Strong>{' '}
                withdraws consent for all of the above, including crash reports, and takes effect
                immediately.
              </p>
              <p>
                <Strong>Session replay.</Strong> PostHog&apos;s mobile session replay is{' '}
                <Strong>off</Strong>. It is not enabled in the app you install from the App Store,
                and it is off in any build unless a developer deliberately turns it on to debug
                something. Where it is on, it records how the app itself is used with text inputs
                and images masked, it stops when you turn off usage data above, and it is switched
                off entirely for as long as a browser screen is open — so a feed you are signed in
                to is never recorded.
              </p>

              <SubHeading>Subscriptions — RevenueCat and the App Store</SubHeading>
              <p>
                Purchases are processed by Apple. TimeWell uses RevenueCat to check whether a
                subscription is active. RevenueCat receives a random app user id, your purchase and
                entitlement status, and the country and device information Apple attaches to a
                transaction. <Strong>Neither we nor RevenueCat ever receive your payment details</Strong>{' '}
                — those stay between you and Apple.
              </p>

              <SubHeading>Accounts — required</SubHeading>
              <p>
                TimeWell requires an account. You are asked for one after the introduction, and the
                app cannot be used without signing in.
              </p>
              <Bullets
                items={[
                  <>
                    <Strong>Sign in with Apple.</Strong> Apple tells us an opaque user id, and —
                    only on the very first sign-in — your name and email, or a{' '}
                    <code>@privaterelay.appleid.com</code> forwarding address if you chose to hide
                    it. We never receive your Apple password.
                  </>,
                  <>
                    <Strong>Email and password.</Strong> We store your email address, your name if
                    you give one, and a hash of your password. The password itself is never stored.
                  </>,
                ]}
              />
              <p>
                Where the app is running without an account server configured, all of this stays on
                the device and nothing is transmitted at all.
              </p>
              <p>
                You can sign out or{' '}
                <Strong>permanently delete your account and everything attached to it</Strong> from{' '}
                <Strong>You → Account</Strong> inside the app. Deletion is immediate and is not
                reversible.
              </p>

              <SubHeading>The ideas board — optional and off by default</SubHeading>
              <p>
                The filter-ideas board runs on your device unless the app is built pointing at a
                shared server. When it is shared, submitting or voting on an idea sends: a random
                device id (so one device gets one vote), the text of the idea, the platform it
                applies to, and{' '}
                <Strong>
                  the display name you set in Settings, which is public on a shared board.
                </Strong>{' '}
                Do not put your real name there if you would rather it were not visible. Votes are
                not attributable to you beyond that random device id.
              </p>

              <SubHeading>The family link — optional and off by default</SubHeading>
              <p>
                Nothing here happens on a phone that has not either added a child or typed in a
                pairing code.
              </p>
              <p>
                <Strong>On a phone that has joined a family</Strong>, the app sends, roughly every
                fifteen minutes while it is open:
              </p>
              <Table
                head={['Sent', 'Not sent']}
                rows={[
                  [
                    'Minutes per app, today and the last seven days',
                    'Anything browsed — URLs, page titles, posts, profiles, searches',
                  ],
                  [
                    'Which filters are on, as internal ids rather than words',
                    'Messages, and anything typed anywhere',
                  ],
                  [
                    'The daily goal and the streak',
                    'Location, contacts, and anything at all about any other app',
                  ],
                  [
                    'Whether the platforms TimeWell names are still installed — iPhone only',
                    'A list of what is on the phone: the question is asked app by app, about a fixed list',
                  ],
                  [
                    'How long today went into the official apps, as one daily total — iPhone only, where Screen Time is on',
                    'Which apps those were: the picked set is opaque even to us, and the total is never split per app',
                  ],
                  ['When the app was installed, and its version number', 'The conversation with Sol'],
                ]}
              />
              <p>
                That fourth row is the newest and the one worth reading twice. TimeWell&apos;s
                filters only work inside TimeWell&apos;s own browser, so a phone that still has the
                platform&apos;s own app on it has an unfiltered version of that platform on it —
                which would make every other figure above describe a browser nobody is using. So
                the linked phone reports, for the handful of platforms TimeWell already names,
                whether each one is still installed.
              </p>
              <p>
                It is <Strong>not</Strong> a list of the apps on the phone, and it cannot become
                one. iOS answers one named app at a time and will not enumerate anything; the names
                are fixed in the app before it ships. On{' '}
                <Strong>Android the question cannot be asked at all</Strong>, and a phone that
                cannot answer says exactly that — the parent&apos;s screen shows{' '}
                <em>cannot tell</em>, never <em>not installed</em>. The answer is also a claim
                rather than proof: it reports that something on the phone responds to that
                app&apos;s link, which in practice is that app, and the screen says as much rather
                than presenting it as certainty.
              </p>
              <p>
                The person holding the linked phone sees the same figures the parent does, on their
                own device, alongside that list. A parent{' '}
                <Strong>cannot change any setting</Strong> on the child&apos;s device from their own
                — filters and limits are set on the phone they apply to.
              </p>
              <p>
                The app does not report in the background. It reports only while it is open, so a
                parent sees when it last reported rather than whether the phone is on or whether the
                app is still installed; the app says so rather than inferring.
              </p>
              <p>
                Only the most recent report is stored, overwritten each time — there is no history
                on our side beyond the seven days that report carries. Leaving the family from the
                linked phone deletes it, and so does the parent removing the child or deleting their
                account.
              </p>
              <p>
                A pairing code is a bearer credential for about half an hour: whoever types it in
                becomes that child. Read it out to the person in front of you rather than sending it
                somewhere it can sit.
              </p>

              <SubHeading>The companion — Sol</SubHeading>
              <p>
                Sol is the AI companion on its own tab. It is off by default in the sense that it
                does nothing until you type something to it; there is no background processing, and
                it is never given your conversation to work on unless you send a message.
              </p>
              <p>
                <Strong>What is sent when you send a message:</Strong>
              </p>
              <Bullets
                items={[
                  'the recent conversation, up to the last 20 turns — what you wrote and what Sol replied;',
                  'a small summary of your day: total minutes tracked today, your daily goal, your streak, the name of the app you have spent longest in, whether a focus session is running, and the hour on your clock. This is a fixed list, not “your data” in general;',
                  'the app’s language.',
                ]}
              />
              <p>
                <Strong>What is never sent:</Strong> your topic keywords, your filter rules, your
                per-app minute history, your browsing, your name, your email, or any account or
                device identifier. The request is anonymous — the server does not know who sent it
                and does not ask.
              </p>
              <p>
                <Strong>Where it goes.</Strong> To our server, which holds the API key, and from
                there to Anthropic, who run the model. It goes to Anthropic because we cannot put
                the key in the app itself, where anyone could read it out of the binary.
              </p>
              <p>
                <Strong>What is stored.</Strong> Nothing, by either of us. Our server keeps no
                record of a conversation — not the message, not the reply, not a log line containing
                either. That is why the app has to send the recent history back each time you write.
                Anthropic processes the request to produce the reply and does not train models on
                it; they retain requests for a limited period for abuse monitoring under their own
                terms, which is the one part of this that is not ours to promise.
              </p>
              <p>
                <Strong>The transcript on your phone</Strong> holds the last 40 messages, in the
                app&apos;s own storage. Deleting the app deletes it. Inside the app, the bin icon on
                the Sol tab deletes it immediately.
              </p>
              <p>
                <Strong>Sol is not a health service.</Strong> It is a language model with
                instructions to be kind and to ask good questions. It is not a therapist, does not
                diagnose anything, and gets things wrong. If a conversation touches on suicide or
                self-harm, the app shows real crisis phone numbers — those come from a list built
                into the app, not from the model, so that they are correct.
              </p>

              <SubHeading>Support</SubHeading>
              <p>
                If you email support, we have your email address and whatever you put in the
                message, for as long as it takes to deal with it.
              </p>
            </Section>

            <Section id="screen-time" title="Apple Screen Time">
              <p>
                If you allow it, TimeWell uses Apple&apos;s Family Controls, Managed Settings and
                Device Activity frameworks to block apps outside TimeWell during focus sessions and
                sleep windows.
              </p>
              <p>
                Apple designed these so that{' '}
                <Strong>the apps you pick are never revealed to us.</Strong> They are handed over as
                opaque tokens that only iOS can resolve. TimeWell can count them — &ldquo;3 apps, 1
                category&rdquo; — and nothing more. That data never leaves the device, and no part of
                it is sent to any server.
              </p>
              <p>
                The same frameworks also tell TimeWell{' '}
                <Strong>how long that picked set has been used today</Strong>, in five-minute steps,
                so the circle on Today can cover the whole phone rather than only what happens inside
                this app. It is one number for the set as a whole — never per app, because the tokens
                do not allow it — and it is worked out on the device. It is never sent to us.
              </p>
              <p>
                On a phone that has joined a family, that one daily total goes to the parent with the
                rest of the report, and it is in the table above. It is there because a linked phone
                whose whole day went into the official apps would otherwise report a clean one. The
                picked apps themselves are still never revealed — not to the parent and not to us —
                and because the reading arrives in steps it is a floor rather than an exact time. A
                phone that cannot measure it at all reads as <em>cannot tell</em>, never as a day with
                nothing in it.
              </p>
            </Section>

            <Section id="notifications" title="Notifications">
              <p>
                If you turn on reminders, TimeWell schedules them{' '}
                <Strong>locally on your device</Strong>. There are no push notifications, no push
                token, and no server involved. Turning reminders off cancels everything scheduled.
              </p>
            </Section>

            <Section id="children" title="Children">
              <p>
                TimeWell is not directed at children under 13, and we do not knowingly collect their
                data. The family link is designed for a parent setting the app up on a young
                person&apos;s device; in that case the parent is the account holder and everything
                above applies to them.
              </p>
              <p>
                That link is the one place where data about a young person reaches us at all, and it
                is limited to the table in &ldquo;The family link&rdquo; above. It needs a code typed
                in on the young person&apos;s own phone, that phone shows exactly what is shared both
                before and after it is linked, and it can be unlinked from there at any time — which
                deletes what was sent.
              </p>
            </Section>

            <Section id="rights" title="Your rights">
              <p>
                Wherever you live, you can ask us what we hold about you, to correct it, to have it
                deleted, or to have a copy of it. Deletion is one tap away and needs no request at
                all: <Strong>You → Account → Delete my account</Strong> is immediate and permanent.
              </p>
              <p>
                For anything else, including a copy of what is held, email{' '}
                <a
                  href="mailto:support@timewell.app"
                  className="text-fortunas-accent hover:underline font-medium"
                >
                  support@timewell.app
                </a>{' '}
                and we will answer within 30 days. Most of what TimeWell knows about you is already
                on your phone and is never sent to us, so for that part there is nothing on our side
                to send back.
              </p>
              <p>
                If you are in the EU or the UK: our legal basis is your consent for analytics, and
                the performance of our contract with you for accounts and subscriptions. You may
                withdraw consent at any time by uninstalling or by writing to us. You also have the
                right to complain to your national data-protection authority.
              </p>
              <p>
                If you are in California: we do not sell or share personal information as those
                terms are defined by the CCPA, and we have not done so in the preceding twelve
                months.
              </p>
            </Section>

            <Section id="retention" title="Retention">
              <p>
                On-device data lives until you delete it or uninstall. Analytics events are retained
                by PostHog for 12 months. Account records are deleted immediately on request. A
                family report is only ever the latest one, overwritten on every report and deleted
                when the link ends. Purchase records are kept for as long as tax law requires us to
                keep them. <Strong>Conversations with Sol are not retained by us at all</Strong> —
                there is nothing on our side to delete, and the copy on your phone goes when you tap
                Forget, when it rolls past 40 messages, or when you delete the app.
              </p>
            </Section>

            <Section id="changes" title="Changes">
              <p>
                If this policy changes in a way that affects what leaves your device, the app will
                tell you before the change takes effect rather than quietly updating a web page.
              </p>
            </Section>

            <Section id="who-we-are" title="Who we are">
              <p>
                TimeWell is operated by <Strong>Fortunas</Strong>, Rotterdam, the Netherlands.
                Questions about this policy, and any request under the rights above:{' '}
                <a
                  href="mailto:support@timewell.app"
                  className="text-fortunas-accent hover:underline font-medium"
                >
                  support@timewell.app
                </a>
                .
              </p>
            </Section>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default TimeWellPrivacy
