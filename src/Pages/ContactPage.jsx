import { useState } from "react";

const PHONE = "+918469461557";
const PHONE_DISPLAY = "+91 84694 61557";
const EMAIL = "megsale.admin@gmail.com";
const ADDRESS =
  "Office No FF 15 Anaya Business Centre, Panderasara, Althan, Surat, Gujarat 394210";

const contactCards = [
  {
    icon: "fa-phone",
    title: "Call Us",
    detail: PHONE_DISPLAY,
    subtitle: "Mon–Sat, 9 AM – 6 PM",
    href: `tel:${PHONE}`,
  },
  {
    icon: "fa-envelope",
    title: "Email Us",
    detail: EMAIL,
    subtitle: "We usually reply within 24 hours",
    href: `mailto:${EMAIL}`,
  },
  {
    icon: "fa-location-dot",
    title: "Our Location",
    detail: "Anaya Business Centre",
    subtitle: "Althan, Surat, Gujarat",
    href: "https://www.google.com/maps/search/?api=1&query=Anaya+Business+Centre+Althan+Surat+Gujarat",
  },
  {
    icon: "fa-clock",
    title: "Support Hours",
    detail: "Monday – Saturday",
    subtitle: "9:00 AM – 6:00 PM",
    href: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > 3) {
      setFeedback({
        type: "error",
        message: "You can select a maximum of 3 images.",
      });
      event.target.value = "";
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        setFeedback({
          type: "error",
          message: "Only JPG, PNG, and WEBP images are allowed.",
        });
        event.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFeedback({
          type: "error",
          message: "Each image must be 5 MB or smaller.",
        });
        event.target.value = "";
        return;
      }
    }

    setImages(selectedFiles);
    setFeedback({ type: "", message: "" });
  };

  const removeImage = (indexToRemove) => {
    setImages((currentImages) =>
      currentImages.filter((_, index) => index !== indexToRemove),
    );
  };

