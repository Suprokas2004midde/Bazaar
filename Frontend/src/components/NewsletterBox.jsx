import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";

const NewsletterBox = () => {
  const [Email, setemail] = useState("");

  const handelchange = (event) => {
    setemail(event.target.value);
  };

  const onsubmitHandler = (event) => {
    event.preventDefault();
    const submitData = {
      email: Email,
    };
    console.log(submitData);
    setemail("");
  };

  return (
    <Card className="my-14 overflow-hidden border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-subtle)]">
      <CardContent className="p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-[var(--secondary-accent)]/20 text-[var(--primary-accent)] flex items-center justify-center mx-auto mb-2">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
          Subscribe Now & Get 20% Off
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          Join our VIP newsletter for exclusive discounts, early access to new arrivals, and special seasonal offers.
        </p>
        <form
          onSubmit={onsubmitHandler}
          className="flex flex-col sm:flex-row items-center gap-3 pt-2"
        >
          <Input
            onChange={handelchange}
            value={Email}
            type="email"
            placeholder="Enter your email address"
            className="flex-1 bg-[var(--bg-main)]"
            required
          />
          <Button type="submit" size="lg" className="w-full sm:w-auto font-bold uppercase tracking-wider">
            Subscribe
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewsletterBox;
