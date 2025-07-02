export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      comments: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      feed_posts: {
        Row: {
          content: string
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      followers: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      marketplace: {
        Row: {
          created_at: string | null
          id: string
          price: number
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          price: number
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          price?: number
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          buyer_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          listing_id: string
          message: string | null
          offer_amount: number
          seller_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          listing_id: string
          message?: string | null
          offer_amount: number
          seller_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          listing_id?: string
          message?: string | null
          offer_amount?: number
          seller_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plushies: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      posts: {
        Row: {
          accepts_offers: boolean | null
          brand: string | null
          color: string | null
          condition: string | null
          content: string
          created_at: string | null
          delivery_cost: number | null
          delivery_method: string | null
          description: string | null
          filling: string | null
          for_sale: boolean | null
          id: string
          image: string | null
          listing_type: string | null
          material: string | null
          min_offer_amount: number | null
          offer_deadline: string | null
          price: number | null
          size: string | null
          species: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          accepts_offers?: boolean | null
          brand?: string | null
          color?: string | null
          condition?: string | null
          content: string
          created_at?: string | null
          delivery_cost?: number | null
          delivery_method?: string | null
          description?: string | null
          filling?: string | null
          for_sale?: boolean | null
          id?: string
          image?: string | null
          listing_type?: string | null
          material?: string | null
          min_offer_amount?: number | null
          offer_deadline?: string | null
          price?: number | null
          size?: string | null
          species?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          accepts_offers?: boolean | null
          brand?: string | null
          color?: string | null
          condition?: string | null
          content?: string
          created_at?: string | null
          delivery_cost?: number | null
          delivery_method?: string | null
          description?: string | null
          filling?: string | null
          for_sale?: boolean | null
          id?: string
          image?: string | null
          listing_type?: string | null
          material?: string | null
          min_offer_amount?: number | null
          offer_deadline?: string | null
          price?: number | null
          size?: string | null
          species?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          favorite_brands: string[] | null
          favorite_types: string[] | null
          full_name: string | null
          hide_from_search: boolean | null
          id: number | null
          instagram: string | null
          is_private: boolean | null
          location: string | null
          new_release_alerts: boolean | null
          phone_number: string | null
          postal_code: string | null
          receive_email_updates: boolean | null
          receive_marketing_emails: boolean | null
          receive_wishlist_alerts: boolean | null
          show_activity_status: boolean | null
          show_collection: boolean | null
          show_wishlist: boolean | null
          state_province: string | null
          twitter: string | null
          updated_at: string | null
          user_id: number
          user_uuid: string
          website: string | null
          youtube: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          favorite_brands?: string[] | null
          favorite_types?: string[] | null
          full_name?: string | null
          hide_from_search?: boolean | null
          id?: number | null
          instagram?: string | null
          is_private?: boolean | null
          location?: string | null
          new_release_alerts?: boolean | null
          phone_number?: string | null
          postal_code?: string | null
          receive_email_updates?: boolean | null
          receive_marketing_emails?: boolean | null
          receive_wishlist_alerts?: boolean | null
          show_activity_status?: boolean | null
          show_collection?: boolean | null
          show_wishlist?: boolean | null
          state_province?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: number
          user_uuid: string
          website?: string | null
          youtube?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          favorite_brands?: string[] | null
          favorite_types?: string[] | null
          full_name?: string | null
          hide_from_search?: boolean | null
          id?: number | null
          instagram?: string | null
          is_private?: boolean | null
          location?: string | null
          new_release_alerts?: boolean | null
          phone_number?: string | null
          postal_code?: string | null
          receive_email_updates?: boolean | null
          receive_marketing_emails?: boolean | null
          receive_wishlist_alerts?: boolean | null
          show_activity_status?: boolean | null
          show_collection?: boolean | null
          show_wishlist?: boolean | null
          state_province?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: number
          user_uuid?: string
          website?: string | null
          youtube?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          created_at: string
          id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trade_requests: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          message: string
          requester_id: string
          seller_id: string
          status: string
          trade_offer: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          message: string
          requester_id: string
          seller_id: string
          status?: string
          trade_offer: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          message?: string
          requester_id?: string
          seller_id?: string
          status?: string
          trade_offer?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_description: string | null
          badge_name: string
          badge_type: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_description?: string | null
          badge_name: string
          badge_type: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_description?: string | null
          badge_name?: string
          badge_type?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reviews: {
        Row: {
          created_at: string | null
          id: string
          rating: number
          review_text: string | null
          reviewed_user_id: string
          reviewer_id: string
          transaction_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating: number
          review_text?: string | null
          reviewed_user_id: string
          reviewer_id: string
          transaction_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number
          review_text?: string | null
          reviewed_user_id?: string
          reviewer_id?: string
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reviews_reviewed_user_id_fkey"
            columns: ["reviewed_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          clerk_id: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          clerk_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          clerk_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_offer_with_notification: {
        Args: {
          p_listing_id: string
          p_buyer_id: string
          p_seller_id: string
          p_offer_amount: number
          p_message?: string
        }
        Returns: string
      }
      create_user_safe: {
        Args: { user_data: Json }
        Returns: {
          id: string
          clerk_id: string
          username: string
          first_name: string
          last_name: string
          email: string
          avatar_url: string
        }[]
      }
      set_current_user_id: {
        Args: { user_id_param: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
