interface User {
  id: string;
  email: string | null;
  email_campaign_status: number;
}

interface EmailCampaigns {
  [key: string]: number;
}

interface UserListProps {
  users: User[];
  emailCampaigns: EmailCampaigns;
}
