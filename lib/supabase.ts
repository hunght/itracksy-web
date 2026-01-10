export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      campaign_leads: {
        Row: {
          campaign_id: string;
          clicked_at: string | null;
          created_at: string;
          id: string;
          lead_id: string;
          opened_at: string | null;
          sent_at: string | null;
          status: string | null;
        };
        Insert: {
          campaign_id: string;
          clicked_at?: string | null;
          created_at?: string;
          id?: string;
          lead_id: string;
          opened_at?: string | null;
          sent_at?: string | null;
          status?: string | null;
        };
        Update: {
          campaign_id?: string;
          clicked_at?: string | null;
          created_at?: string;
          id?: string;
          lead_id?: string;
          opened_at?: string | null;
          sent_at?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'campaign_leads_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'marketing_campaigns';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'campaign_leads_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
        ];
      };
      email_threads: {
        Row: {
          body_html: string | null;
          body_text: string | null;
          campaign_id: string | null;
          created_at: string | null;
          direction: string;
          feedback_id: string | null;
          from_email: string;
          from_name: string | null;
          id: string;
          in_reply_to: string | null;
          is_read: boolean | null;
          lead_id: string | null;
          message_id: string | null;
          received_at: string | null;
          references: string | null;
          subject: string | null;
          to_email: string;
        };
        Insert: {
          body_html?: string | null;
          body_text?: string | null;
          campaign_id?: string | null;
          created_at?: string | null;
          direction: string;
          feedback_id?: string | null;
          from_email: string;
          from_name?: string | null;
          id?: string;
          in_reply_to?: string | null;
          is_read?: boolean | null;
          lead_id?: string | null;
          message_id?: string | null;
          received_at?: string | null;
          references?: string | null;
          subject?: string | null;
          to_email: string;
        };
        Update: {
          body_html?: string | null;
          body_text?: string | null;
          campaign_id?: string | null;
          created_at?: string | null;
          direction?: string;
          feedback_id?: string | null;
          from_email?: string;
          from_name?: string | null;
          id?: string;
          in_reply_to?: string | null;
          is_read?: boolean | null;
          lead_id?: string | null;
          message_id?: string | null;
          received_at?: string | null;
          references?: string | null;
          subject?: string | null;
          to_email?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'email_threads_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'marketing_campaigns';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'email_threads_feedback_id_fkey';
            columns: ['feedback_id'];
            isOneToOne: false;
            referencedRelation: 'feedback';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'email_threads_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
        ];
      };
      feedback: {
        Row: {
          created_at: string;
          email: string;
          feedback_type: string;
          id: string;
          message: string;
          name: string;
          replied_at: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          feedback_type: string;
          id?: string;
          message: string;
          name: string;
          replied_at?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          feedback_type?: string;
          id?: string;
          message?: string;
          name?: string;
          replied_at?: string | null;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          created_at: string;
          email: string;
          group: string | null;
          id: string;
          message: string;
          name: string;
          phone: string;
          submission_time: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          group?: string | null;
          id?: string;
          message: string;
          name: string;
          phone: string;
          submission_time: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          group?: string | null;
          id?: string;
          message?: string;
          name?: string;
          phone?: string;
          submission_time?: string;
        };
        Relationships: [];
      };
      marketing_campaigns: {
        Row: {
          created_at: string;
          description: string | null;
          email_content: string | null;
          email_subject: string;
          email_template: string;
          id: string;
          name: string;
          sent_at: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          email_content?: string | null;
          email_subject: string;
          email_template: string;
          id?: string;
          name: string;
          sent_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          email_content?: string | null;
          email_subject?: string;
          email_template?: string;
          id?: string;
          name?: string;
          sent_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      unread_emails_count: {
        Row: {
          count: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      bytea_to_text: { Args: { data: string }; Returns: string };
      http: {
        Args: { request: Database['public']['CompositeTypes']['http_request'] };
        Returns: Database['public']['CompositeTypes']['http_response'];
        SetofOptions: {
          from: 'http_request';
          to: 'http_response';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      http_delete:
        | {
            Args: { uri: string };
            Returns: Database['public']['CompositeTypes']['http_response'];
            SetofOptions: {
              from: '*';
              to: 'http_response';
              isOneToOne: true;
              isSetofReturn: false;
            };
          }
        | {
            Args: { content: string; content_type: string; uri: string };
            Returns: Database['public']['CompositeTypes']['http_response'];
            SetofOptions: {
              from: '*';
              to: 'http_response';
              isOneToOne: true;
              isSetofReturn: false;
            };
          };
      http_get:
        | {
            Args: { uri: string };
            Returns: Database['public']['CompositeTypes']['http_response'];
            SetofOptions: {
              from: '*';
              to: 'http_response';
              isOneToOne: true;
              isSetofReturn: false;
            };
          }
        | {
            Args: { data: Json; uri: string };
            Returns: Database['public']['CompositeTypes']['http_response'];
            SetofOptions: {
              from: '*';
              to: 'http_response';
              isOneToOne: true;
              isSetofReturn: false;
            };
          };
      http_head: {
        Args: { uri: string };
        Returns: Database['public']['CompositeTypes']['http_response'];
        SetofOptions: {
          from: '*';
          to: 'http_response';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      http_header: {
        Args: { field: string; value: string };
        Returns: Database['public']['CompositeTypes']['http_header'];
        SetofOptions: {
          from: '*';
          to: 'http_header';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      http_list_curlopt: {
        Args: never;
        Returns: {
          curlopt: string;
          value: string;
        }[];
      };
      http_patch: {
        Args: { content: string; content_type: string; uri: string };
        Returns: Database['public']['CompositeTypes']['http_response'];
        SetofOptions: {
          from: '*';
          to: 'http_response';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      http_post:
        | {
            Args: { content: string; content_type: string; uri: string };
            Returns: Database['public']['CompositeTypes']['http_response'];
            SetofOptions: {
              from: '*';
              to: 'http_response';
              isOneToOne: true;
              isSetofReturn: false;
            };
          }
        | {
            Args: { data: Json; uri: string };
            Returns: Database['public']['CompositeTypes']['http_response'];
            SetofOptions: {
              from: '*';
              to: 'http_response';
              isOneToOne: true;
              isSetofReturn: false;
            };
          };
      http_put: {
        Args: { content: string; content_type: string; uri: string };
        Returns: Database['public']['CompositeTypes']['http_response'];
        SetofOptions: {
          from: '*';
          to: 'http_response';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      http_reset_curlopt: { Args: never; Returns: boolean };
      http_set_curlopt: {
        Args: { curlopt: string; value: string };
        Returns: boolean;
      };
      send_campaign_data_to_api: { Args: never; Returns: undefined };
      text_to_bytea: { Args: { data: string }; Returns: string };
      urlencode:
        | { Args: { data: Json }; Returns: string }
        | {
            Args: { string: string };
            Returns: {
              error: true;
            } & 'Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved';
          }
        | {
            Args: { string: string };
            Returns: {
              error: true;
            } & 'Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved';
          };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      http_header: {
        field: string | null;
        value: string | null;
      };
      http_request: {
        method: unknown;
        uri: string | null;
        headers: Database['public']['CompositeTypes']['http_header'][] | null;
        content_type: string | null;
        content: string | null;
      };
      http_response: {
        status: number | null;
        content_type: string | null;
        headers: Database['public']['CompositeTypes']['http_header'][] | null;
        content: string | null;
      };
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
