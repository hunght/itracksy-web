import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { NewsletterEmail } from '@/emails/NewsletterEmail';
import TipsEmail from '@/emails/TipsEmail';
import BetaInviteBuddybeepEmail from '@/emails/BetaInviteEmail';
import LaunchEmail from '@/emails/LaunchEmail';

export const EMAIL_TEMPLATES = {
  welcome: WelcomeEmail,
  newsletter: NewsletterEmail,
  betaInviteEmail: TipsEmail,
  invite_buddybeep_email_template: BetaInviteBuddybeepEmail,
  launch_email_template: LaunchEmail,
} as const;

export type TemplateType = keyof typeof EMAIL_TEMPLATES;
