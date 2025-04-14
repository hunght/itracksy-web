import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { NewsletterEmail } from '@/emails/NewsletterEmail';
import TipsEmail from '@/emails/TipsEmail';
import BetaInviteBuddybeepEmail from '@/emails/BetaInviteEmail';
import { Laugh } from 'lucide-react';

export const EMAIL_TEMPLATES = {
  welcome: WelcomeEmail,
  newsletter: NewsletterEmail,
  betaInviteEmail: TipsEmail,
  invite_buddybeep_email_template: BetaInviteBuddybeepEmail,
  laungh_email_template: TipsEmail,
} as const;

export type TemplateType = keyof typeof EMAIL_TEMPLATES;
