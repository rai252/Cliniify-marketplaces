"use client";

import Image from "next/image";
import BlogList from "./components/blog-list";
import { useEffect } from "react";
import WOW from "wowjs";
import "animate.css";
import SearchSection from "./components/SearchSection";
import SpecializationList from "./components/SpecializationList";
import Personalized from "./components/care-personalized";
import Patients from "./components/Patients";
import BookDoctor from "./components/Book-Doctor";
import Consultation from "./components/Consultation";
import DataSecurity from "./components/Data-Security";
import Features from "./components/Features";
import DownloadApp from "./components/Download-app";

export default function Home() {
  useEffect(() => {
    const wow = new WOW.WOW({
      boxClass: "wow",
      animateClass: "animate__animated",
      offset: 50,
      mobile: true,
      live: true,
    });
    wow.init();
  }, []);

  const faqDataleft = [
    {
      question: "How does Cliniify marketplace work?",
      answer:
        "Cliniify's marketplace is a platform where you can easily find doctors and clinics near you. Simply enter your location and the type of medical specialist or service you need, and our platform will provide you with a list of relevant options in your area.",
    },
    {
      question: "What types of doctors and clinics can I find on Cliniify?",
      answer:
        "Cliniify marketplace offers a comprehensive range of healthcare providers, including general practitioners, specialists in various fields (such as dermatology, cardiology, pediatrics, etc.), dental clinics, eye clinics, and more. Whether you need a routine check-up or specialized treatment, you can find the right healthcare professional on our platform.",
    },
    {
      question: "How can I book appointments through Cliniify?",
      answer:
        "Booking appointments on Cliniify is simple and convenient. Once you've selected a doctor or clinic, you can view their available appointment slots and choose a time that suits you. Then, you can book the appointment directly through our platform, eliminating the need for phone calls or waiting on hold.",
    },
    {
      question: "Are the doctors and clinics on Cliniify trustworthy?",
      answer:
        "Yes, all the doctors and clinics listed on Cliniify marketplace are verified and reputable healthcare providers. We ensure that they meet our strict standards for licensure, qualifications, and quality of care. Additionally, you can read reviews from other patients to help you make an informed decision.",
    },
  ];

  const faqDataright = [
    {
      question: "How can I contact Cliniify customer support?",
      answer:
        "You can contact us through our website or app, or by email at hello@cliniify.com",
    },
    {
      question: "What are Cliniify fees?",
      answer:
        "Cliniify is free to use for patients! We do not charge any fees for searching for doctors, booking appointments, or reading reviews.",
    },
    {
      question: "Is Cliniify HIPAA-compliant?",
      answer:
        "Yes, Cliniify takes patient privacy very seriously and is fully HIPAA-compliant.",
    },
  ];

  return (
    <div className="main-section">
      <SearchSection />

      <SpecializationList />

      <Personalized />

      <Patients />

      <BookDoctor />

      <Consultation />

      <DataSecurity />

      <Features />

      <DownloadApp />

      <BlogList />
    </div>
  );
}
