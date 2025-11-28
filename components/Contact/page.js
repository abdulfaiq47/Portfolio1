"use client";
import React from "react";
import { ContainerScroll } from "../ContacScroler/page";
import Image from "next/image";
import "./ContactF.css";
import { toast, ToastContainer } from "react-toastify";

export function ContactF() {
  const onSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    formData.append("access_key", "b67e81e6-5afe-4f61-8f5d-7124e7f811ea");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      toast.success("Thank you! Message successfully delivered to Faiq.");
      event.target.reset();
    } else {
      toast.error("Ops! Got Error");
    }
  };
  return (
    <div className="contact-section">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="title">
              Unleash the power of <br />
              <span className="highlight">Contact Form   </span>
            </h1>
          </>
        }
      >
        <form onSubmit={onSubmit} className="contact-form">
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea
            name="message"
            placeholder="Your Message"
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </ContainerScroll>
      <ToastContainer />
    </div>
  );
}
