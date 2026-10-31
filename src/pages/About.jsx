import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../animations/gsap";
import { revealText } from "../animations/motion";
import { AUTHOR, DISCLAIMER, OFFICIAL_URL } from "../data/site";
import PageMeta from "../components/layout/PageMeta";
import PageHero from "../components/layout/PageHero";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { photos } from "../assets/photos/photos";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FIELDS = [
  { name: "name", label: "Your name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email address", type: "email", autoComplete: "email" },
  { name: "topic", label: "What's it about?", type: "text", autoComplete: "off", optional: true },
  { name: "message", label: "Message", type: "textarea" },
];

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "Enter an email like name@example.com.";
  if (values.message.trim().length < 10) errors.message = "Write at least 10 characters so there's something to read.";
  return errors;
}

export default function About() {
  const rootRef = useRef(null);
  const formRef = useRef(null);
  const [values, setValues] = useState({ name: "", email: "", topic: "", message: "" });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const errors = validate(values);
  const showError = (n) => (touched[n] || submitted) && errors[n];

  useGSAP(
    () => {
      revealText(".story__title", { type: "chars", stagger: 0.02 });
      revealText(".story__body p", { stagger: 0.08 });
      revealText(".contact__title", { type: "chars", stagger: 0.02 });
      if (prefersReducedMotion()) return;
      gsap.from(".field", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        scrollTrigger: { trigger: ".contact__form", start: "top 85%", once: true },
      });
    },
    { scope: rootRef },
  );

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const first = FIELDS.find((f) => errors[f.name]);
    if (first) {
      const el = formRef.current.elements[first.name];
      el.focus();
      if (!prefersReducedMotion()) gsap.fromTo(el.closest(".field"), { x: -10 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      return;
    }
    setSent(true);
  };

  const reset = () => {
    setValues({ name: "", email: "", topic: "", message: "" });
    setTouched({});
    setSubmitted(false);
    setSent(false);
  };

  return (
    <div ref={rootRef}>
      <PageMeta route="about" />
      <PageHero
        title="About"
        lede="A fan's love letter to Leonida, built to practise web animation. Not a Rockstar site."
        image={photos["vice-rooftop"]}
      />

      <section className="story section" aria-labelledby="story-title">
        <div className="wrap story__grid">
          <h2 id="story-title" className="story__title">
            Why this exists
          </h2>
          <div className="story__body">
            <p>
              This started as a single intro animation, the VI mark opening onto Vice City, and grew into a full site for the wait until
              November. Everything moves with GSAP and Lenis; nothing is a template.
            </p>
            <p>
              Facts come from Rockstar's own pages and videos, and every trailer plays from Rockstar's YouTube channel. Screenshots are Rockstar's own, and credited
              wherever they appear.
            </p>
            <p className="story__fine">{DISCLAIMER}</p>
            <div className="story__links">
              <Button href={OFFICIAL_URL} variant="ghost" icon="arrowUpRight" magnetic={false}>
                The official site
              </Button>
              <Button href={AUTHOR.url} variant="ghost" icon="arrowUpRight" magnetic={false}>
                {AUTHOR.name} on LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="contact section" aria-labelledby="contact-title">
        <div className="wrap contact__grid">
          <div>
            <h2 id="contact-title" className="contact__title">
              Say hello
            </h2>
            <p className="contact__intro">
              Spotted a mistake or have an idea? The form checks your message in the browser. It's a demo with no server, so for a real reply
              use LinkedIn.
            </p>
          </div>

          {sent ? (
            <div className="contact__done" role="status">
              <Icon name="check" size="2.4rem" />
              <h3>Looks good, {values.name.trim().split(" ")[0]}.</h3>
              <p>Your message passed every check. Nothing was sent, because this demo has no server; reach out on LinkedIn for a reply.</p>
              <div className="contact__done-actions">
                <Button href={AUTHOR.url} icon="arrowUpRight">
                  Message on LinkedIn
                </Button>
                <Button onClick={reset} variant="ghost" magnetic={false}>
                  Write another
                </Button>
              </div>
            </div>
          ) : (
            <form ref={formRef} className="contact__form" onSubmit={onSubmit} noValidate>
              {FIELDS.map((f) => {
                const err = showError(f.name);
                const Tag = f.type === "textarea" ? "textarea" : "input";
                return (
                  <div key={f.name} className={`field ${values[f.name] ? "has-value" : ""} ${err ? "has-error" : ""}`}>
                    <Tag
                      id={`f-${f.name}`}
                      name={f.name}
                      type={Tag === "input" ? f.type : undefined}
                      rows={Tag === "textarea" ? 5 : undefined}
                      autoComplete={f.autoComplete}
                      className="field__input"
                      value={values[f.name]}
                      placeholder=" "
                      required={!f.optional}
                      aria-invalid={err ? "true" : undefined}
                      aria-describedby={err ? `f-${f.name}-err` : undefined}
                      onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                      onBlur={() => setTouched((t) => ({ ...t, [f.name]: true }))}
                    />
                    <label htmlFor={`f-${f.name}`} className="field__label">
                      {f.label}
                      {f.optional && <span className="field__opt"> (optional)</span>}
                    </label>
                    <span className="field__line" aria-hidden="true" />
                    {err && (
                      <p id={`f-${f.name}-err`} className="field__error">
                        <Icon name="warning" size="1.1em" />
                        {err}
                      </p>
                    )}
                  </div>
                );
              })}
              <div className="contact__submit">
                <Button type="submit" icon="arrowRight">
                  Check my message
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
