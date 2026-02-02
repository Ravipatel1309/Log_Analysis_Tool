/**
 * About Us Page - Static information page
 */

import { Code, Heart } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="text-center max-w-lg">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Code className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Developed by <span className="text-foreground font-semibold">Ravi Patel</span>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mt-2">
          Built for <span className="text-primary font-semibold">OpsHub developers</span> for effective log analysis.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-destructive fill-destructive" />
          <span>for better debugging</span>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