const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setFeedback({ type: "", message: "" });

    try {
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("subject", form.subject);
        formData.append("message", form.message);

        images.forEach((image) => {
            formData.append("images", image);
        });

        const response = await fetch("http://localhost:5000/api/contact", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to send your message.");
        }

        setFeedback({
            type: "success",
            message:
                data.message || "Your message has been submitted successfully!",
        });

        setForm({
            name: "",
            email: "",
            subject: "",
            message: "",
        });

        setImages([]);

        const imageInput = document.getElementById("contact-images");
        if (imageInput) {
            imageInput.value = "";
        }
    } catch (error) {
        setFeedback({
            type: "error",
            message:
                error.message === "Failed to fetch"
                    ? "Cannot connect to the server. Please check that the backend is running."
                    : error.message || "Something went wrong. Please try again.",
        });
    } finally {
        setLoading(false);
    }
};


  return (
    <main className="contact-page overflow-hidden text-slate-800">
      {/* Hero */}
      <section className="contact-hero relative">
        <div className="contact-orb contact-orb-one" />
        <div className="contact-orb contact-orb-two" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
          <div className="contact-reveal">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              We're here to help
            </span>

            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Let's Start a{" "}
              <span className="contact-gradient-text">Conversation</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Have a question about your order, products, or delivery? Our
              friendly support team is here to make your shopping experience
              better.
            </p>
          </div>

          <div className="contact-hero-art relative hidden h-44 items-center justify-center lg:flex">
            <div className="absolute h-44 w-44 rounded-full border border-orange-300/60" />
            <div className="absolute h-36 w-36 rounded-full bg-white/80 shadow-xl shadow-orange-200/50" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-xl shadow-orange-300/50">
              <i className="fa-solid fa-headset text-5xl" />
            </div>
            <i className="fa-solid fa-envelope absolute right-10 top-2 rounded-2xl bg-white p-4 text-2xl text-orange-500 shadow-lg" />
            <i className="fa-solid fa-comments absolute bottom-0 left-8 rounded-2xl bg-white p-4 text-2xl text-orange-500 shadow-lg" />
            <i className="fa-solid fa-paper-plane absolute bottom-2 right-8 text-3xl text-orange-400" />
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="relative z-10 mx-auto -mt-3 max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {contactCards.map((card, index) => {
            const content = (
              <>
                <span className="contact-icon-box">
                  <i className={`fa-solid ${card.icon}`} />
                </span>

                <h2 className="mt-5 text-base font-bold text-slate-900 sm:text-lg">
                  {card.title}
                </h2>

                <p className="mt-2 break-words text-sm font-bold text-orange-600">
                  {card.detail}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
                  {card.subtitle}
                </p>

                <span className="contact-card-arrow" aria-hidden="true">
                  <i className="fa-solid fa-arrow-right" />
                </span>
              </>
            );

            return card.href ? (
              <a
                key={card.title}
                href={card.href}
                target={card.title === "Our Location" ? "_blank" : undefined}
                rel={card.title === "Our Location" ? "noreferrer" : undefined}
                className="contact-info-card contact-reveal"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                {content}
              </a>
            ) : (
              <div
                key={card.title}
                className="contact-info-card contact-reveal"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                {content}
              </div>
            );
          })}
        </div>
      </section>

      {/* Form and map */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="grid items-stretch gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Contact form */}
          <div className="contact-panel contact-reveal">
            <span className="contact-eyebrow">
              <i className="fa-solid fa-paper-plane" />
              Send a message
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
              Get in Touch
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Fill in the details below and let us know how we can help.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {feedback.message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl border p-4 text-sm font-medium ${
                    feedback.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Full Name <span className="text-orange-500">*</span>
                  </label>
                  <div className="contact-input-wrap">
                    <i className="fa-regular fa-user" />
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Email Address <span className="text-orange-500">*</span>
                  </label>
                  <div className="contact-input-wrap">
                    <i className="fa-regular fa-envelope" />
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-sm font-semibold"
                >
                  Subject <span className="text-orange-500">*</span>
                </label>
                <div className="contact-input-wrap">
                  <i className="fa-regular fa-comment-dots" />
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help you?"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your Message <span className="text-orange-500">*</span>
                </label>
                <div className="contact-input-wrap contact-textarea-wrap">
                  <i className="fa-regular fa-file-lines" />
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Image Attachments */}
              <div>
                <label
                  htmlFor="contact-images"
                  className="mb-2 block text-sm font-semibold"
                >
                  Attach Images{" "}
                  <span className="text-slate-400">(Optional)</span>
                </label>

                <input
                  id="contact-images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
                />

                <p className="mt-2 text-xs text-slate-500">
                  JPG, PNG or WEBP. Maximum 3 images, 5 MB per image.
                </p>

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Selected attachment ${index + 1}`}
                          className="h-28 w-full rounded-lg object-cover"
                        />

                        <p className="mt-2 truncate text-xs text-slate-600">
                          {file.name}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="mt-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="contact-submit-button disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <i
                    className={`fa-regular ${loading ? "fa-hourglass-half" : "fa-paper-plane"}`}
                  />
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && (
                    <i className="fa-solid fa-arrow-right ml-auto" />
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Location panel */}
          <div className="contact-panel contact-map-panel contact-reveal">
            <span className="contact-eyebrow">
              <i className="fa-solid fa-location-dot" />
              Visit us
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
              Our Location
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Find us on Google Maps or visit our office.
            </p>

            <div className="contact-map-frame mt-5">
              <iframe
                title="RUROO MegaSale office location in Surat"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  ADDRESS,
                )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-orange-50/80 p-4 sm:flex-row sm:items-center">
              <span className="contact-location-icon">
                <i className="fa-solid fa-location-dot" />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900">
                  Anaya Business Centre
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Office No FF 15, Panderasara, Althan, Surat, Gujarat 394210
                </p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  ADDRESS,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="contact-map-button"
              >
                Open Maps
                <i className="fa-solid fa-arrow-up-right-from-square" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
