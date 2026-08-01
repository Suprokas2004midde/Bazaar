import React from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';
import { Card, CardContent } from '../components/ui/card';
import { ShieldCheck, Sparkles, Headphones } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-12">
      {/* Page Title */}
      <div className="text-2xl text-center pt-8 border-t border-[var(--border-color)]/40">
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      {/* Story Section */}
      <div className="my-8 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 overflow-hidden rounded-2xl border border-[var(--border-color)] shadow-lg">
          <img
            className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop"
            alt="About Bazaar fashion"
          />
        </div>

        <div className="flex flex-col justify-center space-y-4 md:w-1/2 text-[var(--text-muted)] leading-relaxed">
          <p className="text-base sm:text-lg font-medium text-[var(--text-main)]">
            Bazaar was born out of a passion for innovation and a desire to revolutionize the modern shopping experience.
          </p>
          <p className="text-sm">
            Since our inception, we've worked tirelessly to curate a diverse selection high-quality products catering to every taste and preference — from fashion and daily updates to premium electronics.
          </p>
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]/40 space-y-2">
            <h3 className="font-extrabold text-[var(--text-main)] uppercase tracking-wider text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--primary-accent)]" /> Our Mission
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              To empower customers with choice, convenience, and confidence through an exceptional, seamless shopping journey.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center pt-6">
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-[var(--primary-accent)] transition-all">
          <CardContent className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[var(--secondary-accent)]/20 text-[var(--primary-accent)] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[var(--text-main)]">Quality Assurance</h4>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              We meticulously select and vet each product to ensure it meets our stringent quality standards.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-[var(--primary-accent)] transition-all">
          <CardContent className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[var(--secondary-accent)]/20 text-[var(--primary-accent)] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[var(--text-main)]">Convenience</h4>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              With our user-friendly interface and hassle-free ordering process, shopping has never been smoother.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-[var(--primary-accent)] transition-all">
          <CardContent className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[var(--secondary-accent)]/20 text-[var(--primary-accent)] flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[var(--text-main)]">Exceptional Support</h4>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Our team of dedicated professionals is here to assist you around the clock with utmost care.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Newsletter */}
      <NewsletterBox />
    </div>
  );
};

export default About;
