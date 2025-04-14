import { siteConfig } from '@/config/site';
import { Mail } from 'lucide-react';
import { Icons } from './icons';

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex space-x-4">
            <a
              target="_blank"
              rel="noreferrer"
              href="mailto:support@buddybeep.com"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="sr-only">Mail</span>
              <Mail className="h-5 w-5" />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href={siteConfig.links.discord}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="sr-only">Discord</span>
              <Icons.discord className="h-5 w-5" />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href={siteConfig.links.github}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="sr-only">GitHub</span>
              <Icons.gitHub className="h-5 w-5" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
