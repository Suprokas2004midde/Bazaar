import React from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, Phone, Mail, Briefcase } from 'lucide-react';

const Contacts = () => {
  return (
    <div className="space-y-12">
      {/* Page Title */}
      <div className="text-2xl text-center pt-8 border-t border-[var(--border-color)]/40">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 my-10">
        <div className="w-full lg:w-1/2 overflow-hidden rounded-2xl border border-[var(--border-color)] shadow-lg">
          <img
            className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop"
            alt="Our store workspace"
          />
        </div>

        <Card className="w-full lg:w-1/2 border-[var(--border-color)]">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <h3 className="font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--primary-accent)]" /> Our Store Headquarters
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed pl-7">
                54709 Willms Station <br />
                Suite 350, Washington, USA
              </p>
              <div className="space-y-1 text-sm text-[var(--text-muted)] pl-7 pt-1 font-medium">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--primary-accent)]" /> (415) 555-0132
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--primary-accent)]" /> contact@bazaar.com
                </p>
              </div>
            </div>

            <hr className="border-[var(--border-color)]/40" />

            <div className="space-y-3">
              <h3 className="font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[var(--primary-accent)]" /> Careers at Bazaar
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                Learn more about our vibrant engineering, design, and operations teams.
              </p>
              <Button variant="outline" size="lg" className="mt-2 font-bold uppercase tracking-wider">
                Explore Open Positions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Newsletter */}
      <NewsletterBox />
    </div>
  );
};

export default Contacts;
